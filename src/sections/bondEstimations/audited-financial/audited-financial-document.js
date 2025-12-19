import { useForm, Controller } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import AuditedFinancialStatement from './audited-fnancial-statement';
import AuditedIncomeTaxReturn from './audited-income-tax-return';
import AuditedGSTR9 from './audited-gstr9';
import AuditedGST3B from './audited-gstr3b';
import { Box, Button, Container } from '@mui/material';
import KYCTitle from 'src/sections/kyc/kyc-title';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

export default function AuditedFinancialDocument({ setActiveStepId, percent }) {
  const { enqueueSnackbar } = useSnackbar();

  const [isBaseYearDone, setBaseYearDone] = useState(false);
  const [baseYearPercent, setBaseYearPercent] = useState(20);

  const [financialPercent, setFinancialPercent] = useState(0);
  const [itrPercent, setItrPercent] = useState(0);
  const [gstr9Percent, setGstr9Percent] = useState(0);
  const [gstr3bPercent, setGstr3bPercent] = useState(0);

  const [financialDone, setFinancialDone] = useState(false);
  const [itrDone, setItrDone] = useState(false);
  const [gstr9Done, setGstr9Done] = useState(false);
  const [gstr3bDone, setGstr3bDone] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: `${year - 1} - ${year}` };
  });

  const methods = useForm({
    defaultValues: {
      baseYear: '2025',
    },
  });

  const { watch, control } = methods;
  const selectedYear = watch("baseYear");

  useEffect(() => {
    setBaseYearDone(!!selectedYear); // TRUE when year is selected
  }, [selectedYear]);

  const handleNextClick = () => {
    if (!isBaseYearDone) return enqueueSnackbar("Please select base year");
    if (!financialDone) return enqueueSnackbar("Complete audited financial statement");
    if (!itrDone) return enqueueSnackbar("Complete ITR section");
    if (!gstr9Done) return enqueueSnackbar("Complete GSTR-9 section");
    if (!gstr3bDone) return enqueueSnackbar("Complete GSTR-3B section");

    setActiveStepId();
  };

  useEffect(() => {
    const total =
      (isBaseYearDone ? baseYearPercent : 0) +
      financialPercent +
      itrPercent +
      gstr9Percent +
      gstr3bPercent;

    percent?.(total);
  }, [
    baseYearPercent,
    financialPercent,
    itrPercent,
    gstr9Percent,
    gstr3bPercent,
    isBaseYearDone,
    percent
  ]);

  return (
    <Container>
      <KYCTitle
        title="Audited Financial"
        subtitle="Upload audited financial documents for assessment"
      />

      <FormProvider methods={methods}>
        <Grid container sx={{ p: 4, borderRadius: 2, border: '1px solid #ddd', boxShadow: 2 }}>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Base Year (Latest Financial Year)
            </Typography>

            <RHFSelect name="baseYear" sx={{ maxWidth: 260 }}
              placeholder="Select Base Financial Year">
              <MenuItem value="">Select Base Year</MenuItem>
              {years.map((yearData) => (
                <MenuItem key={yearData.value} value={yearData.value}>
                  {yearData.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
              Select your latest financial year. Previous years will auto-populate.
            </Typography>
          </Grid>
        </Grid>

        <AuditedFinancialStatement
          setPercent={setFinancialPercent}
          setProgress={setFinancialDone}
        />

        <AuditedIncomeTaxReturn
          setPercent={setItrPercent}
          setProgress={setItrDone}
        />

        <AuditedGSTR9
          setPercent={setGstr9Percent}
          setProgress={setGstr9Done}
        />

        <AuditedGST3B
          setPercent={setGstr3bPercent}
          setProgress={setGstr3bDone}
        />
      </FormProvider>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNextClick}>
          Next
        </Button>
      </Box>
    </Container>
  );
}

AuditedFinancialDocument.propTypes = {
  setActiveStepId: PropTypes.func,
  percent: PropTypes.func
};
