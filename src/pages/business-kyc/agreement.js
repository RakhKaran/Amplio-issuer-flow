import { Helmet } from 'react-helmet-async';
import DocumentFlow from 'src/sections/business-kyc/verify-documents/document-flow';

export default function AgreementsPage() {
  return (
    <>
      <Helmet>
        <title> Agreements </title>
      </Helmet>

      <DocumentFlow />
    </>
  );
}
