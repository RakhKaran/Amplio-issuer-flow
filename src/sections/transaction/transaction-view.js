import {
  Card,
  Grid,
  Typography,
  Button,
  ButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { useState } from 'react';

const allData = [
  {
    id: 1,
    datetime: '2025-02-26 09:12:34',
    utr: 'UTR100234561',
    amount: 4500,
    status: 'Success',
    date: 'yesterday',
  },
  {
    id: 2,
    datetime: '2025-02-26 10:05:22',
    utr: 'UTR100234562',
    amount: 12000,
    status: 'Pending',
    date: 'yesterday',
  },
  {
    id: 3,
    datetime: '2025-02-26 11:30:00',
    utr: 'UTR100234563',
    amount: 8750,
    status: 'Success',
    date: 'yesterday',
  },
  {
    id: 4,
    datetime: '2025-02-26 13:45:10',
    utr: 'UTR100234564',
    amount: 3200,
    status: 'Failed',
    date: 'yesterday',
  },
  {
    id: 5,
    datetime: '2025-02-26 15:20:55',
    utr: 'UTR100234565',
    amount: 6700,
    status: 'Success',
    date: 'yesterday',
  },
  {
    id: 6,
    datetime: '2025-02-26 16:10:30',
    utr: 'UTR100234566',
    amount: 9100,
    status: 'Pending',
    date: 'yesterday',
  },
  {
    id: 7,
    datetime: '2025-02-26 17:00:00',
    utr: 'UTR100234567',
    amount: 15000,
    status: 'Success',
    date: 'yesterday',
  },
  {
    id: 8,
    datetime: '2025-02-26 18:45:12',
    utr: 'UTR100234568',
    amount: 2250,
    status: 'Failed',
    date: 'yesterday',
  },
  {
    id: 9,
    datetime: '2025-02-26 19:30:44',
    utr: 'UTR100234569',
    amount: 7800,
    status: 'Success',
    date: 'yesterday',
  },
  {
    id: 10,
    datetime: '2025-02-26 20:15:00',
    utr: 'UTR100234570',
    amount: 11500,
    status: 'Pending',
    date: 'yesterday',
  },
  {
    id: 11,
    datetime: '2025-02-27 08:05:10',
    utr: 'UTR100234571',
    amount: 5300,
    status: 'Success',
    date: 'today',
  },
  {
    id: 12,
    datetime: '2025-02-27 09:22:00',
    utr: 'UTR100234572',
    amount: 9900,
    status: 'Success',
    date: 'today',
  },
  {
    id: 13,
    datetime: '2025-02-27 10:40:33',
    utr: 'UTR100234573',
    amount: 4100,
    status: 'Failed',
    date: 'today',
  },
  {
    id: 14,
    datetime: '2025-02-27 11:55:20',
    utr: 'UTR100234574',
    amount: 13500,
    status: 'Success',
    date: 'today',
  },
  {
    id: 15,
    datetime: '2025-02-27 12:10:05',
    utr: 'UTR100234575',
    amount: 7200,
    status: 'Pending',
    date: 'today',
  },
  {
    id: 16,
    datetime: '2025-02-27 13:30:00',
    utr: 'UTR100234576',
    amount: 6400,
    status: 'Success',
    date: 'today',
  },
  {
    id: 17,
    datetime: '2025-02-27 14:05:44',
    utr: 'UTR100234577',
    amount: 2900,
    status: 'Failed',
    date: 'today',
  },
  {
    id: 18,
    datetime: '2025-02-27 15:20:15',
    utr: 'UTR100234578',
    amount: 10800,
    status: 'Success',
    date: 'today',
  },
  {
    id: 19,
    datetime: '2025-02-27 16:45:00',
    utr: 'UTR100234579',
    amount: 3700,
    status: 'Pending',
    date: 'today',
  },
  {
    id: 20,
    datetime: '2025-02-27 17:30:22',
    utr: 'UTR100234580',
    amount: 8600,
    status: 'Success',
    date: 'today',
  },
];

const statusColor = (status) => {
  if (status === 'Success') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Failed') return 'error';
  return 'default';
};

export default function TransactionView() {
  const [filter, setFilter] = useState('today');
  const [showDiscount, setShowDiscount] = useState(false);

  const filteredData = filter === 'from-to' ? allData : allData.filter((d) => d.date === filter);

  const total = filteredData.reduce((sum, d) => sum + d.amount, 0);
  const discount = total * 0.1;
  const totalReceivable = total - discount;

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary">
              Transactions
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={filter === 'yesterday' ? 'contained' : 'outlined'}
                onClick={() => setFilter('yesterday')}
              >
                Yesterday
              </Button>
              <Button
                variant={filter === 'today' ? 'contained' : 'outlined'}
                onClick={() => setFilter('today')}
              >
                Today
              </Button>
              <Button
                variant={filter === 'from-to' ? 'contained' : 'outlined'}
                onClick={() => setFilter('from-to')}
              >
                From - To
              </Button>
            </ButtonGroup>
          </Grid>

          {/* <Grid item xs={12} sx={{ mt: 2 }}>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                maxHeight: 480, // height for ~10 rows
                overflowY: 'auto',
              }}
            >
              {' '}
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date / Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>UTR</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Amount (₹)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.datetime}</TableCell>
                      <TableCell>{row.utr}</TableCell>
                      <TableCell align="right">{row.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="center">
                        <Chip label={row.status} color={statusColor(row.status)} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" fontWeight="bold">
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        ₹ {total.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid> */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Paper variant="outlined">
              {/* Scrollable Table */}
              <TableContainer
                sx={{
                  maxHeight: 450, // approx 10 rows
                  overflowY: 'auto',
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Date / Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>UTR</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'black' }} align="center">
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'black' }} align="right">
                        Amount (₹)
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.datetime}</TableCell>
                        <TableCell>{row.utr}</TableCell>
                        <TableCell align="center">
                          <Chip label={row.status} color={statusColor(row.status)} size="small" />
                        </TableCell>
                        <TableCell align="right">{row.amount.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fixed Total Row */}
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'grey.100',
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  Total: ₹ {total.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Card>
      {showDiscount && (
        <Card sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                borderColor: 'divider',
                p: 2,
                ml: 'auto',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Discounting
              </Typography>
            </Box>

            <Box
              sx={{
                borderColor: 'divider',
                p: 2,
                ml: 'auto',
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  ₹ {total.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="error.main">
                  Discount (10%)
                </Typography>
                <Typography variant="body2" color="error.main">
                  – ₹ {discount.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold">
                  Total Receivable
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  ₹ {totalReceivable.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Card>
      )}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setShowDiscount(true)}
        >
          {showDiscount ? 'Continue' : 'Discounting'}
        </Button>
      </Box>

      {/* Confirm Button — outside card, aligned right, below card */}
      {/* <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="primary" size="large">
          Confirm
        </Button>
      </Box> */}
    </>
  );
}
