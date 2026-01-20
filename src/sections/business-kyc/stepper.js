import { useState, useEffect, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
// import { useParams } from 'src/routes/hook';
// import { useGetBondApplication } from 'src/api/bondApplications';
import BusinessProfileMain from './business-profile/business-profile-main';
import ClientDetailListView from './client-details/view/client-detail-list-view';
import CollateralAssets from './collatral-assets/collatralAssets';
import GuarantorListView from './guarantor/view/guarantor-list-view';
import ReviewAndSubmitPage from './review & submit/review-and-submit';

export default function Stepper() {
  // const params = useParams();
  // const { applicationId } = params;

  // const [applicationData, setApplicationData] = useState(null);
  // const { bondApplication, bondApplicationLoading } = useGetBondApplication(applicationId);
  // const [dataInitialized, setDataInitialized] = useState(false);

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

  // CRITICAL FIX: Track if data has been loaded from localStorage
  // This prevents saving empty/default state before loading is complete
  const dataLoadedRef = useRef(false);

  // Load data from localStorage after component mounts
  useEffect(() => {
    const savedStep = localStorage.getItem('activeStepId');
    const savedForm = localStorage.getItem('formData');
    const savedProgress = localStorage.getItem('stepsProgress');

    if (savedStep) setActiveStepId(savedStep);

    // CRITICAL: Only update formData if savedForm exists and has data
    // This prevents overwriting with empty state
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        // Preserve ALL existing data - ensure all step keys exist with actual saved data
        const loadedFormData = {
          business_Profile_Finance: parsed.business_Profile_Finance || {},
          client_details: parsed.client_details || {},
          collateral_assets_verification: parsed.collateral_assets_verification || {},
          guarantor_details: parsed.guarantor_details || {},
          review_and_submit: parsed.review_and_submit || {},
        };

        // Only set if we actually have data to preserve
        setFormData(loadedFormData);
      } catch (error) {
        console.error('Error parsing formData from localStorage:', error);
      }
    }

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setStepsProgress({
          business_Profile_Finance: parsed.business_Profile_Finance || { percent: 0 },
          client_details: parsed.client_details || { percent: 0 },
          collateral_assets_verification: parsed.collateral_assets_verification || { percent: 0 },
          guarantor_details: parsed.guarantor_details || { percent: 0 },
          review_and_submit: parsed.review_and_submit || { percent: 0 },
        });
      } catch (error) {
        console.error('Error parsing stepsProgress from localStorage:', error);
      }
    }

    // Mark data as loaded IMMEDIATELY after setting state
    // The state update will be processed in the next render cycle
    dataLoadedRef.current = true;
  }, []);

  useEffect(() => {
    localStorage.setItem('activeStepId', activeStepId);
  }, [activeStepId]);

  // CRITICAL FIX: Only save formData to localStorage AFTER initial load is complete
  // This prevents overwriting localStorage with empty state before data is loaded
  useEffect(() => {
    if (dataLoadedRef.current) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('stepsProgress', JSON.stringify(stepsProgress));
  }, [stepsProgress]);

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        percent,
      },
    }));
  };

  // const saveStepData = (stepId, data) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [stepId]: {
  //       ...(prev[stepId] || {}),
  //       ...data, // merge new fields with old
  //     },
  //   }));
  // };
  const saveStepData = (stepId, data) => {
    setFormData((prev) => {
      let localStorageState = prev;
      try {
        const saved = localStorage.getItem('formData');
        if (saved) {
          const parsed = JSON.parse(saved);
          localStorageState = {
            business_Profile_Finance: parsed.business_Profile_Finance || prev.business_Profile_Finance || {},
            client_details: parsed.client_details || prev.client_details || {},
            collateral_assets_verification: parsed.collateral_assets_verification || prev.collateral_assets_verification || {},
            guarantor_details: parsed.guarantor_details || prev.guarantor_details || {},
            review_and_submit: parsed.review_and_submit || prev.review_and_submit || {},
          };
        }
      } catch (error) {
        console.error('Error reading localStorage in saveStepData:', error);
      }

      // Now merge the new data into the merged state
      return {
        ...localStorageState,
        [stepId]: {
          ...(localStorageState[stepId] || {}),
          ...data, // merge new fields with old - preserves existing fields in this step
        },
      };
    });
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
            saveStepData={(data) => saveStepData('client_details', data)}

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
