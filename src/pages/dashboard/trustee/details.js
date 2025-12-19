import { Helmet } from 'react-helmet-async';
// sections

import { JobsDetailsView } from 'src/sections/jobList/view';
import TrusteeSelection from 'src/sections/trustee/view/trustee-list-view';

// ----------------------------------------------------------------------

export default function TrusteeDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trustee Details</title>
      </Helmet>

      <TrusteeSelection />
    </>
  );
}
