import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import FundAndCreditForm from './fund-position-and-credit-rating/fundAndCreditForm';
import { useGetBondEstimation } from 'src/api/bondEstimations';
import { useParams } from 'src/routes/hook';
import NotFoundPage from 'src/pages/404';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import MainFile from './borrowing-and-capital-details/main';
import FinancialDetails from './financial-ratios/financial-details';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import PriliminaryAndCollateralView from './preliminary-requirements-and collatral-details/priliminaryAndCollateralView';

export default function Stepper() {
  const params = useParams()
  const { applicationId } = params;
  const [activeStepId, setActiveStepId] = useState('fund_position_and_credit_ratings');
  const [estimationData, setEstimationData] = useState(null);
  const { bondEstimation, bondEstimationLoading } = useGetBondEstimation(applicationId);
  const [dataInitialized, setDataInitialized] = useState(false);

  const steps = [
    {
      id: 'fund_position_and_credit_ratings',
      number: 1,
      lines: ['Fund Position and', 'Credit Rating'],
    },
    {
      id: 'audited_financial',
      number: 2,
      lines: ['Audited', 'Financials'],
    },
    {
      id: 'borrowing_details',
      number: 3,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'financial_details',
      number: 4,
      lines: ['Financial', 'Details'],
    },
    {
      id: 'preliminary_bond_requirements',
      number: 5,
      lines: ['Preliminary', 'Requirements'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    fund_position_and_credit_ratings: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    financial_details: { percent: 0 },
    preliminary_bond_requirements: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    // Prevent jumping forward if previous step is incomplete
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'fund_position_and_credit_ratings':
        return (
          <FundAndCreditForm
            percent={(p) => updateStepPercent('fund_position_and_credit_ratings', p)}
            setActiveStepId={() => setActiveStepId('audited_financial')}
            currentFundPosition={estimationData ? estimationData?.fundPosition : null}
            currentCreditRatings={estimationData ? estimationData?.estimationCreditRatings : null}
          />
        );

      case 'audited_financial':
        return (
          <AuditedFinancialDocument
            percent={(p) => updateStepPercent('audited_financial', p)}
            setActiveStepId={() => setActiveStepId('borrowing_details')}
            currentAuditedFinancials={estimationData ? estimationData?.fundPosition : null}
          />
        );

      case 'borrowing_details':
        return (
          <MainFile
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={() => setActiveStepId('financial_details')}
            currentBorrowingDetails={estimationData ? estimationData?.estimationBorrowingDetails : null}
            currentCapitalDetails={estimationData ? estimationData?.capitalDetails : null}
            currentProfitabilityDetails={estimationData ? estimationData?.profitabilityDetails : null}
          />
        );

      case 'financial_details':
        return (
          <FinancialDetails
            percent={(p) => updateStepPercent('financial_details', p)}
            setActiveStepId={() => setActiveStepId('preliminary_bond_requirements')}
            currentFinancialRatios={estimationData ? estimationData?.financialRatios : null}
          />
        );

      case 'preliminary_bond_requirements':
        return (
          <PriliminaryAndCollateralView
            percent={(p) => updateStepPercent('preliminary_bond_requirements', p)}
            setActiveStepId={() => setActiveStepId('preliminary_bond_requirements')}
            currentPrliminaryRequirements={estimationData ? estimationData?.estimationPriliminaryBondRequirements : null}
            currentCollateral={estimationData ? estimationData?.currentCollateralAssets : null}
          />
        );

      default:
        return <NotFoundPage />;
    }
  };

  useEffect(() => {
    if (bondEstimation && !bondEstimationLoading && !dataInitialized) {

      setEstimationData(bondEstimation);
      let currentStep = 'fund_position_and_credit_ratings';

      if (
        bondEstimation.currentProgress.includes('fund_position') &&
        bondEstimation.currentProgress.includes('credit_ratings')
      ) {
        updateStepPercent('fund_position_and_credit_ratings', 100);
        currentStep = 'borrowing_details';
      }

      if (
        bondEstimation.currentProgress.includes('profitability_details') &&
        bondEstimation.currentProgress.includes('capital_details') &&
        bondEstimation.currentProgress.includes('borrowing_details')
      ) {
        updateStepPercent('audited_financial', 100);
        updateStepPercent('borrowing_details', 100);
        currentStep = 'financial_details';
      }

      if (bondEstimation.currentProgress.includes('financial_details')) {
        updateStepPercent('financial_details', 100);
        currentStep = 'preliminary_bond_requirements';
      }

      setActiveStepId(currentStep);

      setDataInitialized(true);
    }
  }, [bondEstimation, bondEstimationLoading, dataInitialized]);

  return (
    <Box sx={{ p: 3 }}>
      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
