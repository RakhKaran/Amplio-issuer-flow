import { paths } from "src/routes/paths";

export const KYC_STAGE_ROUTE_MAP = {
  // Stepper flow
  KYC_STEPPER: paths.kyc.invoiceFinancing.create,

  // Post-stepper flows
  AGREEMENTS: paths.kyc.invoiceFinancing.agreements,
  ROC: paths.kyc.invoiceFinancing.roc,

  // Final states
  PENDING: paths.kyc.invoiceFinancing.pending,
  COMPLETED: paths.dashboard.root,
};
