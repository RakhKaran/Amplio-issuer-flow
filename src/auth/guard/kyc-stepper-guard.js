import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { KYC_STAGE_ROUTE_MAP } from 'src/utils/kyc-stage-route-map';

export default function KYCStepperGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const resolveKycFlow = async () => {
      try {
        const res = await axiosInstance.get('/business-kyc/state');
        const state = res.data?.data;

        /* ---------------- 1️⃣ No KYC exists ---------------- */
        if (!state?.businessKycId) {
          router.replace(paths.kyc.invoiceFinancing.initialize);
          return;
        }

        /* ---------------- 2️⃣ Fully completed ---------------- */
        if (state.isBusinessKycComplete === true) {
          router.replace(paths.dashboard.root);
          return;
        }

        /* ---------------- 3️⃣ Determine stage ---------------- */
        let stage = state.currentStage;

        const targetRoute = KYC_STAGE_ROUTE_MAP[stage];

        if (targetRoute) {
          setChecked(true);
          router.replace(targetRoute);
          return;
        }

        setChecked(true);
      } catch (error) {
        // Fail-safe: never deadlock user
        setChecked(true);
      }
    };

    resolveKycFlow();
  }, [router]);

  if (!checked) return null;

  return <>{children}</>;
}
