import { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import { useParams } from 'src/routes/hook';
import { useGetBondApplication } from 'src/api/bondApplications';
import BusinessProfileMain from './business-profile/business-profile-main';
import ClientDetailListView from './client-details/view/client-detail-list-view';
import CollateralAssets from './collatral-assets/collatralAssets';
import GuarantorListView from './guarantor/view/guarantor-list-view';

export default function Stepper() {
  const params = useParams();
  const { applicationId } = params;

  const [applicationData, setApplicationData] = useState(null);
  // const { bondApplication, bondApplicationLoading } = useGetBondApplication(applicationId);
  const [dataInitialized, setDataInitialized] = useState(false);

  const [activeStepId, setActiveStepId] = useState('business_Profile_Finance');
  const [formData, setFormData] = useState({
    business_Profile_Finance: {},
    client_details: {},
    collateral_assets_verification: {},
    guarantor_details: {},
    review_and_submit: {},
  });

  const steps = [
    {
      id: 'business_Profile_Finance',
      number: 1,
      lines: ['Business Profile', '& Finance'],
    },
    {
      id: 'client_details',
      number: 2,
      lines: ['Clieant', 'Details'],
    },
    {
      id: 'collateral_assets_verification',
      number: 3,
      lines: ['Collateral & Assets', 'Verification'],
    },
    {
      id: 'guarantor_details',
      number: 4,
      lines: ['Guarantor', 'Details'],
    },
    {
      id: 'review_and_submit',
      number: 5,
      lines: ['Review & Submit'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    business_Profile_Finance: { percent: 0 },
    client_details: { percent: 0 },
    collateral_assets_verification: { percent: 0 },
    guarantor_details: { percent: 0 },
    review_and_submit: { percent: 0 },
  });

  useEffect(() => {
    const savedStep = localStorage.getItem('activeStepId');
    const savedForm = localStorage.getItem('formData');
    const savedProgress = localStorage.getItem('stepsProgress');

    // Validate saved step exists in steps array
    if (savedStep && steps.find((s) => s.id === savedStep)) {
      setActiveStepId(savedStep);
    }
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedProgress) setStepsProgress(JSON.parse(savedProgress));
  }, []);

  useEffect(() => {
    localStorage.setItem('activeStepId', activeStepId);
  }, [activeStepId]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('stepsProgress', JSON.stringify(stepsProgress));
  }, [stepsProgress]);

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
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
            setActiveStepId={() => setActiveStepId('client_details')}
            saveStepData={(data) => saveStepData('business_Profile_Finance', data)}
          />
        );

      case 'client_details':
        return (
          <ClientDetailListView
            percent={(p) => updateStepPercent('client_details', p)}
            setActiveStepId={() => setActiveStepId('collateral_assets_verification')}
          />
        );

      case 'collateral_assets_verification':
        return (
          <CollateralAssets
            percent={(p) => updateStepPercent('collateral_assets_verification', p)}
            setActiveStepId={() => setActiveStepId('guarantor_details')}
          />
        );

      case 'guarantor_details':
        return (
          <GuarantorListView
            percent={(p) => updateStepPercent('guarantor_details', p)}
            setActiveStepId={() => setActiveStepId('review_and_submit')}
          />
        );

      // case 'review_and_submit':
      //   return (
      //     <BorrowingDetails
      //       percent={(p) => updateStepPercent('borrowing_details', p)}
      //       setActiveStepId={setActiveStepId}
      //     />
      //   );

      default:
        return <Box>Done</Box>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
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
