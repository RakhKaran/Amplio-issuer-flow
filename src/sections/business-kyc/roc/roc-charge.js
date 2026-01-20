import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { Box, Card, Grid, Stack, Typography, Button, Divider, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';

import FormProvider, { RHFTextField, RHFCustomFileUploadBox } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';

export default function RocChagre() {
  const RocChargeSchema = Yup.object().shape({
    srn: Yup.string().required('Service Request Number is required'),
    filingDate: Yup.date().required('Filing date is required'),

    rocAcknowledgement: Yup.mixed().required('ROC filing acknowledgement is required'),

    pdc: Yup.mixed().required('PDC document is required'),
    chequeNo: Yup.string().required('Cheque number is required'),
    bankName: Yup.string().required('Bank name is required'),
    amount: Yup.number().required('Amount is required'),
    chequeDate: Yup.date().required('Cheque date is required'),

    escrowConfirmed: Yup.boolean().oneOf([true], 'Confirmation is required'),
  });

  const defaultValues = {
    srn: '',
    filingDate: null,
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

  const onSubmit = (data) => {
    console.log('ROC Charge Data:', data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" mb={2}>
            ROC Charge & Activation
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

          <Box mt={3}>
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
          </Box>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" mb={2}>
            Backup Security
          </Typography>

          <Stack spacing={2}>
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
          </Stack>
        </Card>

        <Card sx={{ p: 3, backgroundColor: '#f6f9fc' }}>
          <Typography variant="h6" color="primary" mb={2}>
            Escrow Activation Confirmation
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            By continuing, you confirm that the Seller’s Escrow Account has been successfully linked
            to the NBFC nodal account for repayment routing.
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
          <Button type="submit" variant="contained">
            Save & Continue
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
