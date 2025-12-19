import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { enqueueSnackbar } from 'notistack';

/* ---------------- YUP SCHEMA ---------------- */

export default function DematCreditDetails({
  currentDemat,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const DematSchema = Yup.object().shape({
    creditConfirmationDate: Yup.date().required('Credit date is required'),
    creditProof: Yup.mixed().required('Credit proof is required'),
    remark: Yup.string().nullable(),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    creditConfirmationDate: null,
    creditProof: null,
    remark: '',
  };
  const methods = useForm({
    resolver: yupResolver(DematSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  /* ---------------- PERCENT ---------------- */
  useEffect(() => {
    let completed = 0;

    if (methods.getValues('creditConfirmationDate')) completed++;
    if (methods.getValues('creditProof')) completed++;

    const pct = Math.round((completed / 2) * 100);

    setPercent?.(pct);
    setProgress?.(pct === 100);
  }, [watch()]);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (currentDemat) reset({ ...defaultValues, ...currentDemat });
  }, [currentDemat]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.(data);
    setPercent?.(100);
    setProgress?.(true);
    enqueueSnackbar('Demat credit details saved', { variant: 'success' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600}>
              Demat Credit Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="creditConfirmationDate"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Credit Confirmation Date*"
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

          <Grid item xs={12} md={6}>
            <RHFTextField name="remark" label="Remark" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <RHFFileUploadBox
              name="creditProof"
              label="Upload Credit Confirmation Proof*"
              icon="mdi:file-document-outline"
              maxSizeMB={5}
            />
            <YupErrorMessage name="creditProof" />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained">
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
