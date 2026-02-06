import { Card, Typography, Grid, Box, IconButton, Link, Chip, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useGetGuarantors } from 'src/api/businessKyc';
import Iconify from 'src/components/iconify';
import { formatNumberIN } from 'src/utils/change-case';

const guarantorDetails = [
  {
    guarantorType: 'Individual',
    fullName: 'Rajesh Kumar Sharma',
    pan: 'XXXXA45XX',
    aadhaar: 'XXXX XXXX 1234',
    netWorth: '₹12 Cr',
    guaranteedAmount: '₹10 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Suresh Kumar Sharma',
    pan: 'XXXXA45XX',
    aadhaar: 'XXXX XXXX 1234',
    netWorth: '₹12 Cr',
    guaranteedAmount: '₹10 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Mahesh Kumar Sharma',
    pan: 'XXXXA45XX',
    aadhaar: 'XXXX XXXX 1234',
    netWorth: '₹12 Cr',
    guaranteedAmount: '₹10 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Naresh Kumar Sharma',
    pan: 'XXXXA45XX',
    aadhaar: 'XXXX XXXX 1234',
    netWorth: '₹12 Cr',
    guaranteedAmount: '₹10 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Ramesh Patel',
    pan: 'XXXXB67XX',
    aadhaar: 'XXXX XXXX 5678',
    netWorth: '₹9 Cr',
    guaranteedAmount: '₹7 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Amit Verma',
    pan: 'XXXXC89XX',
    aadhaar: 'XXXX XXXX 8899',
    netWorth: '₹15 Cr',
    guaranteedAmount: '₹12 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Sunil Mehta',
    pan: 'XXXXD12XX',
    aadhaar: 'XXXX XXXX 4455',
    netWorth: '₹8 Cr',
    guaranteedAmount: '₹6 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Vikas Jain',
    pan: 'XXXXE34XX',
    aadhaar: 'XXXX XXXX 7788',
    netWorth: '₹11 Cr',
    guaranteedAmount: '₹9 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Anil Gupta',
    pan: 'XXXXF56XX',
    aadhaar: 'XXXX XXXX 3322',
    netWorth: '₹10 Cr',
    guaranteedAmount: '₹8 Cr',
    eSignStatus: 'Approved',
  },
  {
    guarantorType: 'Individual',
    fullName: 'Deepak Malhotra',
    pan: 'XXXXG78XX',
    aadhaar: 'XXXX XXXX 9911',
    netWorth: '₹14 Cr',
    guaranteedAmount: '₹11 Cr',
    eSignStatus: 'Approved',
  },
];

export default function GuarantorDetailsPage({ data }) {
  // const guarantorsDetails = data?.guarantors || data?.data?.guarantors || [];
  const { guarantors, refreshGuarantors } = useGetGuarantors();

  const guarantorsDetails = Array.isArray(guarantors)
    ? guarantors
    : guarantors?.data ?? [];

  const [visibleCount, setVisibleCount] = useState(4);

  const handleViewMore = () => {
    setVisibleCount((prev) => {
      if (prev >= guarantorsDetails.length) {
        enqueueSnackbar('There are no remaining cards', { variant: 'warning' });
        return prev;
      }
      return Math.min(prev + 2, guarantorsDetails.length);
    });
  };

  return (
    <>
      <Box mb={2} mt={2} display="flex" justifyContent="center">
        <Typography variant="h5" color="primary">
          Guarantor Details
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ maxWidth: 900, mx: 'auto' }}>
        {guarantorsDetails.slice(0, visibleCount).map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 3 }}>
              <Grid container justifyContent="flex-end" alignItems="flex-end" mb={2}>
                <Box display="flex" flexDirection="row" alignItems="flex-end" gap={0.5}>
                  <Chip
                    size="small"
                    label="Approved"
                    sx={{
                      backgroundColor: '#fff',
                      color: 'success.main',
                      border: '1px solid',
                      borderColor: 'success.main',
                      fontWeight: 600,
                      height: 22,
                      fontSize: 11,
                    }}
                  />

                  <IconButton size="small">
                    <Iconify icon="solar:pen-bold" width={18} />
                  </IconButton>
                </Box>
              </Grid>


              {[
                ['Guarantor Type', item.guarantorType],
                ['Full Name', item.fullName],
                ['PAN', item.panNumber],
                ['Aadhaar', item.adharNumber],
                ['Net Worth', `₹${formatNumberIN(item.estimatedNetWorth)}`],
                ['Guaranteed Amount Limit', `₹${formatNumberIN(item.guaranteedAmountLimit)}`],
              ].map(([label, value], idx) => (
                <Grid container key={idx} sx={{ mb: 1 }}>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight={600}>
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} textAlign="right">
                    <Typography variant="body2" fontWeight={500}>
                      {value}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Card>
          </Grid>
        ))}
      </Grid>

      {visibleCount < guarantorsDetails.length && (
        <Box mt={3} display="flex" justifyContent="flex-end" maxWidth={900} mx="auto">
          <Button variant="outlined" onClick={handleViewMore}>
            View More
          </Button>
        </Box>
      )}
    </>
  );
}
