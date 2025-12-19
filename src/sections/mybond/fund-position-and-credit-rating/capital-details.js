import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

export default function CapitalDetails({
  currentCapitalDetails,
  setPercent,
  setProgress,
  saveStepData,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const capitalSchema = Yup.object().shape({
    shareCapital: Yup.number()
      .typeError('Share Capital must be a number')
      .min(0, 'Cannot be negative')
      .required('Share Capital is required'),

    reserveSurplus: Yup.number()
      .typeError('Reserve Surplus must be a number')
      .min(0, 'Cannot be negative')
      .required('Reserve Surplus is required'),

    netWorth: Yup.number()
      .typeError('Net Worth must be a number')
      .required('Net Worth is required'),
  });

  const defaultValues = useMemo(
    () => ({
      shareCapital: currentCapitalDetails?.shareCapital || null,
      reserveSurplus: currentCapitalDetails?.reserveSurplus || null,
      netWorth: currentCapitalDetails?.netWorth || null,
    }),
    [currentCapitalDetails]
  );

  const methods = useForm({
    resolver: yupResolver(capitalSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, setValue, watch, handleSubmit, reset } = methods;

  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');
  const netWorth = watch('netWorth');

  useEffect(() => {
    const total = (parseFloat(shareCapital) || 0) + (parseFloat(reserveSurplus) || 0);
    setValue('netWorth', total.toFixed(2)); // keep 2 decimals
  }, [shareCapital, reserveSurplus, setValue]);

  useEffect(() => {
    let completed = 0;

    const isShareValid = shareCapital !== null && shareCapital !== '' && !isNaN(shareCapital);

    const isReserveValid =
      reserveSurplus !== null && reserveSurplus !== '' && !isNaN(reserveSurplus);

    if (isShareValid) completed++;
    if (isReserveValid) completed++;

    const percentVal = (completed / 2) * 50;

    setPercent?.(percentVal);
  }, [shareCapital, reserveSurplus, setPercent]);

  // ✅ Restore saved data + mark completed
  useEffect(() => {
    if (currentCapitalDetails && Object.keys(currentCapitalDetails).length > 0) {
      reset(defaultValues);
      setProgress?.(true);
      setPercent?.(50);
    }
  }, [currentCapitalDetails, reset, defaultValues, setProgress, setPercent]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form Submitted Data:', data);
      saveStepData(data);
      setProgress(true);
      enqueueSnackbar('Fund position saved (Mocked)', { variant: 'success' });
    } catch (error) {
      console.error('Mocked submit error:', error);
    }
  });
  useEffect(() => {
    if (currentCapitalDetails && Object.keys(currentCapitalDetails).length > 0) {
      reset(defaultValues);
      setProgress?.(true);
      setPercent?.(50);
    }
  }, [currentCapitalDetails, reset, defaultValues, setProgress, setPercent]);

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
            Capital Details
          </Typography>

          <Grid container spacing={1} alignItems="center">
            {/* Share Capital */}
            <Grid item xs={12} md={3}>
              <RHFTextField name="shareCapital" label="Share Capital" fullWidth type="number" />
            </Grid>

            {/* + symbol */}
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                +
              </Typography>
            </Grid>

            {/* Reserve Surplus */}
            <Grid item xs={12} md={3}>
              <RHFTextField name="reserveSurplus" label="Reserve Surplus" fullWidth type="number" />
            </Grid>

            {/* = symbol */}
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                =
              </Typography>
            </Grid>

            {/* Net Worth (auto-calculated) */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="netWorth"
                label="Net Worth"
                fullWidth
                type="number"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}

CapitalDetails.propTypes = {
  setActiveStep: PropTypes.func,
  saveStepData: PropTypes.func,
  setCurrentFormCount: PropTypes.func,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
