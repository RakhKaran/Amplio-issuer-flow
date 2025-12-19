import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { Box, Card, Grid, MenuItem, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import FormProvider, { RHFCustomFileUploadBox, RHFSelect } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

// ---------------- component ----------------

export default function IssueDocumentsCard({
  currentIssueDocument,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const DocumentSchema = Yup.object().shape({
    boardResolution: Yup.mixed().required('Board Resolution is required'),
    shareholderResolution: Yup.mixed().required('Shareholder Resolution is required'),
    moaAoaType: Yup.string().required('Select MoA or AoA'),
    moaAoa: Yup.mixed().required('MoA / AoA document is required'),
    certificateOfIncorporation: Yup.mixed().required('Certificate of Incorporation is required'),
    mgtFilling14: Yup.mixed().required('Management Filling 14 is required'),
  });

  const defaultValues = useMemo(
    () => ({
      boardResolution: currentIssueDocument?.boardResolution || null,
      shareholderResolution: currentIssueDocument?.shareholderResolution || null,
      moaAoaType: currentIssueDocument?.moaAoaType || 'moa',
      moaAoa: currentIssueDocument?.moaAoa || null,
      mgtFilling14: currentIssueDocument?.mgtFilling14 || null,
      certificateOfIncorporation: currentIssueDocument?.certificateOfIncorporation || null,
    }),
    [currentIssueDocument]
  );

  const methods = useForm({
    resolver: yupResolver(DocumentSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const moaAoaType = useWatch({ control, name: 'moaAoaType' });

  useEffect(() => {
    let completed = 0;

    if (values.boardResolution) completed++;
    if (values.shareholderResolution) completed++;
    if (values.moaAoa) completed++;
    if (values.certificateOfIncorporation) completed++;
    if (values.mgtFilling14) completed++;

    const percentValue = (completed / 5) * 50;
    setPercent?.(percentValue);
  }, [values, setPercent]);

  useEffect(() => {
    if (currentIssueDocument && Object.keys(currentIssueDocument).length > 0) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentIssueDocument, reset, defaultValues, setProgress]);

  // -------------------------------------------------------------
  const getMoaAoaLabel = () =>
    moaAoaType === 'moa' ? 'MoA - Memorandum of Association' : 'AoA - Articles of Association';

  const onSubmit = handleSubmit(async (data) => {
    try {
      saveStepData(data);
      setProgress(true);
      enqueueSnackbar('Documents saved', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to save documents', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Upload Documents
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="certificateOfIncorporation" />
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="boardResolution"
              label="Board Resolution"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="boardResolution" />
          </Grid>
          <Grid item xs={12}>
            <RHFSelect name="moaAoaType" label="Select Document Type">
              <MenuItem value="moa">MoA - Memorandum of Association</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association</MenuItem>
            </RHFSelect>
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="moaAoa"
              label={getMoaAoaLabel()}
              icon="mdi:file-document-edit-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="moaAoa" />
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="shareholderResolution"
              label="Shareholder Resolution"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="shareholderResolution" />
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="mgtFilling14"
              label="Management Filling 14"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="mgtFilling14" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" loading={isSubmitting} variant="contained">
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
