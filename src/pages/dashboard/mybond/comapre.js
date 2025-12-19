import { Helmet } from 'react-helmet-async';
// sections
import CompareIntermediaryView from 'src/sections/mybond/intermediates/compare-intermediates';

// ----------------------------------------------------------------------

export default function IntermediateComparePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Comapre Trustee</title>
      </Helmet>

      <CompareIntermediaryView />
    </>
  );
}
