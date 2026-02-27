import { Helmet } from 'react-helmet-async';
import GuarantorExecutionSuccess from 'src/sections/business-kyc/guarantor/guarantor-execution-success';

// ----------------------------------------------------------------------

export default function GuarantorExecutionSuccessPage() {
  return (
    <>
      <Helmet>
        <title> KYC Verify</title>
      </Helmet>

      <GuarantorExecutionSuccess />
    </>
  );
}
