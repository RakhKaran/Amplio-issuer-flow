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

import GuarantorTableRow from '../guarantor-table-row';
import GuarantorTableFiltersResult from '../guarantor-table-filters-result';
import GuarantorTableToolbar from '../guarantor-table-toolbar';
import { Box, Typography } from '@mui/material';
import AddGuarantorForm from '../add-guarantor';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useGetGuarantors } from 'src/api/businessKyc';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

const TABLE_HEAD = [
  { id: 'guarantorName', label: 'Guarantor Name' },
  { id: 'guarantorType', label: 'Guarantor Type' },
  { id: 'GaurantorAmountLimit', label: 'Guarantor Amount Limit' },
  { id: 'estimatedNetWorth', label: 'Estimated Net Worth' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function GuarantorListView({ setActiveStepId, saveStepData, percent }) {
  const table = useTable();

  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [openAddGuarantor, setOpenAddGuarantor] = useState(false);
  const [selectedGuarantor, setSelectedGuarantor] = useState(null);

  const { guarantors = [], refreshGuarantors } = useGetGuarantors();
  const tableData = guarantors;

  const handleOpenAddGuarantor = () => {
    setSelectedGuarantor(null);
    setOpenAddGuarantor(true);
  };

  const handleCloseAddGuarantor = () => {
    setOpenAddGuarantor(false);
    setSelectedGuarantor(null);
  };

  const handleFormSubmit = useCallback(() => {
    refreshGuarantors();
    handleCloseAddGuarantor();
  }, [refreshGuarantors]);

  const handleViewGuarantor = (row) => {
    setSelectedGuarantor(row);
    setOpenAddGuarantor(true);
  };

  const handleEditRow = useCallback((row) => {
    setSelectedGuarantor(row);
    setOpenAddGuarantor(true);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.tableData.details(id));
    },
    [router]
  );

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
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

  const handleDeleteRow = useCallback(() => {
    enqueueSnackbar('Delete API not implemented yet', { variant: 'warning' });
  }, []);

  // Update percent when guarantors are added
  useEffect(() => {
    if (tableData && tableData.length >= 1) {
      percent(100);
    } else {
      percent(0);
    }
  }, [ tableData]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
            Guarantor List
          </Typography>

          {/* Right side button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenAddGuarantor}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            Add Guarantor
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
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
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
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
                      <GuarantorTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewGuarantor(row)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage)}
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
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
            disabled={tableData.length < 1}
            onClick={async () => {
              try {
                // 1️⃣ Call backend CONTINUE API
                const response = await axiosInstance.post(
                  '/business-kyc/guarantor-details/continue'
                );

                // 2️⃣ Read next step from backend
                const nextStepCode = response?.data?.currentStatus?.code;

                if (!nextStepCode) {
                  enqueueSnackbar('Unable to move to next step', { variant: 'error' });
                  return;
                }

                // 3️⃣ Move UI to next step
                setActiveStepId(nextStepCode);

                // 4️⃣ UI feedback
                percent(100);
                enqueueSnackbar('Guarantor step completed', { variant: 'success' });
              } catch (error) {
                console.error(error);
                enqueueSnackbar(error?.response?.data?.message || 'Failed to continue', {
                  variant: 'error',
                });
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Container>

      <AddGuarantorForm
        open={openAddGuarantor}
        onClose={handleCloseAddGuarantor}
        currentGurantor={selectedGuarantor}
        onSubmitSuccess={handleFormSubmit}
      />

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
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

GuarantorListView.propTypes = {
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
  saveStepData: PropTypes.func,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((emails) =>
      Object.values(emails).some((value) =>
        String(value).toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((emails) =>
      status === 'active' ? !emails.isDeleted : emails.isDeleted
    );
  }

  return inputData;
}
