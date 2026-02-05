import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { LoadingScreen } from 'src/components/loading-screen';

export default function KycFlowGuard({ children }) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axiosInstance.get('/business-kyc/state');
        const state = res?.data?.data;

        /* ---------- NO KYC ---------- */
        if (!state?.businessKycId) {
          setChecking(false); // allow initialize page
          return;
        }

        /* ---------- APPROVED ---------- */
        if (state.isBusinessKycComplete) {
          router.replace(paths.dashboard.root);
          return;
        }

        /* ---------- PENDING ---------- */
        if (state.currentStage === 'PENDING') {
          setChecking(false);
          router.replace(paths.kyc.invoiceFinancing.pending);
          return;
        }

        /* ---------- AGREEMENTS ---------- */
        if (state.currentStage === 'AGREEMENTS') {
          setChecking(false);
          router.replace(paths.kyc.invoiceFinancing.agreements);
          return;
        }

        /* ---------- DEFAULT → STEPPER ---------- */
        router.replace(paths.kyc.invoiceFinancing.create);
        setChecking(false); // ⭐ UNLOCK UI
      } catch (err) {
        setChecking(false); // fail open
      }
    };

    check();
  }, [router]);

  // ⭐ NEVER return null in production
  if (checking) return <LoadingScreen />;

  return children;
}
