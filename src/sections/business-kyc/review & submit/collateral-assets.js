import { Card, Typography, Grid, Box, IconButton, Link, Chip, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useGetBusinessKycStepData } from 'src/api/businessKyc';
import Iconify from 'src/components/iconify';
import { formatNumberIN } from 'src/utils/change-case';

const STATUS_CONFIG = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
};


export default function CollateralAssetsPage({ onEdit }) {
  const { stepData, stepDataLoading } = useGetBusinessKycStepData('collateral_assets');

  const clients = stepData?.data || []
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
            <Card sx={{ p: 3, height: '100%' }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="text.secondary"
                >
                  #0{index + 1}
                </Typography>

                <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
                  <Chip
                    size="small"
                    label={STATUS_CONFIG[item?.status]?.label || 'Unknown'}
                    color={STATUS_CONFIG[item?.status]?.color || 'default'}
                    variant="soft"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                  <IconButton size="small" onClick={onEdit}>
                    <Iconify icon="solar:pen-bold" width={18} />
                  </IconButton>
                </Box>
              </Grid>

              {[
                ['Collateral Type', item.collateralTypes?.label || '—'],
                ['Asset Description', item.description || '—'],
                ['Estimated Value', `₹${formatNumberIN(item.estimatedValue || 0)}`],
                ['Ownership Type', item.ownershipTypes?.label || '—'],
                ['Trust Name', item.trustName || '—'],
                [
                  'Valuation Date',
                  item.valuationDate
                    ? new Date(item.valuationDate).toLocaleDateString('en-IN')
                    : '—',
                ],
              ].map(([label, value], idx) => (
                <Grid container key={idx} sx={{ mb: 1 }}>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight={600}>
                      {label} :
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
