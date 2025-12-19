

import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

export default function ProfitabilityDetails({ currentProfitabilityDetails, setPercent, setProgress }) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();

  const profitableSchema = Yup.object().shape({
    netProfit: Yup.number()
      .typeError('Net Profit must be a number')
      .required('Net Profit is required'),
    EBIDTA: Yup.number()
      .typeError('EBIDTA must be a number')
      .required('EBIDTA amount is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: currentProfitabilityDetails?.netProfit || '',
      EBIDTA: currentProfitabilityDetails?.EBIDTA || '',

    }),
    [currentProfitabilityDetails]
  );

  const methods = useForm({
    resolver: yupResolver(profitableSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = data;

      const response = await axiosInstance.patch(`/bond-estimations/profitability-details/${applicationId}`, payload);

      if (response?.data?.success) {
        enqueueSnackbar('Profitability details submitted', { variant: 'success' });
        setProgress(true);
      }
    } catch (error) {
      console.error('Error while submitting profitability details form :', error);
    }
  });

  const calculateCompletion = () => {
    const np = methods.watch('netProfit');
    const eb = methods.watch('EBIDTA');

    let score = 0;

    if (np || np === 0) score += 15;
    if (eb || eb === 0) score += 15;

    const percentValue = Math.min(30, score);
    setPercent(percentValue);
  };

  useEffect(() => {
    const subscription = methods.watch(() => {
      calculateCompletion();
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  useEffect(() => {
    if (currentProfitabilityDetails) {
      reset(defaultValues);
      setProgress(true);
    }
  }, [currentProfitabilityDetails, reset, defaultValues, setProgress]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h3" fontWeight={600} color="#1874ED" mb={2}>
            Profitability Details
          </Typography>

          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="netProfit"
                label="Net Profit"
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="EBIDTA"
                label="Enter EBIDTA Amount"
                fullWidth
                type="number"
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                sx={{ color: '#fff' }}
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}

ProfitabilityDetails.propTypes = {
  currentProfitabilityDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func
};