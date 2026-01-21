import { Helmet } from 'react-helmet-async';
import BusinessKycPending from 'src/sections/business-kyc/business-kyc-pending';

// ----------------------------------------------------------------------

export default function KYCPendingPage() {
  return (
    <>
      <Helmet>
        <title> Post: List</title>
      </Helmet>

      <BusinessKycPending />
    </>
  );
}
