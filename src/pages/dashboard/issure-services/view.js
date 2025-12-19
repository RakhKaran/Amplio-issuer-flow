import { Helmet } from 'react-helmet-async';
// sections
import BondIssuePage from 'src/sections/bondEstimations/view/bond-isue-page';

// ----------------------------------------------------------------------

export default function AfterCompleteRoiStagePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Complete</title>
      </Helmet>

      {/* <PreliminaryBondRequirements /> */}
      <BondIssuePage />
    </>
  );
}
