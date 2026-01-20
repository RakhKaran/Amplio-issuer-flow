/* eslint-disable no-useless-escape */
import { useMemo, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { Card, Typography, Container, Grid } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function BusinessProfile({ onSave, onProgressChange, savedData }) {
  const { enqueueSnackbar } = useSnackbar();

  // ✅ Yup Schema
  const BusinessProfileSchema = Yup.object().shape({
    yearsInBusiness: Yup.number()
      .typeError('Years must be a number')
      .required('Years in business is required')
      .min(0, 'Invalid years'),

    lastYearTurnover: Yup.number()
      .typeError('Turnover must be a number')
      .required('Last year turnover is required')
      .min(0, 'Invalid amount'),

    projectedTurnover: Yup.number()
      .typeError('Projected turnover must be a number')
      .required('Projected turnover is required')
      .min(0, 'Invalid amount'),

    ebitdaMargin: Yup.number()
      .typeError('EBITDA margin must be a number')
      .required('EBITDA margin is required')
      .min(0, 'Invalid value')
      .max(100, 'EBITDA margin cannot exceed 100%'),
  });

  // ✅ Default Values with saved data
  // const defaultValues = useMemo(
  //   () => ({
  //     yearsInBusiness: savedData?.yearsInBusiness || '',
  //     lastYearTurnover: savedData?.lastYearTurnover || '',
  //     projectedTurnover: savedData?.projectedTurnover || '',
  //     ebitdaMargin: savedData?.ebitdaMargin || '',
  //   }),
  //   [savedData]
  // );

  // console.log('Business Profile - Saved Data:', savedData);
  // ✅ React Hook Form Methods
  const methods = useForm({
    resolver: yupResolver(BusinessProfileSchema),
  });

  const { handleSubmit, watch, reset } = methods;
  const values = watch();

  useEffect(() => {
    if (!savedData?.data) return;

    reset({
      yearsInBusiness: savedData.data.yearsInBusiness ?? '',
      lastYearTurnover: savedData.data.lastYearTurnover ?? '',
      projectedTurnover: savedData.data.projectedTurnover ?? '',
      ebitdaMargin: savedData.data.ebitdaMargin ?? '',
    });

    onProgressChange?.(savedData.percent ?? 0);
  }, [savedData, reset]);

  useEffect(() => {
    onProgressChange?.(calculateProgress(values));
  }, [values]);

  const calculateProgress = (vals) => {
    let completed = 0;
    const totalFields = 4;

    if (vals.yearsInBusiness) completed++;
    if (vals.lastYearTurnover) completed++;
    if (vals.projectedTurnover) completed++;
    if (vals.ebitdaMargin) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    try {
      const percent = calculateProgress(data);

      onSave?.({
        data,
        percent,
      });

      onProgressChange?.(percent);
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          Business Profile
        </Typography>

        <Card
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="yearsInBusiness" label="Years in Business*" placeholder="e.g. 5" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="lastYearTurnover"
                label="Last Year Turnover*"
                placeholder="₹ Amount in Lakhs"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="projectedTurnover"
                label="Projected Turnover*"
                placeholder="₹ Amount in Lakhs"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="ebitdaMargin" label="EBITDA Margin (%)*" placeholder="e.g. 15%" />
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main',
                  boxShadow: 'none',
                },
              }}
              color="primary"
            >
              Save
            </LoadingButton>
          </Grid>
        </Card>
      </Container>
    </FormProvider>
  );
}

BusinessProfile.propTypes = {
  onSave: PropTypes.func,
  onProgressChange: PropTypes.func,
  savedData: PropTypes.object,
};
