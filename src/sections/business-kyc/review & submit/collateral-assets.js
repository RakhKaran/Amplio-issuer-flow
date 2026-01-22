import { Card, Typography, Grid, Box, IconButton, Link, Chip, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { formatNumberIN } from 'src/utils/change-case';

const collateralAssets = [
  {
    collateralType: 'Real Estate',
    assetDescription: 'Commercial Property at BKC Mumbai',
    estimatedValue: '₹18 Cr',
    ownershipType: 'Corporate',
    trustName: 'Birbal Asset Trust',
    valuationDate: '01-Oct-2025',
    status: 'Under Review',
    color: '#FFAB00',
  },
  {
    collateralType: 'Land',
    assetDescription: 'Industrial Plot at Pune',
    estimatedValue: '₹12 Cr',
    ownershipType: 'Corporate',
    trustName: 'Birbal Asset Trust',
    valuationDate: '15-Sep-2025',
    status: 'Approved',
    color: '#00AB59',
  },
  {
    collateralType: 'Machinery',
    assetDescription: 'Heavy Manufacturing Equipment',
    estimatedValue: '₹6 Cr',
    ownershipType: 'Owned',
    trustName: '—',
    valuationDate: '20-Aug-2025',
    status: 'Under Review',
    color: '#FFAB00',
  },
  {
    collateralType: 'Warehouse',
    assetDescription: 'Logistics Warehouse – NCR',
    estimatedValue: '₹9 Cr',
    ownershipType: 'Leased',
    trustName: 'LogiTrust Pvt Ltd',
    valuationDate: '05-Jul-2025',
    status: 'Approved',
    color: '#00AB59',
  },
  {
    collateralType: 'Office Space',
    assetDescription: 'IT Park Office – Bengaluru',
    estimatedValue: '₹14 Cr',
    ownershipType: 'Corporate',
    trustName: 'Tech Asset Trust',
    valuationDate: '22-Jun-2025',
    status: 'Under Review',
    color: '#FFAB00',
  },
  {
    collateralType: 'Plant',
    assetDescription: 'Power Generation Plant',
    estimatedValue: '₹25 Cr',
    ownershipType: 'Corporate',
    trustName: 'Energy Holdings',
    valuationDate: '10-May-2025',
    status: 'Approved',
    color: '#00AB59',
  },
  {
    collateralType: 'Retail Space',
    assetDescription: 'Mall Unit – Hyderabad',
    estimatedValue: '₹7 Cr',
    ownershipType: 'Owned',
    trustName: '—',
    valuationDate: '18-Apr-2025',
    status: 'Under Review',
    color: '#FFAB00',
  },
  {
    collateralType: 'Land',
    assetDescription: 'Agricultural Land – Nashik',
    estimatedValue: '₹4 Cr',
    ownershipType: 'Individual',
    trustName: '—',
    valuationDate: '30-Mar-2025',
    status: 'Approved',
    color: '#00AB59',
  },
  {
    collateralType: 'Cold Storage',
    assetDescription: 'Cold Storage Facility – Indore',
    estimatedValue: '₹11 Cr',
    ownershipType: 'Corporate',
    trustName: 'Agro Infra Trust',
    valuationDate: '12-Feb-2025',
    status: 'Under Review',
    color: '#FFAB00',
  },
  {
    collateralType: 'Factory',
    assetDescription: 'Textile Manufacturing Unit',
    estimatedValue: '₹20 Cr',
    ownershipType: 'Corporate',
    trustName: 'Textile Asset Trust',
    valuationDate: '08-Jan-2025',
    status: 'Approved',
    color: '#00AB59',
  },
];

export default function CollateralAssetsPage({ data }) {
  const clients = data?.collateralAssets || data?.data?.collateralAssets || [];
  const [visibleCount, setVisibleCount] = useState(4);

  const handleViewMore = () => {
    setVisibleCount((prev) => {
      if (prev >= clients.length) {
        enqueueSnackbar('There are no remaining cards', { variant: 'warning' });
        return prev;
      }

      return Math.min(prev + 2, clients.length);
    });
  };

  return (
    <>
      <Box mb={3} display="flex" justifyContent="center">
        <Typography variant="h5" color="primary">
          Collateral & Asset Details
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ maxWidth: 900, mx: 'auto' }}>
        {clients.slice(0, visibleCount).map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 3 }}>
              <Grid container justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography fontWeight={600}>Collateral & Asset Details</Typography>

                <Box display="flex" flexDirection="row" alignItems="flex-end" gap={0.5}>
                  <Chip
                    size="small"
                    label="Approved"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#00AB59',
                      borderColor: '#00AB59',
                    }}
                  />

                  <IconButton size="small">
                    <Iconify icon="solar:pen-bold" width={18} />
                  </IconButton>
                </Box>
              </Grid>

              {[
                ['Collateral Type', item.collateralType],
                ['Asset Description', item.description],
                ['Estimated Value', `₹${formatNumberIN(item.estimatedValue)}`],
                ['Ownership Type', item.ownershipType],
                ['Trust Name', item.trustName],
                ['Valuation Date', item.valuationDate],
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

      {visibleCount < clients.length && (
        <Box mt={3} display="flex" justifyContent="flex-end" maxWidth={900} mx="auto">
          <Button variant="outlined" onClick={handleViewMore}>
            View More
          </Button>
        </Box>
      )}
    </>
  );
}
