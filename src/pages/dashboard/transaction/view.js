import { Helmet } from 'react-helmet-async';
// sections
import TransactionView from 'src/sections/transaction/transaction-view';

// ----------------------------------------------------------------------

export default function TransactionViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: transaction view</title>
      </Helmet>

      <TransactionView />
    </>
  );
}
