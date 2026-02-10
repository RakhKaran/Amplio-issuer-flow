import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
// import { useParams } from 'src/routes/hook';
// import { useGetBondApplication } from 'src/api/bondApplications';
import BusinessProfileMain from './business-profile/business-profile-main';
import ClientDetailListView from './client-details/view/client-detail-list-view';
import CollateralAssets from './collatral-assets/collatralAssets';
import GuarantorListView from './guarantor/view/guarantor-list-view';
import ReviewAndSubmitPage from './review & submit/review-and-submit';
import { useGetBusinessKyc } from 'src/api/businessKyc';
import { LoadingScreen } from 'src/components/loading-screen';
import Logo from 'src/components/logo';

export default function Stepper() {
  const { businessKyc, businessKycLoading } = useGetBusinessKyc();
  const [activeStepId, setActiveStepId] = useState(null);
  const [formData, setFormData] = useState({
    business_Profile_Finance: {},
    collateral_assets_verification: {},
    guarantor_details: {},
    review_and_submit: {},
  });

  const [stepsProgress, setStepsProgress] = useState({
    business_Profile_Finance: { percent: 0 },
    collateral_assets_verification: { percent: 0 },
    guarantor_details: { percent: 0 },
    review_and_submit: { percent: 0 },
  });

  useEffect(() => {
    if (!businessKyc) return;

    const STEP_MAP = {
      business_profile: 'business_Profile_Finance',
      audited_financials: 'business_Profile_Finance',
      collateral_assets: 'collateral_assets_verification',
      guarantor_details: 'guarantor_details',
      review_and_submit: 'review_and_submit',
    };

    // ✅ Set Active Step
    const activeCode = businessKyc?.activeStep?.code;

    if (activeCode && STEP_MAP[activeCode]) {
      setActiveStepId(STEP_MAP[activeCode]);
    }

    // ✅ Mark Completed Steps
    if (Array.isArray(businessKyc.completedSteps)) {
      setStepsProgress((prev) => {
        const updated = { ...prev };

        businessKyc.completedSteps.forEach((step) => {
          const mapped = STEP_MAP[step.code];
          if (mapped) updated[mapped] = { percent: 100 };
        });

        return updated;
      });
    }
  }, [businessKyc]);


  if (businessKycLoading) {
    return <LoadingScreen />;
  }

  if (!activeStepId) {
    return <LoadingScreen />;
  }

  const steps = [
    {
      id: 'business_Profile_Finance',
      number: 1,
      lines: ['Business Profile', '& Finance'],
    },
    {
      id: 'collateral_assets_verification',
      number: 2,
      lines: ['Collateral & Assets', 'Verification'],
    },
    {
      id: 'guarantor_details',
      number: 3,
      lines: ['Guarantor', 'Details'],
    },
    {
      id: 'review_and_submit',
      number: 4,
      lines: ['Review & Submit'],
    },
  ];

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        percent,
      },
    }));
  };

  const saveStepData = (stepId, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...data, // merge new fields with old
      },
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

  // useEffect(() => {
  //   if (bondApplication && !bondApplicationLoading && !dataInitialized) {
  //     setApplicationData(bondApplication);

  //     const completedStepCodes = bondApplication.completedSteps?.map((step) => step.code) || [];

  //     let currentStep = 'my_bond_new_issue';

  //     if (
  //       completedStepCodes.includes('initialized') &&
  //       completedStepCodes.includes('issue_details') &&
  //       completedStepCodes.includes('document_upload')
  //     ) {
  //       updateStepPercent('my_bond_new_issue', 100);
  //       currentStep = 'intermediaries';
  //     }

  //     if (
  //       completedStepCodes.includes('intermediary_appointments_pending') &&
  //       completedStepCodes.includes('intermediary_appointments_success')
  //     ) {
  //       updateStepPercent('intermediaries', 100);
  //       currentStep = 'fund_position';
  //     }

  //     if (
  //       completedStepCodes.includes('fund_position') &&
  //       completedStepCodes.includes('capital_details')
  //     ) {
  //       updateStepPercent('fund_position', 100);
  //       currentStep = 'audited_financial';
  //     }

  //     if (
  //       completedStepCodes.includes('financial_statements') &&
  //       completedStepCodes.includes('income_tax_returns') &&
  //       completedStepCodes.includes('gstr-9') &&
  //       completedStepCodes.includes('gst-3b')
  //     ) {
  //       updateStepPercent('audited_financial', 100);
  //       currentStep = 'borrowing_details';
  //     }

  //     if (completedStepCodes.includes('borrowing_details')) {
  //       updateStepPercent('borrowing_details', 100);
  //       currentStep = 'collateral_assets';
  //     }

  //     if (
  //       completedStepCodes.includes('collateral_assets') &&
  //       completedStepCodes.includes('collateral_assets_approval')
  //     ) {
  //       updateStepPercent('collateral_assets', 100);
  //       currentStep = 'financial_details';
  //     }

  //     if (completedStepCodes.includes('financial_details')) {
  //       updateStepPercent('financial_details', 100);
  //       currentStep = 'credit_rating';
  //     }

  //     setActiveStepId(currentStep);
  //     setDataInitialized(true);
  //   }
  // }, [bondApplication, bondApplicationLoading, dataInitialized]);

  // useEffect(() => {
  //   if (bondApplication && !bondApplicationLoading) {
  //     setApplicationData(bondApplication);
  //   }
  // }, [bondApplication, bondApplicationLoading]);

  const renderForm = () => {
    switch (activeStepId) {
      case 'business_Profile_Finance':
        return (
          <BusinessProfileMain
            percent={(p) => updateStepPercent('business_Profile_Finance', p)}
            setActiveStepId={() => setActiveStepId('collateral_assets_verification')}
            saveStepData={(data) => saveStepData('business_Profile_Finance', data)}
          />
        );

      case 'collateral_assets_verification':
        return (
          <CollateralAssets
            percent={(p) => updateStepPercent('collateral_assets_verification', p)}
            setActiveStepId={() => setActiveStepId('guarantor_details')}
            saveStepData={(data) => saveStepData('collateral_assets_verification', data)}
          />
        );

      case 'guarantor_details':
        return (
          <GuarantorListView
            percent={(p) => updateStepPercent('guarantor_details', p)}
            setActiveStepId={() => setActiveStepId('review_and_submit')}
            saveStepData={(data) => saveStepData('guarantor_details', data)}
          />
        );

      case 'review_and_submit':
        return (
          <ReviewAndSubmitPage
            percent={(p) => updateStepPercent('review_and_submit', p)}
            setActiveStepId={setActiveStepId}
            formData={formData}
          />
        );

      default:
        return <Box>Unknown step: {activeStepId}</Box>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>
      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>{renderForm()}</Stack>
    </Box>
  );
}
