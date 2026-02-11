import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------
export default function KycCompletionGuard({ children }) {
  const router = useRouter();
  const { authenticated, user } = useAuthContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authenticated || !user) {
      setChecked(true);
      return;
    }

    if (!user.isBusinessKycComplete) {
      router.replace(paths.kyc.invoiceFinancing.initialize);
      return;
    }

    setChecked(true);
  }, [authenticated, user, router]);

  if (!checked) return null;

  return <>{children}</>;
}

KycCompletionGuard.propTypes = {
  children: PropTypes.node,
};
