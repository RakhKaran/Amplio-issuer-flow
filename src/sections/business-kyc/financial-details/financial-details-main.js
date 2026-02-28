import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useGetBusinessKycStepData } from 'src/api/businessKyc';
import axiosInstance from 'src/utils/axios';
import AuditedFinancial from './audited-financial';
import FundPosition from './fund-position';
import BorrowingDetails from './borrowing-details';
import CapitalDetails from './capital-details';
import ProfitabilityDetails from './profitable-details';
import FinancialDetails from './financial-details';
import { LoadingScreen } from 'src/components/loading-screen';

export default function FinancialDetailsMain({ percent, setActiveStepId }) {
  const { enqueueSnackbar } = useSnackbar();

  const [fundPositionPercent, setFundPositionPercent] = useState(0);
  const [borrowingPercent, setBorrowingPercent] = useState(0);
  const [capitalPercent, setCapitalPercent] = useState(0);
  const [profitabilityPercent, setProfitabilityPercent] = useState(0);
  const [auditedFinancialPercent, setAuditedFinancialPercent] = useState(0);
  const [ratiosPercent, setRatiosPercent] = useState(0);

  const [fundPositionComplete, setFundPositionComplete] = useState(false);
  const [borrowingComplete, setBorrowingComplete] = useState(false);
  const [capitalComplete, setCapitalComplete] = useState(false);
  const [profitabilityComplete, setProfitabilityComplete] = useState(false);
  const [auditedFinancialComplete, setAuditedFinancialComplete] = useState(false);
  const [ratiosComplete, setRatiosComplete] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const { stepData, stepDataLoading } = useGetBusinessKycStepData('financial_details');
  const fullFinancialSection = stepData?.data;
  const [financialSection, setFinancialSection] = useState({});

  useEffect(() => {
    if (fullFinancialSection) {
      setFinancialSection(fullFinancialSection);
    }
  }, [fullFinancialSection]);

  useEffect(() => {
    const total = Math.round(
      (
        fundPositionPercent +
        borrowingPercent +
        capitalPercent +
        profitabilityPercent +
        auditedFinancialPercent +
        ratiosPercent
      ) / 6
    );

    const allCompleted =
      fundPositionComplete &&
      borrowingComplete &&
      capitalComplete &&
      profitabilityComplete &&
      auditedFinancialComplete &&
      ratiosComplete;

    percent?.(allCompleted ? 100 : Math.min(total, 99));
  }, [
    fundPositionPercent,
    borrowingPercent,
    capitalPercent,
    profitabilityPercent,
    auditedFinancialPercent,
    ratiosPercent,
    fundPositionComplete,
    borrowingComplete,
    capitalComplete,
    profitabilityComplete,
    auditedFinancialComplete,
    ratiosComplete,
    percent,
  ]);

  // if (stepDataLoading) {
  //   return <LoadingScreen />;
  // }


  const onSectionSaved = (key, value) => {
    setFinancialSection((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNextClick = async () => {
    if (
      !fundPositionComplete ||
      !borrowingComplete ||
      !capitalComplete ||
      !profitabilityComplete ||
      !auditedFinancialComplete ||
      !ratiosComplete
    ) {
      enqueueSnackbar('Please complete all financial forms before moving to next step', {
        variant: 'error',
      });
      return;
    }

    try {
      setIsNextLoading(true);
      // const stateRes = await axiosInstance.get('/business-kyc/state');
      // const nextStepCode = stateRes?.data?.data?.activeStep?.code;

      const stateRes = await axiosInstance.get('/business-kyc/state');

      const nextStepCode = stateRes?.data?.data?.activeStep?.code;

      if (!nextStepCode) {
        console.error('No next step returned from backend');
        return;
      }

      // 3️⃣ Move UI to next step
      setActiveStepId(nextStepCode);

      if (!nextStepCode) {
        enqueueSnackbar('No next step returned from backend', { variant: 'error' });
        return;
      }

      setActiveStepId?.(nextStepCode);
    } catch (error) {
      console.error('Error while moving to next step from financial details:', error);
      enqueueSnackbar('Failed to move to next step', { variant: 'error' });
    } finally {
      setIsNextLoading(false);
    }
  };

  return (
    <Container>
      <AuditedFinancial
        currentAuditedFinancials={financialSection?.auditedFinancials}
        setPercent={setAuditedFinancialPercent}
        setProgress={setAuditedFinancialComplete}
        onSaved={(value) => onSectionSaved('auditedFinancials', value)}
      />

      <FundPosition
        currentFundPosition={financialSection?.fundPosition}
        setPercent={setFundPositionPercent}
        setProgress={setFundPositionComplete}
        onSaved={(value) => onSectionSaved('fundPosition', value)}
      />

      <BorrowingDetails
        currentBorrowingDetails={financialSection?.borrowingDetails}
        setPercent={setBorrowingPercent}
        setProgress={setBorrowingComplete}
        onSaved={(value) => onSectionSaved('borrowingDetails', value)}
      />

      <CapitalDetails
        currentCapitalDetails={financialSection?.capitalDetails}
        setPercent={setCapitalPercent}
        setProgress={setCapitalComplete}
        onSaved={(value) => onSectionSaved('capitalDetails', value)}
      />

      <ProfitabilityDetails
        currentProfitabilityDetails={financialSection?.profitabilityDetails}
        setPercent={setProfitabilityPercent}
        setProgress={setProfitabilityComplete}
        onSaved={(value) => onSectionSaved('profitabilityDetails', value)}
      />

      <FinancialDetails
        currentFinancialRatios={financialSection?.financialRatios}
        currentCapitalDetails={financialSection?.capitalDetails}
        currentProfitabilityDetails={financialSection?.profitabilityDetails}
        currentFundPosition={financialSection?.fundPosition}
        currentBorrowingDetails={financialSection?.borrowingDetails}
        setPercent={setRatiosPercent}
        setProgress={setRatiosComplete}
        onSaved={(value) => onSectionSaved('financialRatios', value)}
      />

      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton loading={isNextLoading} variant="contained" color="primary" onClick={handleNextClick}>
          Next
        </LoadingButton>
      </Box>
    </Container>
  );
}

FinancialDetailsMain.propTypes = {
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
};
