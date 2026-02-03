import { Box, Button, Container } from '@mui/material';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import BusinessProfile from './business-profile';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

export default function BusinessProfileMain({ setActiveStepId, percent, saveStepData }) {
  const { enqueueSnackbar } = useSnackbar();

  const [savedData, setSavedData] = useState(() => {
    try {
      const saved = localStorage.getItem('formData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.business_Profile_Finance || {};
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    return {};
  });

  const [isBaseYearDone, setIsBaseYearDone] = useState(savedData?.isBaseYearDone || false);
  const [financialDone, setFinancialDone] = useState(savedData?.financialDone || false);
  const [itrDone, setItrDone] = useState(savedData?.itrDone || false);
  const [gstr9Done, setGstr9Done] = useState(savedData?.gstr9Done || false);
  const [gstr3bDone, setGstr3bDone] = useState(savedData?.gstr3bDone || false);

  const [businessProfilePercent, setBusinessProfilePercent] = useState(
    savedData?.businessProfilePercent || 0
  );
  const [financialPercent, setFinancialPercent] = useState(savedData?.financialPercent || 0);
  const [itrPercent, setItrPercent] = useState(savedData?.itrPercent || 0);
  const [gstr9Percent, setGstr9Percent] = useState(savedData?.gstr9Percent || 0);
  const [gstr3bPercent, setGstr3bPercent] = useState(savedData?.gstr3bPercent || 0);

  const isInitialMount = useRef(true);

  // Ref to track latest saved data for merging (avoid state dependency)
  const savedDataRef = useRef(savedData);

  useEffect(() => {
    const reloadData = () => {
      try {
        const saved = localStorage.getItem('formData');
        if (saved) {
          const parsed = JSON.parse(saved);
          const latestData = parsed.business_Profile_Finance || {};
          setSavedData((prev) => {
            if (JSON.stringify(latestData) !== JSON.stringify(prev)) {
              return latestData;
            }
            return prev;
          });
          savedDataRef.current = latestData;
        }
      } catch (error) {
        console.error('Error reloading saved data:', error);
      }
    };
    reloadData();

    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 100); // Small delay to allow stepper's useEffect to complete

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update ref when savedData changes from external source
  useEffect(() => {
    savedDataRef.current = savedData;
  }, [savedData]);

  // Save data to localStorage and stepper
  const handleSaveData = useCallback(
    (data) => {
      const dataToSave = {
        ...savedDataRef.current,
        ...data,
        isBaseYearDone,
        financialDone,
        itrDone,
        gstr9Done,
        gstr3bDone,
        businessProfilePercent,
        financialPercent,
        itrPercent,
        gstr9Percent,
        gstr3bPercent,
      };
      savedDataRef.current = dataToSave;
      saveStepData?.(dataToSave);
    },
    [
      isBaseYearDone,
      financialDone,
      itrDone,
      gstr9Done,
      gstr3bDone,
      businessProfilePercent,
      financialPercent,
      itrPercent,
      gstr9Percent,
      gstr3bPercent,
      saveStepData,
    ]
  );

  // Calculate overall progress
  const calculateOverallProgress = useCallback(() => {
    const baseYearWeight = 10;
    const businessProfileWeight = 20;
    const financialWeight = 25;
    const itrWeight = 15;
    const gstr9Weight = 15;
    const gstr3bWeight = 15;

    const total =
      (isBaseYearDone ? baseYearWeight : 0) +
      (businessProfilePercent / 100) * businessProfileWeight +
      (financialPercent / 100) * financialWeight +
      (itrPercent / 100) * itrWeight +
      (gstr9Percent / 100) * gstr9Weight +
      (gstr3bPercent / 100) * gstr3bWeight;

    return Math.round(total);
  }, [
    isBaseYearDone,
    businessProfilePercent,
    financialPercent,
    itrPercent,
    gstr9Percent,
    gstr3bPercent,
  ]);

  // Update progress when any field changes
  const isStepComplete =
    isBaseYearDone &&
    businessProfilePercent === 100 &&
    financialDone &&
    itrDone &&
    gstr9Done &&
    gstr3bDone;

  // Update stepper percentage whenever any progress value changes
  useEffect(() => {
    const overallProgress = isStepComplete ? 100 : calculateOverallProgress();
    percent?.(overallProgress);
  }, [
    isStepComplete,
    isBaseYearDone,
    businessProfilePercent,
    financialPercent,
    itrPercent,
    gstr9Percent,
    gstr3bPercent,
    financialDone,
    itrDone,
    gstr9Done,
    gstr3bDone,
    calculateOverallProgress,
  ]);

  // Save percentages whenever they change (but skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    handleSaveData({});
  }, [
    businessProfilePercent,
    financialPercent,
    itrPercent,
    gstr9Percent,
    gstr3bPercent,
    isBaseYearDone,
    financialDone,
    itrDone,
    gstr9Done,
    gstr3bDone,
  ]);

  // Handle business profile save
  const handleBusinessProfileSave = useCallback(
    (data) => {
      handleSaveData({ businessProfile: data });
      enqueueSnackbar('Business profile saved successfully', { variant: 'success' });
    },
    [handleSaveData, enqueueSnackbar]
  );

  // Handle audited financial document updates
  const handleFinancialUpdate = useCallback(
    (updates) => {
      if (updates.isBaseYearDone !== undefined) setIsBaseYearDone(updates.isBaseYearDone);
      if (updates.financialDone !== undefined) setFinancialDone(updates.financialDone);
      if (updates.itrDone !== undefined) setItrDone(updates.itrDone);
      if (updates.gstr9Done !== undefined) setGstr9Done(updates.gstr9Done);
      if (updates.gstr3bDone !== undefined) setGstr3bDone(updates.gstr3bDone);
      if (updates.financialPercent !== undefined) setFinancialPercent(updates.financialPercent);
      if (updates.itrPercent !== undefined) setItrPercent(updates.itrPercent);
      if (updates.gstr9Percent !== undefined) setGstr9Percent(updates.gstr9Percent);
      if (updates.gstr3bPercent !== undefined) setGstr3bPercent(updates.gstr3bPercent);

      // Save audited financial data and updated percentages immediately
      // Note: handleSaveData will be called by the useEffect that watches these state changes
      // But we also call it here to ensure immediate save of the data object
      if (updates.auditedFinancial) {
        handleSaveData({ auditedFinancial: updates.auditedFinancial });
      }
    },
    [handleSaveData]
  );

  // ✅ Single source of truth
  const handleNextClick = () => {
    if (!isBaseYearDone) {
      enqueueSnackbar('Please select base year', { variant: 'error' });
      return;
    }
    if (!financialDone) {
      enqueueSnackbar('Complete audited financial statement', { variant: 'error' });
      return;
    }
    if (!itrDone) {
      enqueueSnackbar('Complete ITR section', { variant: 'error' });
      return;
    }
    if (!gstr9Done) {
      enqueueSnackbar('Complete GSTR-9 section', { variant: 'error' });
      return;
    }
    if (!gstr3bDone) {
      enqueueSnackbar('Complete GSTR-3B section', { variant: 'error' });
      return;
    }

    // Set step to 100% before moving to next step
    percent?.(100);
    handleSaveData({});
    setActiveStepId?.();
  };

  return (
    <Container>
      <BusinessProfile
        onSave={handleBusinessProfileSave}
        onProgressChange={setBusinessProfilePercent}
        savedData={savedData?.businessProfile}
      />
      <AuditedFinancialDocument
        onUpdate={handleFinancialUpdate}
        savedData={savedData?.auditedFinancial}
      />
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', pr: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              boxShadow: 'none',
            },
          }}
          onClick={handleNextClick}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}

BusinessProfileMain.propTypes = {
  setActiveStepId: PropTypes.func,
  percent: PropTypes.func,
  saveStepData: PropTypes.func,
};
