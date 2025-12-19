/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import PropTypes from 'prop-types';
import { useParams } from 'src/routes/hook';
import { useGetBondEstimation } from 'src/api/bondEstimations';

export default function FinancialDetails({ setActiveStepId, percent }) {
  const params = useParams();
  const { applicationId } = params;
  const { bondEstimation, bondEstimationLoading } = useGetBondEstimation(applicationId);

  const MainSchema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    returnOnAssets: Yup.string().required('Return on Assets (ROA) is required'),
    debtServiceCoverageRatio: Yup.string().required('DSCR is required'),
  });

  const defaultValues = useMemo(() => ({
    debtEquityRatio: bondEstimation?.financialRatios?.debtEquityRatio || '',
    currentRatio: bondEstimation?.financialRatios?.currentRatio || '',
    netWorth: bondEstimation?.financialRatios?.netWorth || '',
    quickRatio: bondEstimation?.financialRatios?.quickRatio || '',
    returnOnEquity: bondEstimation?.financialRatios?.returnOnEquity || '',
    returnOnAssets: bondEstimation?.financialRatios?.returnOnAsset || '',
    debtServiceCoverageRatio: bondEstimation?.financialRatios?.debtServiceCoverageRatio || '',
  }), [bondEstimation]);

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (bondEstimation && !bondEstimationLoading) {
      reset(defaultValues);
    }
  }, [bondEstimation, bondEstimationLoading, reset, defaultValues]);

  const handleNext = async () => {
    setActiveStepId();
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            sx={{
              border: '2px solid #1877F2',
              pl: 2,
              py: 2,
            }}
          >
            <Typography variant="h3" color="#1877F2" fontWeight={600}>
              Financial Ratios
            </Typography>
            <Typography variant="body1" color="#5E5E5E">
              Provide your company’s key financial ratios to assess financial health
            </Typography>
          </Box>

          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="currentRatio" label="Current Ratio" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="netWorth" label="Net Worth" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="quickRatio" label="Quick Ratio" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="returnOnEquity" label="Return on Equity (ROE)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="returnOnAssets" label="Return on Assets (ROA)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="debtServiceCoverageRatio"
                  label="Debt Service Coverage Ratio (DSCR)"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </FormProvider>

      {/* Footer Buttons Section */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <LoadingButton variant="contained" sx={{ color: '#fff' }} onClick={handleNext}>
          Next
        </LoadingButton>
      </Box>
    </>
  );
}

FinancialDetails.propTypes = {
  setActiveStepId: PropTypes.func,
  currentFinancialRatios: PropTypes.object,
  percent: PropTypes.func
};
