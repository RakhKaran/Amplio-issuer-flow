import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard, KycGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import KycLayout from 'src/layouts/kyc';

// const KycHomePage = lazy(() => import('src/pages/kyc/dashboard'));
// const InvoiceFinancingInitPage = lazy(() => import('src/pages/kyc/invoice-financing/initialize'));
// const InvoiceFinancingCreatePage = lazy(() => import('src/pages/kyc/invoice-financing/create'));
// const InvoiceFinancingPendingPage = lazy(() => import('src/pages/kyc/invoice-financing/pending'));
// const InvoiceFinancingSuccessPage = lazy(() => import('src/pages/kyc/invoice-financing/success'));
const InitialPage = lazy(() => import('src/pages/business-kyc/show'));
const BusinessKycPage = lazy(() => import('src/pages/business-kyc/kyc'));
const KYCPendingPage = lazy(()=>import('src/pages/business-kyc/pending'))

export const kycRoutes = [
  {
    path: 'kyc',
    element: (
      <AuthGuard>
        <KycGuard>
          <KycLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </KycLayout>
        </KycGuard>
      </AuthGuard>
    ),
    children: [
      { element: <InitialPage />, index: true },

      {
        path: 'invoiceFinancing',
        children: [
          { path: 'initialize', element: <InitialPage /> },
          { path: 'create', element: <BusinessKycPage /> },
          {path: 'pending', element:<KYCPendingPage/>}
        ],
      },
    ],
  },
];
