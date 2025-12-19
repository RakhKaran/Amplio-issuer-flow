import { Helmet } from 'react-helmet-async';
// sections
import KycAddressInfo from 'src/sections/kyc/kyc-address-info';

// ----------------------------------------------------------------------

export default function KycAddressInfoPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: KYC</title>
      </Helmet>

      <KycAddressInfo />
    </>
  );
}
