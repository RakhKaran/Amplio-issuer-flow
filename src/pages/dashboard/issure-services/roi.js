import { Helmet } from 'react-helmet-async';
// sections
import { BondEstimationsInitialPageView } from 'src/sections/bondEstimations/view';

// ----------------------------------------------------------------------

export default function ROIGuidancePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company List</title>
      </Helmet>

      <BondEstimationsInitialPageView />
    </>
  );
}
