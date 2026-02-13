import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
import { useGetDpn } from 'src/api/dpn';
import ESignVerifyDpn from './e-sign/verify-e-sign';
import FormProvider from 'src/components/hook-form';
import Logo from 'src/components/logo';

export default function DPN() {
  const { dpn, dpnLoading } = useGetDpn();
  const [showEsignVerify, setShowEsignVerify] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  // const pdfUrl = '/assets/Demand_Promissory_Note.pdf';
  const AgreementSchema = Yup.object().shape({
    agreement: Yup.boolean().oneOf(
      [true],
      'You must agree to the Platform Agreement before continuing'
    ),
  });

  const defaultValues = {
    agreement: false,
  };

  const methods = useForm({
    resolver: yupResolver(AgreementSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  if (dpnLoading) return <>Loading...</>;

  if (!dpn) return <>DPN document not available</>;

  const onSubmit = async () => {
    try {
      setSendingOtp(true);

      await axiosInstance.patch('/business-kyc/dpn', {
        dpnId: dpn.id,
        isAccepted: true,
      });

      await axiosInstance.post('/auth/company-esign/send-otp');

      enqueueSnackbar('OTP sent successfully', {
        variant: 'success',
      });
      setShowEsignVerify(true);
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to send OTP1', { variant: 'error' });
    } finally {
      setSendingOtp(false);
    }
  };

  if (showEsignVerify) {
    return <ESignVerifyDpn />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
      <Container maxWidth="md">
        <Typography variant="h4" align="center" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
          {dpn?.businessKycDocumentType?.name || 'Demand Promissory Note'}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, fontWeight: 400 }}>
          {dpn?.businessKycDocumentType?.description}
        </Typography>
        <Card sx={{ height: '75vh', mb: 4 }}>
          <Box
            component="iframe"
            src={dpn?.media?.fileUrl}
            width="100%"
            height="100%"
            sx={{ border: 'none' }}
          />
        </Card>
        <Stack spacing={3} alignItems="center">
          {/* Checkbox Container */}
          <Controller
            name="agreement"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: 'primary.lighter',
                  borderRadius: 1.5,
                  border: errors.agreement ? '1px solid #d32f2f' : '1px solid #cfd8dc',
                  px: 2,
                  py: 1.2,
                }}
              >
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={
                    <Box>
                      <Typography fontWeight={600}>
                        I have read and agree to the Platform Agreement
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        I authorize escrow-based settlements and acknowledge the key terms above.
                      </Typography>
                    </Box>
                  }
                />

                {errors.agreement && (
                  <FormHelperText error>{errors.agreement.message}</FormHelperText>
                )}
              </Box>
            )}
          />
        </Stack>
        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color='primary' size="large" sx={{ px: 4, borderRadius: 2 }}>
            {sendingOtp ? 'Sending OTP...' : 'Continue to E-Sign'}
          </Button>
        </Stack>
      </Container>
    </FormProvider>
  );
}
