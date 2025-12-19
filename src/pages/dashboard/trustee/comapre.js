import { Helmet } from 'react-helmet-async';
// sections

import CompareTrusteeView from 'src/sections/trustee/compare-trustee';

// ----------------------------------------------------------------------

export default function TrusteeComparePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Comapre Trustee</title>
      </Helmet>

      <CompareTrusteeView />
    </>
  );
}
