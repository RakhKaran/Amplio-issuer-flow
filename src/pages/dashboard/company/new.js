import { Helmet } from 'react-helmet-async';
import BankNewForm from 'src/sections/company-account/company-bank-account-new-edit-form';
// sections
import { CompanyAccountView } from 'src/sections/company-account/view';


// ----------------------------------------------------------------------

export default function NewBankPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      {/* <UserProfileView /> */}
     <BankNewForm/>
    </>
  );
}
