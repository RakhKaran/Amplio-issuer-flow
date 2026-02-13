import { Card, Typography, Grid, Box, IconButton, Link, Chip, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useGetGuarantors } from 'src/api/businessKyc';
import Iconify from 'src/components/iconify';
import { formatNumberIN } from 'src/utils/change-case';


const STATUS_CONFIG = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
};

export default function GuarantorDetailsPage({ onEdit }) {
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
            <Card sx={{ p: 3, height: '100%' }}>
              <Grid container justifyContent="flex-end" alignItems="flex-end" mb={2}>
                <Box display="flex" flexDirection="row" alignItems="flex-end" gap={0.5}>
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
