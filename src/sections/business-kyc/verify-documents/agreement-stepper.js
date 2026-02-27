import { useState, useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';

import SanctionLetter from './documents-letter/sanction-letter';
import PlatformAgreement from './documents-letter/platform-agreement';
import DeedOfHypo from './documents-letter/deed-of-hypo';
import ESignVerify from './e-sign/verify-e-sign';

import { useGetAgreements } from 'src/api/agreement';
import Logo from 'src/components/logo';

export default function AgreementStepper() {
  const { agreements = [], agreementsLoading } = useGetAgreements();

  const [activeStepId, setActiveStepId] = useState('sanction_letter');
  const [showESign, setShowESign] = useState(false);

  const [stepsProgress, setStepsProgress] = useState({
    sanction_letter: { percent: 0 },
    platform_agreement: { percent: 0 },
    deed_of_hypo: { percent: 0 },
  });

  // ✅ Convert array → map using sequenceOrder
  const documents = useMemo(() => {
    const map = {};

    agreements.forEach((doc) => {
      const order = doc.sequenceOrder; // ✅ FIXED

      map[order] = {
        id: doc.id,
        title: doc.businessKycDocumentType?.name,
        subtitle: doc.businessKycDocumentType?.description,
        pdfUrl: doc.media?.fileUrl,
      };
    });

    return map;
  }, [agreements]);

  if (agreementsLoading) return <>Loading...</>;

  if (showESign) return <ESignVerify />;

  const steps = [
    {
      id: 'sanction_letter',
      number: 1,
      lines: ['Sanction', 'Letter'],
    },
    {
      id: 'platform_agreement',
      number: 2,
      lines: ['Platform', 'Agreement'],
    },
    {
      id: 'deed_of_hypo',
      number: 3,
      lines: ['Deed of', 'Hypothecation'],
    },
  ];

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const goNext = (current, next) => {
    updateStepPercent(current, 100);

    if (next) {
      setActiveStepId(next);
    } else {
      setShowESign(true);
    }
  };

  const renderStep = () => {
    switch (activeStepId) {
      case 'sanction_letter':
        return (
          <SanctionLetter
            document={documents[1]} // ✅ sequenceOrder = 1
            onNext={() => goNext('sanction_letter', 'platform_agreement')}
          />
        );

      case 'platform_agreement':
        return (
          <PlatformAgreement
            document={documents[2]} // ✅ sequenceOrder = 2
            onNext={() => goNext('platform_agreement', 'deed_of_hypo')}
          />
        );

      case 'deed_of_hypo':
        return (
          <DeedOfHypo
            document={documents[3]} // ✅ sequenceOrder = 3
            onNext={() => goNext('deed_of_hypo', null)}
          />
        );

      default:
        return null;
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

      <Stack sx={{ mt: 3 }}>{renderStep()}</Stack>
    </Box>
  );
}
