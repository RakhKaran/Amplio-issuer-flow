import { Helmet } from 'react-helmet-async';
// sections
import { BondIssueStepperView } from 'src/sections/mybond/view';
// ----------------------------------------------------------------------

export default function MyBondNewIssuePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Create</title>
      </Helmet>

      <BondIssueStepperView />
    </>
  );
}
