import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFPriceField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function ProfitabilityDetails({
  currentProfitabilityDetails,
  setPercent,
  setProgress,
  onSaved,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const profitabilitySchema = Yup.object().shape({
    netProfit: Yup.string().required('Net Profit is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: currentProfitabilityDetails?.netProfit ?? '',
    }),
    [currentProfitabilityDetails]
  );

  const methods = useForm({
    resolver: yupResolver(profitabilitySchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const netProfit = watch('netProfit');

  useEffect(() => {
    const completion = netProfit ? 100 : 0;
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [netProfit, setPercent, setProgress]);

  useEffect(() => {
    if (currentProfitabilityDetails) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentProfitabilityDetails, reset, defaultValues, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        profitabilityDetails: {
          netProfit: Number(data.netProfit || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.profitabilityDetails);
      enqueueSnackbar('Profitability details submitted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Error while submitting profitability details.', {
        variant: 'error',
      });
      console.error('Error while submitting profitability details:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
            Profitability Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFPriceField name="netProfit" label="Net Profit" fullWidth />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained" color="primary">
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

ProfitabilityDetails.propTypes = {
  currentProfitabilityDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
