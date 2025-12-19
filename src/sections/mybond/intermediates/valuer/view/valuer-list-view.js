import { useState } from 'react';
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tab,
  Stack,
  Button,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom } from 'src/components/table';

import { VALUERS } from '../../intermediates-dummy-date';
import ValuerTableToolbar from '../valuer-table-toolbar';
import ValuerTableRow from '../valuer-table-row';
import { useRouter } from 'src/routes/hook';

// ------------------------------------------------------

const TABLE_HEAD = [
  { id: 'legalEntityName', label: 'Valuer' },
  { id: 'experience', label: 'Experience' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'fees', label: 'Fees' },
  { id: 'responseTime', label: 'Response Time' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

// ------------------------------------------------------

export default function ValuerListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const [tab, setTab] = useState('debenture_trustee');
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState([]);

  const filteredData = VALUERS.filter((item) =>
    item.legalEntityName.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleSelectRow = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Select all
  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(filteredData.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleCompare = () => {
    router.push(`/dashboard/mybond/compare?type=valuer&ids=${selected.join(',')}`);
  };

  const isSendDisabled = selected.length === 0;

  const handleView = (id) => {
    console.log('View Valuer:', id);
  };

  const handleSendRequest = (id) => {
    console.log('Send Request to Valuer:', id);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }} justifyContent="flex-end">
        <Button
          variant="contained"
          disabled={selected.length < 2}
          sx={{ textTransform: 'none' }}
          onClick={handleCompare}
        >
          Compare
        </Button>

        <Button
          variant="contained"
          disabled={isSendDisabled}
          onClick={() => console.log('Send Request:', selected)}
        >
          Send Request
        </Button>
      </Stack>
      <Card>
        {/* Search */}
        <ValuerTableToolbar filterName={filterName} onFilterName={setFilterName} />

        {/* Table */}
        <TableContainer>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={filteredData.length}
                numSelected={selected.length}
                onSelectAllRows={(checked) => handleSelectAllRows(checked)}
                isCheckedBoxVisible
              />

              <TableBody>
                {filteredData.map((row) => (
                  <ValuerTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={handleSelectRow}
                    onView={() => handleView(row.id)}
                    onSendRequest={() => handleSendRequest(row.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}
