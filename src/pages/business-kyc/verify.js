import { Helmet } from 'react-helmet-async';
import GaurantorExecution from 'src/sections/business-kyc/guarantor/guarantor-execution';

// ----------------------------------------------------------------------

export default function KYCVerificationPage() {
  return (
    <>
      <Helmet>
        <title> KYC Verify</title>
      </Helmet>

      <GaurantorExecution />
    </>
  );
}
