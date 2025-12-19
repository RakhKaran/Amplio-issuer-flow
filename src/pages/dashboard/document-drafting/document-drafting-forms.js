import { Helmet } from 'react-helmet-async';
import BasicFinancialDetails from 'src/sections/document-drafting/basic-financial-details';
import ExecuteDocument from 'src/sections/document-drafting/execute-document';
import DocumentDraftingStepper from 'src/sections/document-drafting/view/document-drafting-stepper';



// ----------------------------------------------------------------------

export default function DocumentDraftingFormPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Document Drafting</title>
      </Helmet>

      {/* <DocumentDraftingStepper /> */}
      {/* <ExecuteDocument/> */}
      <BasicFinancialDetails/>
    </>
  );
}
