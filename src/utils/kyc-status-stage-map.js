import { KYC_STAGE_ROUTE_MAP } from "./kyc-stage-route-map";

export const KYC_STATUS_STAGE_MAP = {

  // Stepper statuses
  business_profile: KYC_STAGE_ROUTE_MAP.KYC_STEPPER,
  guarantor_details: KYC_STAGE_ROUTE_MAP.KYC_STEPPER,
  review_and_submit: KYC_STAGE_ROUTE_MAP.KYC_STEPPER,

  // Post-stepper
  agreement: KYC_STAGE_ROUTE_MAP.AGREEMENTS,
  roc: KYC_STAGE_ROUTE_MAP.ROC,
  dpn: KYC_STAGE_ROUTE_MAP.DPN,

  // Final
  pending: KYC_STAGE_ROUTE_MAP.PENDING,
  completed: KYC_STAGE_ROUTE_MAP.COMPLETED,
};
