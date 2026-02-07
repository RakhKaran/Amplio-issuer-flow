import { useState } from 'react';
import SanctionLetter from './documents-letter/sanction-letter';
import PlatformAgreement from './documents-letter/platform-agreement';
import DeedOfHypo from './documents-letter/deed-of-hypo';
import { useGetAgreements } from 'src/api/agreement';
import ESignVerify from './e-sign/verify-e-sign';
import axiosInstance from 'src/utils/axios';

export default function DocumentFlow() {
  // const [step, setStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showESign, setShowESign] = useState(false);

  const { agreements, agreementsLoading } = useGetAgreements();
  console.log('agreement', agreements);

  if (showESign) {
    return <ESignVerify />;
  }
  const sortedDocs = [...agreements].sort(
    (a, b) => a.businessKycDocumentType.sequenceOrder - b.businessKycDocumentType.sequenceOrder
  );

  if (agreementsLoading) return <>Loading...</>;

  const currentDoc = sortedDocs[currentIndex];

  if (!currentDoc) return <>All documents completed ✅</>;

  const DOCUMENT_COMPONENTS = {
    'Sanction Letter': SanctionLetter,
    'Platform Agreement': PlatformAgreement,
    'Deed of hypothecation': DeedOfHypo,
  };

  const componentKey = currentDoc.businessKycDocumentType.name.trim();
  const ActiveComponent = DOCUMENT_COMPONENTS[componentKey];
  if (!ActiveComponent) {
    return <>Unsupported document type</>;
  }

  const handleNext = () => {
    const isLastDoc = currentIndex === sortedDocs.length - 1;

    if (!isLastDoc) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setShowESign(true);
  };

  return (
    // <>
    //   {step === 1 && <SanctionLetter document={sanctionDoc} onNext={() => setStep(2)} />}

    //   {step === 2 && <PlatformAgreement document={agreementDoc} onNext={() => setStep(3)} />}

    //   {step === 3 && (
    //     <DeedOfHypo document={deedOfHypo} onNext={() => console.log('Go to E-sign')} />
    //   )}
    // </>
    <ActiveComponent
      document={{
        title: currentDoc.businessKycDocumentType.name,
        subtitle: currentDoc.businessKycDocumentType.description,
        pdfUrl: currentDoc.media?.fileUrl,
      }}
      onNext={handleNext}
    />
  );
}
