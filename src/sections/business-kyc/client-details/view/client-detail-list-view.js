import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { RouterLink } from 'src/routes/components';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//

import ClientDetailTableToolbar from '../clinet-deatail-table-toolbar';
import ClientDetailTableRow from '../client-detail-table-row';
import ClientBusinessProfileForm from '../client-profile-form';
import { useGetClientDetail } from 'src/api/clientDetail';
import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

const TABLE_HEAD = [
  { id: 'clientName', label: 'Client Name' },
  { id: 'cin', label: 'CIN' },
  { id: 'gstin', label: 'GSTIN' },
  { id: 'creditDays', label: 'Credit Days' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'status', label: 'Status' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// const DUMMY_CLIENT_DETAILS = [
//   {
//     id: '1',
//     name: 'ABC Pvt Ltd',
//     cin: 'U12345MH2020PTC000111',
//     gstin: '27ABCDE1234F1Z5',
//     turnover: 120, // in CR
//     avgCreditDays: 30,
//     relationship: 'Long Term Client',
//     avgInvoiceSize: 15,
//     contactDetails: '9876543210',
//     invoice: {
//       id: 'inv-001',
//       name: 'Invoice-001.pdf',
//     },
//     status: 1,
//     isDeleted: false,
//   },
//   {
//     id: '2',
//     name: 'XYZ Industries',
//     cin: 'U67890MH2019PTC000222',
//     gstin: '27XYZDE5678K1Z9',
//     turnover: 250,
//     avgCreditDays: 45,
//     relationship: 'Vendor Partner',
//     avgInvoiceSize: 22,
//     contactDetails: '9123456789',
//     invoice: {
//       id: 'inv-002',
//       name: 'Invoice-002.pdf',
//     },
//     status: 0,
//     isDeleted: false,
//   },
//   {
//     id: '3',
//     name: 'Demo Enterprises',
//     cin: 'U11111MH2021PTC000333',
//     gstin: '27DEMOE9999Q1Z1',
//     turnover: 80,
//     avgCreditDays: 60,
//     relationship: 'New Client',
//     avgInvoiceSize: 10,
//     contactDetails: '9988776655',
//     invoice: {
//       id: 'inv-003',
//       name: 'Invoice-003.pdf',
//     },
//     status: 1,
//     isDeleted: false,
//   },
// ];

// ----------------------------------------------------------------------

export default function ClientDetailListView({ percent, setActiveStepId }) {
  const table = useTable();

  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load client details from localStorage
  const [ClientDetail, setClientDetail] = useState(() => {
    try {
      const saved = localStorage.getItem('formData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.client_details?.clients || [];
      }
    } catch (error) {
      console.error('Error loading client details:', error);
    }
    return [];
  });

  const handleOpen = () => {
    setEditData(null); // create mode
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  // Save client details to localStorage
  const saveClientDetails = useCallback((clients) => {
    try {
      const saved = localStorage.getItem('formData');
      const formData = saved ? JSON.parse(saved) : {};
      formData.client_details = { clients };
      localStorage.setItem('formData', JSON.stringify(formData));
      setClientDetail(clients);
    } catch (error) {
      console.error('Error saving client details:', error);
    }
  }, []);

  // Handle form submit - add or update client
  const handleFormSubmit = useCallback(
    (data) => {
      const clients = [...ClientDetail];

      // Normalize invoice object to have name property for table display
      let invoiceObj = null;
      if (data.invoice) {
        if (data.invoice instanceof File || data.invoice?.file instanceof File) {
          // If it's a File object, create invoice object with name
          const file = data.invoice instanceof File ? data.invoice : data.invoice.file;
          invoiceObj = {
            id: data.invoiceFileId || `invoice-${Date.now()}`,
            name: file.name || 'invoice.pdf',
            file: file,
            ...data.invoice,
          };
        } else if (data.invoice.name) {
          // If it already has a name, use as is
          invoiceObj = data.invoice;
        } else {
          // Fallback: create object with name
          invoiceObj = {
            id: data.invoice.id || data.invoiceFileId || `invoice-${Date.now()}`,
            name: data.invoice.name || 'invoice.pdf',
            ...data.invoice,
          };
        }
      }

      if (editData?.id) {
        // Update existing client
        const index = clients.findIndex((c) => c.id === editData.id);
        if (index !== -1) {
          // Store full form data - preserve all original fields
          clients[index] = {
            ...clients[index], // Preserve all existing fields
            ...data, // Update with new form data
            id: editData.id,
            creditDays: data.avgCreditDays, // Map for table display
            invoice: invoiceObj || clients[index].invoice, // Update or preserve invoice
            status: clients[index].status ?? 0, // Preserve status
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Add new client - store full form data
        const newClient = {
          ...data, // Store all form fields
          id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          creditDays: data.avgCreditDays, // Map for table display
          invoice: invoiceObj,
          status: 0, // Default status
          createdAt: new Date().toISOString(),
        };
        clients.push(newClient);
      }

      saveClientDetails(clients);
    },
    [ClientDetail, editData, saveClientDetails]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.clientdetail.details(id));
    },
    [router]
  );

  // const handleEditRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.clientdetail.edit(id));
  //   },
  //   [router]
  // );
  const handleEditRow = useCallback((row) => {
    setEditData(row); // pass full row data
    setOpen(true);
  }, []);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: ClientDetail,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const updatedClients = ClientDetail.filter((client) => client.id !== id);
      saveClientDetails(updatedClients);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [ClientDetail, dataInPage.length, table, saveClientDetails]
  );

  const handleDeleteRows = useCallback(() => {
    const selectedIds = table.selected;
    const updatedClients = ClientDetail.filter((client) => !selectedIds.includes(client.id));
    saveClientDetails(updatedClients);
    table.onUpdatePageDeleteRows({
      totalRows: ClientDetail.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [ClientDetail, dataFiltered.length, dataInPage.length, table, saveClientDetails]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    if (ClientDetail && ClientDetail.length >= 1) {
      percent(100);
    } else {
      percent(0);
    }
  }, [percent, setActiveStepId, ClientDetail]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ px: 2 }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Left side label */}
          <Typography variant="h4" color="primary">
            Client List
          </Typography>

          <Button
            component={RouterLink}
            onClick={handleOpen}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            Add New Client
          </Button>
        </Box>
        <ClientBusinessProfileForm
          open={open}
          onClose={handleClose}
          defaultData={editData}
          onSubmitSuccess={handleFormSubmit}
        />

        <Card>
          {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs> */}

          {/* <ClientDetailTableToolbar filters={filters} onFilters={handleFilters} /> */}

          {/* {canReset && (
            <ClientDetailTableFiltersResult 
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={ClientDetail.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  ClientDetail.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={ClientDetail.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      ClientDetail.map((row) => row.id)
                    )
                  }
                  showCheckbox={false}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ClientDetailTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, ClientDetail.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>

        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button
            variant="contained"
            disabled={ClientDetail.length < 1}
            onClick={() => {
              percent(100);
              setActiveStepId();
            }}
          >
            Next
          </Button>
        </Box>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${table.selected.length} items?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
              table.onResetSelected(); // Clear selection after deletion
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData = [], comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filtered = stabilizedThis.map((el) => el[0]);

  if (name) {
    filtered = filtered.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(name.toLowerCase()))
    );
  }

  if (status !== 'all') {
    filtered = filtered.filter((item) => (status === 'active' ? !item.isDeleted : item.isDeleted));
  }

  return filtered;
}
