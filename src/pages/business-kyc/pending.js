import { Helmet } from 'react-helmet-async';
import BusinessKycPending from 'src/sections/business-kyc/business-kyc-pending';

// ----------------------------------------------------------------------

export default function KYCPendingPage() {
  return (
    <>
      <Helmet>
        <title> KYC pending</title>
      </Helmet>

      <BusinessKycPending />
    </>
  );
}
