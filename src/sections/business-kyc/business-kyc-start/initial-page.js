import { Card, Box, Typography, Stack, Container, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook/use-router';
import { paths } from 'src/routes/paths';

export default function Initial() {
  const router = useRouter();

  const handleStart = () => {
    router.push(paths.kyc.invoiceFinancing.create);
  };

  return (
    <Container maxWidth="md">
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
          upload document and clients and get financed faster and security
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
          Start
        </Button>
      </Card>
    </Container>
  );
}
