import { lazy, Suspense } from 'react';


const KYCVerificationPage = lazy(() => import('src/pages/business-kyc/verify'));

export const publicKycRoutes = [
    {
        path: '/kyc/invoiceFinancing/verify',
        element: (
            <Suspense fallback={null}>
                <KYCVerificationPage />
            </Suspense>
        ),
    },
];
