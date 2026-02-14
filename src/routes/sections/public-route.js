import { lazy, Suspense } from 'react';
import GuarantorExecutionSuccessPage from 'src/pages/business-kyc/guarantor-execution-success';


const KYCVerificationPage = lazy(() => import('src/pages/business-kyc/verify'));
const GuarantorEsignPage = lazy(()=> import('src/pages/business-kyc/guarantor-esign'))

export const publicKycRoutes = [
    {
        path: '/kyc/invoiceFinancing/verify',
        element: (
            <Suspense fallback={null}>
                <KYCVerificationPage />
            </Suspense>
        ),
    },
       {
        path: '/kyc/invoiceFinancing/esign',
        element: (
            <Suspense fallback={null}>
                <GuarantorEsignPage />
            </Suspense>
        ),
    },

    {
        path: '/kyc/invoiceFinancing/execution-success',
        element: (
            <Suspense fallback={null}>
                <GuarantorExecutionSuccessPage />
            </Suspense>
        ),
    },
];
