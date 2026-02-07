import { Dialog, DialogContent, Typography, Box, Stack, Button, Divider } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import { KYC_STAGE_ROUTE_MAP } from 'src/utils/kyc-stage-route-map';

export default function AgreementSuccessDialog({ open, onClose }) {
  const router = useRouter();
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose?.();
      }}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
        },
      }}
    >
      <DialogContent>
        <Stack alignItems="center" spacing={2}>
          <Iconify icon="mdi:check-circle" width={56} sx={{ color: 'success.main' }} />

          <Typography variant="h5" fontWeight={700}>
            Agreement Signed Successfully
          </Typography>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                Signed on
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                Aadhaar OTP & Email OTP
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                Agreement Reference ID
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                INV-AG2025-00421
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                Status
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Submitted for approval
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mdi:eye-outline" />}
              sx={{ borderRadius: 20, px: 3 }}
            >
              View Signed Agreement
            </Button>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:download-outline" />}
              sx={{ borderRadius: 20, px: 3 }}
            >
              Download PDF
            </Button>
          </Stack>

          <Button
            variant="text"
            endIcon={<Iconify icon="mdi:arrow-right" />}
            sx={{ fontWeight: 600 }}
            onClick={() => {
              onClose?.();
              router.push(KYC_STAGE_ROUTE_MAP.ROC);
            }}
          >
            Next
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
