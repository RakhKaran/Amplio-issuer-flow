import { useState } from 'react';
import { Button, Card, Container, Stack, Table, TableBody, TableContainer } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom } from 'src/components/table';

import { RTAS } from '../../intermediates-dummy-date';
import RtaTableToolbar from '../rta-table-toolbar';
import RtaTableRow from '../rta-table-row';
import { useRouter } from 'src/routes/hook';

// ------------------------------------------------------

const TABLE_HEAD = [
  { id: 'legalEntityName', label: 'Rta' },
  { id: 'experience', label: 'Experience' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'fees', label: 'Fees' },
  { id: 'responseTime', label: 'Response Time' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

// ------------------------------------------------------

export default function RtaListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState([]);

  const filteredData = RTAS.filter((item) =>
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
    router.push(`/dashboard/mybond/compare?type=rta&ids=${selected.join(',')}`);
  };

  const isSendDisabled = selected.length === 0;

  const handleView = (id) => {
    console.log('View Rta:', id);
  };

  const handleSendRequest = (id) => {
    console.log('Send Request to Rta:', id);
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
        <RtaTableToolbar filterName={filterName} onFilterName={setFilterName} />

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
                  <RtaTableRow
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
