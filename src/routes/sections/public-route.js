import { lazy, Suspense } from 'react';


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
];
