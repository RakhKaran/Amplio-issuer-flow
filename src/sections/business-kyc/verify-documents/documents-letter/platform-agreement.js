import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import FormProvider from 'src/components/hook-form';

export default function PlatformAgreement({ document, onNext }) {
  const [loading, setLoading] = useState(false);

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
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = async () => {
    try {
      setLoading(true);

      await axiosInstance.patch('/business-kyc/agreements', {
        agreementId: document.id,
        isAccepted: true,
      });

      enqueueSnackbar('Agreement accepted successfully', {
        variant: 'success',
      });

      onNext?.();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to accept agreement', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
          {document?.title}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, fontWeight: 400 }}>
          {document?.subtitle}
        </Typography>

        <Card sx={{ height: '75vh', mb: 3 }}>
          <Box
            component="iframe"
            src={document?.pdfUrl}
            width="100%"
            height="100%"
            sx={{ border: 'none' }}
          />
        </Card>

        {/* FORM */}
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

          {/* Next Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValid}
             color='primary'
            sx={{ px: 4, width: '20%', borderRadius: 2}}
          >
            {loading ? 'Processing...' : 'Next'}
          </Button>
        </Stack>
      </Container>
    </FormProvider>
  );
}
