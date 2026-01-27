import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function KycGuard({ children }) {
  const router = useRouter();

  const { authenticated, user } = useAuthContext();
  console.log('user', user);

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated || !user) {
      // If not authenticated, let AuthGuard handle it
      setChecked(true);
      return;
    }

    console.log('check', checked);

    // Check if KYC is complete
    const isKycComplete = user.isBusinessKycComplete === false;

    if (!isKycComplete) {
      // Redirect to KYC flow if not complete
      const kycPath = paths.kyc.invoiceFinancing.initialize;
      router.replace(kycPath);
    }
  }, [authenticated, user, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user]);

  if (checked) {
    return null;
  }
  console.log('check', checked);
  return <>{children}</>;
}

KycGuard.propTypes = {
  children: PropTypes.node,
};
