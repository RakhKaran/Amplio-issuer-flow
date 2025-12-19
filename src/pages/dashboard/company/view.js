import { Helmet } from 'react-helmet-async';

import BankDetailsView from 'src/sections/company-account/company-bank-cards';



// ----------------------------------------------------------------------

export default function BankViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      {/* <UserProfileView /> */}
     <BankDetailsView/>
    </>
  );
}
