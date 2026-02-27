import { Helmet } from 'react-helmet-async';
import GuarantorESignVerify from 'src/sections/business-kyc/guarantor/guarantor-verify-e-sign';

// ----------------------------------------------------------------------

export default function GuarantorEsignPage() {
  return (
    <>
      <Helmet>
        <title> KYC Verify</title>
      </Helmet>

      <GuarantorESignVerify />
    </>
  );
}
