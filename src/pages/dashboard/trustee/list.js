import { Helmet } from 'react-helmet-async';
// sections

import TrusteeSelection from 'src/sections/trustee/view/trustee-list-view';
import TrusteeDetailsView from 'src/sections/trustee/trustee-details';
import CompareTrusteeView from 'src/sections/trustee/compare-trustee';

// ----------------------------------------------------------------------

export default function TrusteeListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trustee List</title>
      </Helmet>

      <TrusteeSelection />
      {/* <TrusteeDetailsView/> */}
      {/* <CompareTrusteeView/> */}
    </>
  );
}
