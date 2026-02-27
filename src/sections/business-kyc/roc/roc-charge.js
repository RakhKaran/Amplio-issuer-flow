import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Container,
} from '@mui/material';

import FormProvider, { RHFTextField, RHFCustomFileUploadBox } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useRouter } from 'src/routes/hook';
import { KYC_STAGE_ROUTE_MAP } from 'src/utils/kyc-stage-route-map';
import axiosInstance from 'src/utils/axios';
import Logo from 'src/components/logo';
import { LoadingButton } from '@mui/lab';
import { useGetRoc } from 'src/api/roc';

export default function RocChagre() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { roc, rocLoading } = useGetRoc();
  console.log('roc data', roc[0]?.chargeFiling?.fileUrl);
  const [nashLoading, setNashLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isNashActivated, setIsNashActivated] = useState(false);


  const RocChargeSchema = Yup.object().shape({
    srn: Yup.string(),
    // .required('Service Request Number is required')
    filingDate: Yup.date(),
    // .required('Filing date is required')
    // rocAcknowledgement: Yup.mixed().required('ROC filing acknowledgement is required'),

    // pdc: Yup.mixed().required('PDC document is required'),
    // chequeNo: Yup.string().required('Cheque number is required'),
    // bankName: Yup.string().required('Bank name is required'),
    // amount: Yup.number().required('Amount is required'),
    // chequeDate: Yup.date().required('Cheque date is required'),

    escrowConfirmed: Yup.boolean().oneOf([true], 'Confirmation is required'),
  });

  const defaultValues = {
    srn: `SRN-${Date.now()}`,
    filingDate: new Date(),
    rocAcknowledgement: null,

    pdc: null,
    chequeNo: '',
    bankName: '',
    amount: '',
    chequeDate: null,

    escrowConfirmed: false,
  };
  const methods = useForm({
    resolver: yupResolver(RocChargeSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const onSubmit = async () => {
    try {
      setSubmitLoading(true);

      await axiosInstance.patch('/business-kyc/roc/accept');

      enqueueSnackbar('ROC submitted successfully', {
        variant: 'success',
      });

      router.push(KYC_STAGE_ROUTE_MAP.DPN);
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Please activate Nash before continuing', {
        variant: 'error',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (rocLoading) return <>Loading...</>;

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
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
              {roc[0]?.businessKycDocumentType?.name || 'ROC Charge & Activation'}
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 3, fontWeight: 400 }}>
              {roc[0]?.businessKycDocumentType?.description}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="srn"
                  label="Service Request Number (SRN)"
                  placeholder="e.g. G123456"
                  helperText="Founding on your MCA payment receipt"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="filingDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      {...field}
                      label="Filling Date*"
                      value={field.value}
                      onChange={field.onChange}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* <Box mt={3}>
            <Typography variant="subtitle2" mb={1}>
              ROC Charge filing Acknowledgement
            </Typography>

            <RHFCustomFileUploadBox
              name="rocAcknowledgement"
              label="Upload ROC Charge filing Acknowledgement"
              helperText="Maximum allowed file size is 10MB | Supported file types: PDF, XLS, DOCX"
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                  '.docx',
                ],
              }}
            />
          </Box> */}
            <Card sx={{ height: '75vh', my: 4 }}>
              <Box
                component="iframe"
                src={roc[0]?.chargeFiling?.fileUrl}
                width="100%"
                height="100%"
                sx={{ border: 'none' }}
              />
            </Card>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="primary" mb={2}>
                Backup Security
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={nashLoading || isNashActivated}
                onClick={async () => {
                  try {
                    setNashLoading(true);

                    const res = await axiosInstance.patch('/business-kyc/roc/nash');

                    if (res?.data?.success) {
                      setIsNashActivated(true);
                    }

                    enqueueSnackbar('Nash activated successfully', {
                      variant: 'success',
                    });
                  } catch (error) {
                    enqueueSnackbar(
                      error?.response?.data?.error?.message || 'Failed to activate Nash',
                      { variant: 'error' }
                    );
                  } finally {
                    setNashLoading(false);
                  }
                }}
              >
                {isNashActivated ? 'Activated' : 'Activate your Nash'}
              </Button>

            </Stack>

            {/* <Stack spacing={2}>
            <Typography variant="subtitle2">Backup Security*</Typography>

            <RHFCustomFileUploadBox
              name="pdc"
              label="PDC*"
              helperText="Maximum allowed file size is 10MB | Supported file types: PDF, XLS, DOCX"
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                  '.docx',
                ],
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="chequeNo" label="Cheque No" placeholder="Enter Cheque No" />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="bankName" label="Bank Name" placeholder="abc bank" />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="amount" label="Amount" placeholder="50,00,00,000" />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="chequeDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      {...field}
                      label="Cheque Date*"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack> */}
          </Card>

          <Card sx={{ p: 3, backgroundColor: '#f6f9fc' }}>
            <Typography variant="h6" color="primary" mb={2}>
              Escrow Activation Confirmation
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              By continuing, you confirm that the Seller’s Escrow Account has been successfully
              linked to the NBFC nodal account for repayment routing.
            </Typography>

            <Controller
              name="escrowConfirmed"
              control={control}
              render={({ field, fieldState }) => (
                <Box>
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <Typography variant="body2">
                        I confirm that the Escrow Account is active
                      </Typography>
                    }
                  />

                  {fieldState.error && (
                    <FormHelperText error>{fieldState.error.message}</FormHelperText>
                  )}
                </Box>
              )}
            />
          </Card>

          {/* ================= Action ================= */}
          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton type="submit" color='primary' variant="contained" loading={submitLoading}>
              Save & Continue
            </LoadingButton>
          </Stack>
        </Stack>
      </Container>
    </FormProvider>
  );
}
