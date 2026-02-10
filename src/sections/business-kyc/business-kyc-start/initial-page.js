import { Card, Typography, Stack, Container, Button, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

export default function Initial() {
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/business-kyc');

      if (response.data.success) {
        enqueueSnackbar(response.data.message ?? 'Business KYC started successfully', {
          variant: 'success',
        });
        navigate(paths.kyc.invoiceFinancing.create);
      } else {
        enqueueSnackbar(response.data.message ?? 'Failed to start Business KYC', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error while starting business KYC:', error);
      const message =
        error?.error?.message ?? error?.message ?? 'Something went wrong. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
         <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>
      <Card
        sx={{
          mt: 10,
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: (theme) => theme.customShadows.z24,
        }}
      >
        {/* Brand */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Birbal<span style={{ color: '#000' }}>Plus</span>
        </Typography>

        {/* Title */}
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Smart Invoice <br />
          Financing, Simplified
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 520,
            mx: 'auto',
            mb: 2,
          }}
        >
          Upload document and clients and get financed faster and security
        </Typography>

        {/* Iconify Icons */}
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 2 }}>
          <Iconify icon="solar:users-group-rounded-outline" width={24} color="#1976d2" />
          <Iconify icon="solar:document-text-outline" width={24} color="#1976d2" />
          <Iconify icon="mdi:currency-inr" width={24} color="#1976d2" />
        </Stack>

        {/* Info text */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 3 }}>
          Preparing your financing workspace
        </Typography>

        {/* Start Button */}
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'primary.main',
              boxShadow: 'none',
            },
          }}
          onClick={handleStart}
        >
          {loading ? 'Starting…' : 'Start'}
        </Button>
      </Card>
    </Container>
  );
}
