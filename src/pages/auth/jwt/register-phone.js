import { Helmet } from 'react-helmet-async';
// sections
import { JwtRegisterView } from 'src/sections/auth/jwt';
import JwtRegisterCompanyByMobileView from 'src/sections/auth/jwt/jwt-register-phone-company-view';

// ----------------------------------------------------------------------

export default function RegisterPhonePage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterCompanyByMobileView />
    </>
  );
}
