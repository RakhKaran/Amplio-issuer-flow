import { Helmet } from 'react-helmet-async';
import BondIssuePage from 'src/sections/bondEstimations/view/bond-isue-page';
// sections

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      <BondIssuePage/>
    </>
  );
}
