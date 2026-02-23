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

export default function FinancialRatios({ currentFinancialRatios, setPercent, setProgress }) {
  const { enqueueSnackbar } = useSnackbar();

  const financialRatiosSchema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Debt equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    debtServiceCoverageRatio: Yup.string().required('Debt service coverage ratio is required'),
    returnOnAsset: Yup.string().required('Return on asset is required'),
  });

  const defaultValues = useMemo(
    () => ({
      debtEquityRatio: currentFinancialRatios?.debtEquityRatio ?? '',
      currentRatio: currentFinancialRatios?.currentRatio ?? '',
      netWorth: currentFinancialRatios?.netWorth ?? '',
      quickRatio: currentFinancialRatios?.quickRatio ?? '',
      returnOnEquity: currentFinancialRatios?.returnOnEquity ?? '',
      debtServiceCoverageRatio: currentFinancialRatios?.debtServiceCoverageRatio ?? '',
      returnOnAsset: currentFinancialRatios?.returnOnAsset ?? '',
    }),
    [currentFinancialRatios]
  );

  const methods = useForm({
    resolver: yupResolver(financialRatiosSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentFinancialRatios) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentFinancialRatios, defaultValues, reset, setProgress]);

  useEffect(() => {
    let completed = 0;
    if (values?.debtEquityRatio) completed++;
    if (values?.currentRatio) completed++;
    if (values?.netWorth) completed++;
    if (values?.quickRatio) completed++;
    if (values?.returnOnEquity) completed++;
    if (values?.debtServiceCoverageRatio) completed++;
    if (values?.returnOnAsset) completed++;

    setPercent?.(Math.round((completed / 7) * 100));
  }, [values, setPercent]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        financialRatios: {
          debtEquityRatio: Number(data.debtEquityRatio || 0),
          currentRatio: Number(data.currentRatio || 0),
          netWorth: Number(data.netWorth || 0),
          quickRatio: Number(data.quickRatio || 0),
          returnOnEquity: Number(data.returnOnEquity || 0),
          debtServiceCoverageRatio: Number(data.debtServiceCoverageRatio || 0),
          returnOnAsset: Number(data.returnOnAsset || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      enqueueSnackbar('Financial ratios submitted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message || 'Error while submitting financial ratios.',
        { variant: 'error' }
      );
      console.error('Error while submitting financial ratios:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 0,
            mt: '0px',
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
            Financial Ratios
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="debtEquityRatio" label="Debt Equity Ratio" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="currentRatio" label="Current Ratio" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="netWorth" label="Net Worth" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="quickRatio" label="Quick Ratio" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="returnOnEquity" label="Return On Equity" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField
                name="debtServiceCoverageRatio"
                label="Debt Service Coverage Ratio"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFPriceField name="returnOnAsset" label="Return On Asset" fullWidth />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

FinancialRatios.propTypes = {
  currentFinancialRatios: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
