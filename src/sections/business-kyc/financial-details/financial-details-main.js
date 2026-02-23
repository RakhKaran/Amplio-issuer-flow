import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetBusinessKycStepData } from 'src/api/businessKyc';
import { LoadingScreen } from 'src/components/loading-screen';
import { LoadingButton } from '@mui/lab';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import FinancialDetailsForm from './financial-details';
import FundPosition from './fund-position';
import BorrowingDetails from './borrowing-details';
import CapitalDetails from './capital-details';
import FinancialRatios from './financial-ratios';
import axiosInstance from 'src/utils/axios';

export default function FinancialDetailsMain({ percent, setActiveStepId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [fundPositionPercent, setFundPositionPercent] = useState(0);
  const [borrowingDetailsPercent, setBorrowingDetailsPercent] = useState(0);
  const [capitalDetailsPercent, setCapitalDetailsPercent] = useState(0);
  const [financialRatiosPercent, setFinancialRatiosPercent] = useState(0);
  const [auditedFinancialPercent, setAuditedFinancialPercent] = useState(0);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { stepData, stepDataLoading } = useGetBusinessKycStepData('financial_details');

  const fullFinancialSection = stepData?.data ?? {};

  useEffect(() => {
    const normalizedFundPositionPercent = Math.min(100, Math.round((fundPositionPercent || 0) * 2));
    const total = Math.round(
      (
        normalizedFundPositionPercent +
        borrowingDetailsPercent +
        capitalDetailsPercent +
        financialRatiosPercent +
        auditedFinancialPercent
      ) / 5
    );
    percent?.(total);
  }, [
    fundPositionPercent,
    borrowingDetailsPercent,
    capitalDetailsPercent,
    financialRatiosPercent,
    auditedFinancialPercent,
    percent,
  ]);

  if (stepDataLoading) {
    return <LoadingScreen />;
  }

  const isFundPositionComplete = Math.min(100, Math.round((fundPositionPercent || 0) * 2)) === 100;
  const isBorrowingComplete = borrowingDetailsPercent === 100;
  const isCapitalComplete = capitalDetailsPercent === 100;
  const isRatiosComplete = financialRatiosPercent === 100;
  const isAuditedComplete = auditedFinancialPercent === 100;

  const handleNextClick = async () => {
    if (
      !isFundPositionComplete ||
      !isBorrowingComplete ||
      !isCapitalComplete ||
      !isRatiosComplete ||
      !isAuditedComplete
    ) {
      enqueueSnackbar('Please complete all financial forms before moving to next step', {
        variant: 'error',
      });
      return;
    }

    try {
      setIsNextLoading(true);
      const stateRes = await axiosInstance.get('/business-kyc/state');
      const nextStepCode = stateRes?.data?.data?.activeStep?.code;

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

      <FinancialDetailsForm
        fullFinancialSection={fullFinancialSection}
        percent={(value) => setAuditedFinancialPercent(value || 0)}
      />
      <FundPosition
        currentFundPosition={fullFinancialSection?.fundPosition}
        setPercent={setFundPositionPercent}
        setProgress={() => { }}
      />
      <BorrowingDetails
        currentBorrowingDetails={fullFinancialSection?.borrowingDetails}
        setPercent={setBorrowingDetailsPercent}
        setProgress={() => { }}
      />
      <CapitalDetails
        currentCapitalDetails={fullFinancialSection?.capitalDetails}
        setPercent={setCapitalDetailsPercent}
        setProgress={() => { }}
      />
      <FinancialRatios
        currentFinancialRatios={fullFinancialSection?.financialRatios}
        setPercent={setFinancialRatiosPercent}
        setProgress={() => { }}
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
