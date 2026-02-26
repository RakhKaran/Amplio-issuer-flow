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

const getFinancialYears = (baseDate) => {
  if (!baseDate) return [];
  const year = new Date(baseDate).getFullYear();
  return [
    { key: 'year1', startYear: year - 3, endYear: year - 2 },
    { key: 'year2', startYear: year - 2, endYear: year - 1 },
    { key: 'year3', startYear: year - 1, endYear: year },
  ];
};

export default function AuditedFinancial({
  currentAuditedFinancials,
  setPercent,
  setProgress,
  onSaved,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const schema = Yup.object().shape({
    baseDate: Yup.date().nullable().required('Base date is required'),
    amounts: Yup.object().shape({
      year1: Yup.string().required('Amount is required'),
      year2: Yup.string().required('Amount is required'),
      year3: Yup.string().required('Amount is required'),
    }),
  });

  const defaultValues = useMemo(() => {
    const statements = Array.isArray(currentAuditedFinancials?.financialStatements)
      ? currentAuditedFinancials.financialStatements
      : [];

    if (statements.length >= 3) {
      const sorted = [...statements]
        .sort((a, b) => (a.periodStartYear || 0) - (b.periodStartYear || 0))
        .slice(-3);

      const baseDate = currentAuditedFinancials?.baseDate
        ? new Date(currentAuditedFinancials.baseDate)
        : sorted[2]?.periodEndYear
          ? new Date(`${sorted[2].periodEndYear}-03-31`)
          : new Date();

      return {
        baseDate,
        amounts: {
          year1: sorted[0]?.amount ?? '',
          year2: sorted[1]?.amount ?? '',
          year3: sorted[2]?.amount ?? '',
        },
      };
    }

    return {
      baseDate: new Date(),
      amounts: {
        year1: '',
        year2: '',
        year3: '',
      },
    };
  }, [currentAuditedFinancials]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const financialYears = getFinancialYears(values.baseDate);

  useEffect(() => {
    let completed = 0;
    if (values.baseDate) completed += 1;
    if (values.amounts?.year1 !== '') completed += 1;
    if (values.amounts?.year2 !== '') completed += 1;
    if (values.amounts?.year3 !== '') completed += 1;

    const completion = Math.round((completed / 4) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const years = getFinancialYears(data.baseDate);
      const payload = {
        auditedFinancials: {
          baseDate: data.baseDate,
          financialStatements: years.map((year, idx) => ({
            periodStartYear: year.startYear,
            periodEndYear: year.endYear,
            amount: Number(data.amounts[`year${idx + 1}`] || 0),
          })),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.auditedFinancials);
      enqueueSnackbar('Audited financials saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to save audited financials', {
        variant: 'error',
      });
      console.error('Error saving audited financials:', error);
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
          3-Year Financial Statement
        </Typography>

        <Grid container spacing={2}>
          {financialYears.map((fy, index) => (
            <Grid item xs={12} md={4} key={fy.key}>
              <RHFPriceField
                name={`amounts.year${index + 1}`}
                label={`FY ${fy.startYear}-${String(fy.endYear).slice(-2)} Amount`}
                fullWidth
              />
            </Grid>
          ))}
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

AuditedFinancial.propTypes = {
  currentAuditedFinancials: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
