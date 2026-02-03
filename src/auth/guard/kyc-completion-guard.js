import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// export default function KycCompletionGuard({ children }) {
//   const router = useRouter();

//   const { authenticated, user } = useAuthContext();
//   console.log('user', user);

//   const [checked, setChecked] = useState(false);

//   const check = useCallback(() => {
//     if (!authenticated || !user) {
//       // If not authenticated, let AuthGuard handle it
//       setChecked(true);
//       return;
//     }

//     console.log('check', checked);

//     // Check if KYC is complete
//     const isKycComplete = user.isBusinessKycComplete;

//     if (!isKycComplete) {
//       // Redirect to KYC flow if not complete
//       const kycPath = paths.kyc.invoiceFinancing.initialize;
//       router.replace(kycPath);
//     }
//   }, [authenticated, user, router]);

//   useEffect(() => {
//     check();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authenticated, user]);

//   if (checked) {
//     return null;
//   }
//   console.log('check', checked);
//   return <>{children}</>;
// }
// src/auth/guard/KycCompletionGuard.js
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
