import { Helmet } from 'react-helmet-async';
// sections
import { KYCView } from 'src/sections/kyc/view';

// ----------------------------------------------------------------------

export default function CompanyKycPage() {
  return (
    <>
      <Helmet>
        <title> Company: KYC</title>
      </Helmet>

      <KYCView />
    </>
  );
}
