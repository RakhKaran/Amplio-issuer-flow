import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import AuditedFinancialStatement from './audited-fnancial-statement';
import AuditedIncomeTaxReturn from './audited-income-tax-return';
import AuditedGSTR9 from './audited-gstr9';
import AuditedGST3B from './audited-gstr3b';
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
// import { useGetBondApplicationStepData } from 'src/api/bondApplications';
// import { useParams } from 'src/routes/hook';

export default function AuditedFinancialDocument({ onUpdate, savedData }) {
  // const params = useParams();
  // const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  // Commented out API integration
  // const { stepData, stepDataLoading } = useGetBondApplicationStepData(
  //   applicationId,
  //   'financial_statements'
  // );

  // Track if completion message has been shown
  const completionMessageShown = useRef(false);

  // Load saved data (API integration commented out)
  const [currentData, setCurrentData] = useState(() => {
    if (savedData) {
      return {
        financialStatements: savedData?.financialStatements || [],
        incomeTaxReturns: savedData?.incomeTaxReturns || [],
        gstr9: savedData?.gstr9 || [],
        gst3b: savedData?.gst3b || [],
      };
    }
    // Initialize with empty arrays if no saved data
    return {
      financialStatements: [],
      incomeTaxReturns: [],
      gstr9: [],
      gst3b: [],
    };
  });

  const [isBaseYearDone, setBaseYearDone] = useState(savedData?.isBaseYearDone || false);

  const [financialPercent, setFinancialPercent] = useState(savedData?.financialPercent || 0);
  const [itrPercent, setItrPercent] = useState(savedData?.itrPercent || 0);
  const [gstr9Percent, setGstr9Percent] = useState(savedData?.gstr9Percent || 0);
  const [gstr3bPercent, setGstr3bPercent] = useState(savedData?.gstr3bPercent || 0);

  const [financialDone, setFinancialDone] = useState(savedData?.financialDone || false);
  const [itrDone, setItrDone] = useState(savedData?.itrDone || false);
  const [gstr9Done, setGstr9Done] = useState(savedData?.gstr9Done || false);
  const [gstr3bDone, setGstr3bDone] = useState(savedData?.gstr3bDone || false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: `${year - 1} - ${year}` };
  });

  const year = new Date().getFullYear().toString();


  const methods = useForm({
    defaultValues: {
      baseYear: savedData?.baseYear?.toString() || year,
    },
  });


  const { watch } = methods;
  const selectedYear = watch('baseYear');

  useEffect(() => {
    const done = !!selectedYear;
    setBaseYearDone(done);
    onUpdate?.({ isBaseYearDone: done, baseYear: selectedYear });
  }, [selectedYear, onUpdate]);

  // Update parent when any progress changes
  useEffect(() => {
    onUpdate?.({
      financialPercent,
      itrPercent,
      gstr9Percent,
      gstr3bPercent,
      financialDone,
      itrDone,
      gstr9Done,
      gstr3bDone,
    });
  }, [financialPercent, itrPercent, gstr9Percent, gstr3bPercent,
    financialDone, itrDone, gstr9Done, gstr3bDone, onUpdate]);

  // Check if all audited financials are completed and show snackbar
  useEffect(() => {
    const allCompleted = financialDone && itrDone && gstr9Done && gstr3bDone && isBaseYearDone;

    if (allCompleted && !completionMessageShown.current) {
      enqueueSnackbar('All audited financial documents have been completed successfully!', {
        variant: 'success',
      });
      completionMessageShown.current = true;
    } else if (!allCompleted) {
      // Reset flag if any section becomes incomplete
      completionMessageShown.current = false;
    }
  }, [financialDone, itrDone, gstr9Done, gstr3bDone, isBaseYearDone, enqueueSnackbar]);

  // Commented out API integration
  // useEffect(() => {
  //   if (stepData && !stepDataLoading && !savedData) {
  //     setCurrentData({
  //       financialStatements: stepData?.financialStatements,
  //       incomeTaxReturns: stepData?.incomeTaxReturns,
  //       gstr9: stepData?.gstr9,
  //       gst3b: stepData?.gst3b,
  //     });
  //     // Save API data to parent
  //     onUpdate?.({
  //       auditedFinancial: {
  //         financialStatements: stepData?.financialStatements,
  //         incomeTaxReturns: stepData?.incomeTaxReturns,
  //         gstr9: stepData?.gstr9,
  //         gst3b: stepData?.gst3b,
  //       },
  //     });
  //   } else if (!currentData && !savedData) {
  //     setCurrentData({
  //       financialStatements: [],
  //       incomeTaxReturns: [],
  //       gstr9: [],
  //       gst3b: [],
  //     });
  //   }
  // }, [stepData, stepDataLoading, savedData, currentData, onUpdate]);


  return (
    <Container>
      <Typography variant="h5" fontWeight="bold" color="primary">
        Audited Financial
      </Typography>
      <Typography variant="body2" mb={2}>
        Upload audited financial documents for assessment
      </Typography>
      <FormProvider methods={methods}>
        <Grid container sx={{ p: 4, borderRadius: 2, border: '1px solid #ddd', boxShadow: 2 }}>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Base Year (Latest Financial Year)
            </Typography>

            <RHFSelect
              name="baseYear"
              sx={{ maxWidth: 260 }}
              placeholder="Select Base Financial Year"
              disabled
            >
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
          setPercent={(p) => {
            setFinancialPercent(p);
            onUpdate?.({ financialPercent: p });
          }}
          setProgress={(done) => {
            setFinancialDone(done);
            onUpdate?.({ financialDone: done });
          }}
          currentBaseYear={selectedYear}
          currentData={currentData?.financialStatements}
          onSave={(data) => {
            const newData = {
              ...currentData,
              financialStatements: data,
            };
            setCurrentData(newData);
            onUpdate?.({ auditedFinancial: newData });
          }}
        />

        <AuditedIncomeTaxReturn
          setPercent={(p) => {
            setItrPercent(p);
            onUpdate?.({ itrPercent: p });
          }}
          setProgress={(done) => {
            setItrDone(done);
            onUpdate?.({ itrDone: done });
          }}
          currentBaseYear={selectedYear}
          currentData={currentData?.incomeTaxReturns}
          onSave={(data) => {
            const newData = {
              ...currentData,
              incomeTaxReturns: data,
            };
            setCurrentData(newData);
            onUpdate?.({ auditedFinancial: newData });
          }}
        />

        <AuditedGSTR9
          setPercent={(p) => {
            setGstr9Percent(p);
            onUpdate?.({ gstr9Percent: p });
          }}
          setProgress={(done) => {
            setGstr9Done(done);
            onUpdate?.({ gstr9Done: done });
          }}
          currentBaseYear={selectedYear}
          currentData={currentData?.gstr9}
          onSave={(data) => {
            const newData = {
              ...currentData,
              gstr9: data,
            };
            setCurrentData(newData);
            onUpdate?.({ auditedFinancial: newData });
          }}
        />

        <AuditedGST3B
          setPercent={(p) => {
            setGstr3bPercent(p);
            onUpdate?.({ gstr3bPercent: p });
          }}
          setProgress={(done) => {
            setGstr3bDone(done);
            onUpdate?.({ gstr3bDone: done });
          }}
          currentBaseYear={selectedYear}
          currentData={currentData?.gst3b}
          onSave={(data) => {
            const newData = {
              ...currentData,
              gst3b: data,
            };
            setCurrentData(newData);
            onUpdate?.({ auditedFinancial: newData });
          }}
        />
      </FormProvider>
    </Container>
  );
}

AuditedFinancialDocument.propTypes = {
  onUpdate: PropTypes.func,
  savedData: PropTypes.object,
};
