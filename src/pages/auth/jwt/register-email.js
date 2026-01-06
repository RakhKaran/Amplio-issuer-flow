import { Helmet } from 'react-helmet-async';
// sections
import JwtRegisterCompanyByEmailView from 'src/sections/auth/jwt/jwt-register-email-company-view';

// ----------------------------------------------------------------------

export default function RegisterEmailPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterCompanyByEmailView />
    </>
  );
}
