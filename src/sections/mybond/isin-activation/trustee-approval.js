import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function TrusteeProceedForApproval({
  currentTrusteeApproval,
  saveStepData,
  setPercent,
  setProgress,
}) {
  /* ---------------- YUP SCHEMA ---------------- */
  const TrusteeApprovalSchema = Yup.object().shape({
    acknowledementNumber: Yup.string().required('Acknowledgement Number is required'),

    trusteeApprovalDocument: Yup.mixed().required('Trustee approval document is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    acknowledementNumber: '',
    trusteeApprovalDocument: null,
  };
  const methods = useForm({
    resolver: yupResolver(TrusteeApprovalSchema),
    defaultValues,
  });

  const { handleSubmit, watch, reset } = methods;

  /* ---------------- PERCENT CALCULATION ---------------- */
  useEffect(() => {
    let completed = 0;

    if (methods.getValues('acknowledementNumber')) completed++;
    if (methods.getValues('trusteeApprovalDocument')) completed++;

    const pct = Math.round((completed / 2) * 100);

    setPercent?.(pct);
    setProgress?.(pct === 100);
  }, [watch()]);

  /* ---------------- PREFILL DATA ---------------- */
  useEffect(() => {
    if (currentTrusteeApproval) {
      reset({ ...defaultValues, ...currentTrusteeApproval });
    }
  }, [currentTrusteeApproval, reset]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.(data);
    setPercent?.(100);
    setProgress?.(true);
    enqueueSnackbar('Trustee approval details saved', { variant: 'success' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600}>
              Trustee Proceed for Approval to SEBI
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="acknowledementNumber"
              label="Acknowledgement Number*"
              placeholder="Enter acknowledgement number"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <RHFFileUploadBox
              name="trusteeApprovalDocument"
              label="Upload Trustee Approval Document*"
              icon="mdi:file-document-outline"
              maxSizeMB={5}
            />
            <YupErrorMessage name="trusteeApprovalDocument" />
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
