import { Helmet } from 'react-helmet-async';
import { Initial } from 'src/sections/business-kyc/business-kyc-start';
import BusinessProfileMain from 'src/sections/business-kyc/business-profile/business-profile-main';
import Stepper from 'src/sections/business-kyc/stepper';
// sections
// ----------------------------------------------------------------------

export default function BusinessKycPage() {
  return (
    <>
      <Helmet>
        <title> Post: List</title>
      </Helmet>

      <Stepper />
      {/* <BusinessProfileMain /> */}
    </>
  );
}
