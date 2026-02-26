import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatRatio = (value) => {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(2);
};

export default function FinancialDetails({
  currentFinancialRatios,
  currentCapitalDetails,
  currentProfitabilityDetails,
  currentFundPosition,
  currentBorrowingDetails,
  setPercent,
  setProgress,
  onSaved,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const schema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Debt-equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    returnOnAssets: Yup.string().required('Return on assets is required'),
  });

  const calculatedRatios = useMemo(() => {
    const netWorth = toNumber(currentCapitalDetails?.netWorth);

    const totalDebt = Array.isArray(currentBorrowingDetails)
      ? currentBorrowingDetails.reduce((sum, item) => sum + toNumber(item?.lenderAmount), 0)
      : toNumber(currentBorrowingDetails?.totalBorrowings) ||
        toNumber(currentBorrowingDetails?.secured) +
          toNumber(currentBorrowingDetails?.unsecured?.fromPromoters) +
          toNumber(currentBorrowingDetails?.unsecured?.fromOthers);

    const currentAssets = toNumber(currentFundPosition?.currentAssets);
    const quickAssets =
      toNumber(currentFundPosition?.quickAssets) ||
      toNumber(currentFundPosition?.cashBalance) + toNumber(currentFundPosition?.bankBalance);
    const totalAssets =
      toNumber(currentFundPosition?.totalAssets) ||
      toNumber(currentFundPosition?.currentAssets) ||
      toNumber(currentFundPosition?.cashBalance) + toNumber(currentFundPosition?.bankBalance);
    const currentLiabilities = toNumber(currentFundPosition?.currentLiabilitiesAmount);

    const netProfit = toNumber(currentProfitabilityDetails?.netProfit);

    return {
      debtEquityRatio: netWorth > 0 && totalDebt > 0 ? formatRatio(totalDebt / netWorth) : '',
      currentRatio: currentLiabilities > 0 && currentAssets > 0 ? formatRatio(currentAssets / currentLiabilities) : '',
      netWorth: netWorth > 0 ? formatRatio(netWorth) : '',
      quickRatio: currentLiabilities > 0 && quickAssets > 0 ? formatRatio(quickAssets / currentLiabilities) : '',
      returnOnEquity: netWorth > 0 ? formatRatio((netProfit / netWorth) * 100) : '',
      returnOnAssets: totalAssets > 0 ? formatRatio((netProfit / totalAssets) * 100) : '',
    };
  }, [currentCapitalDetails, currentBorrowingDetails, currentFundPosition, currentProfitabilityDetails]);

  const defaultValues = useMemo(
    () => ({
      debtEquityRatio: calculatedRatios.debtEquityRatio || currentFinancialRatios?.debtEquityRatio || '',
      currentRatio: calculatedRatios.currentRatio || currentFinancialRatios?.currentRatio || '',
      netWorth: calculatedRatios.netWorth || currentFinancialRatios?.netWorth || '',
      quickRatio: calculatedRatios.quickRatio || currentFinancialRatios?.quickRatio || '',
      returnOnEquity: calculatedRatios.returnOnEquity || currentFinancialRatios?.returnOnEquity || '',
      returnOnAssets:
        calculatedRatios.returnOnAssets ||
        currentFinancialRatios?.returnOnAssets ||
        currentFinancialRatios?.returnOnAsset ||
        '',
    }),
    [calculatedRatios, currentFinancialRatios]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    let completed = 0;
    if (values.debtEquityRatio) completed += 1;
    if (values.currentRatio) completed += 1;
    if (values.netWorth) completed += 1;
    if (values.quickRatio) completed += 1;
    if (values.returnOnEquity) completed += 1;
    if (values.returnOnAssets) completed += 1;

    const completion = Math.round((completed / 6) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        financialRatios: {
          debtEquityRatio: Number(data.debtEquityRatio || 0),
          currentRatio: Number(data.currentRatio || 0),
          netWorth: Number(data.netWorth || 0),
          quickRatio: Number(data.quickRatio || 0),
          returnOnEquity: Number(data.returnOnEquity || 0),
          returnOnAssets: Number(data.returnOnAssets || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.financialRatios);
      enqueueSnackbar('Financial ratios saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Error while saving financial ratios.', {
        variant: 'error',
      });
      console.error('Error while saving financial ratios:', error);
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
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Financial Ratios
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="currentRatio" label="Current Ratio" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="netWorth" label="Net Worth" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="quickRatio" label="Quick Ratio" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnEquity" label="Return on Equity (ROE)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnAssets" label="Return on Assets (ROA)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
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
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

FinancialDetails.propTypes = {
  currentFinancialRatios: PropTypes.object,
  currentCapitalDetails: PropTypes.object,
  currentProfitabilityDetails: PropTypes.object,
  currentFundPosition: PropTypes.object,
  currentBorrowingDetails: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
