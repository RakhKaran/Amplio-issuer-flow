import { useState } from 'react';
import SanctionLetter from './documents-letter/sanction-letter';
import PlatformAgreement from './documents-letter/platform-agreement';
import DeedOfHypo from './documents-letter/deed-of-hypo';

export default function DocumentFlow() {
  const [step, setStep] = useState(1);

  const sanctionDoc = {
    title: 'Sanction Letter',
    pdfUrl: '/assets/agreementdocument/Guarantor_Execution_Dummy.pdf',
  };

  const agreementDoc = {
    title: 'Platform Agreement',
    pdfUrl: '/assets/agreementdocument/Guarantor_Execution_Dummy.pdf',
  };

  const deedOfHypo = {
    title: 'Platform Agreement',
    pdfUrl: '/assets/agreementdocument/Guarantor_Execution_Dummy.pdf',
  };
  return (
    <>
      {step === 1 && <SanctionLetter data={sanctionDoc} onNext={() => setStep(2)} />}

      {step === 2 && <PlatformAgreement document={agreementDoc} onNext={() => setStep(3)} />}

      {step === 3 && (
        <DeedOfHypo document={deedOfHypo} onNext={() => console.log('Go to E-sign')} />
      )}
    </>
  );
}
