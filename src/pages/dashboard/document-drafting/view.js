import { Helmet } from 'react-helmet-async';
import { DocumentEditView } from 'src/sections/document/view';
// sections

import { JobsDetailsView } from 'src/sections/jobList/view';
import TrusteeSelection from 'src/sections/trustee/view/trustee-list-view';

// ----------------------------------------------------------------------

export default function DocumentDraftingViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Document Drafting View</title>
      </Helmet>

      <DocumentEditView />
    </>
  );
}
