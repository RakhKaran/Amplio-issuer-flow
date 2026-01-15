import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import KycLayout from 'src/layouts/kyc';

// const KycHomePage = lazy(() => import('src/pages/kyc/dashboard'));
// const InvoiceFinancingInitPage = lazy(() => import('src/pages/kyc/invoice-financing/initialize'));
// const InvoiceFinancingCreatePage = lazy(() => import('src/pages/kyc/invoice-financing/create'));
// const InvoiceFinancingPendingPage = lazy(() => import('src/pages/kyc/invoice-financing/pending'));
// const InvoiceFinancingSuccessPage = lazy(() => import('src/pages/kyc/invoice-financing/success'));

export const kycRoutes = [
  {
    path: 'kyc',
    element: (
      <AuthGuard>
        <KycLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </KycLayout>
      </AuthGuard>
    ),
    children: [
    //   { index: true, element: <KycHomePage /> },

      {
        path: 'invoice-financing',
        children: [
        //   { path: 'initialize', element: <InvoiceFinancingInitPage /> },
        //   { path: 'create', element: <InvoiceFinancingCreatePage /> },
        //   { path: 'pending', element: <InvoiceFinancingPendingPage /> },
        //   { path: 'success', element: <InvoiceFinancingSuccessPage /> },
        ],
      },
    ],
  },
];
