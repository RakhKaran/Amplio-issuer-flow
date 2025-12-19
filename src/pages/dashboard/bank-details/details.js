import { Helmet } from 'react-helmet-async';
import BankDetailsView from 'src/sections/company-account/view/bank-details-view';



// sections



// ----------------------------------------------------------------------

export default function BankDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Bank Details</title>
      </Helmet>

      <BankDetailsView />
    </>
  );
}
