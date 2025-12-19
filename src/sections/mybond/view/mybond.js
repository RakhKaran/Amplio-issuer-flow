import MainFile from '../borrowing/main';
import FinancialDetails from '../financial-details';
import IsinActivation from '../isin-activation';
import LaunchIssue from '../launch-issue';
import MyBondNewIssue from '../mybond-new-issue';
import MyBondStar from '../mybond-start';
import PreliminaryBondRequirements from '../preliminary-bond-requirements';
import RegulatoryFiling from '../regulatory-filing';
// ----------------------------------------------------------------------

export default function MyBondCreate() {
  return (
    <>
      <MyBondStar />
      {/* <MyBondNewIssue  /> */}
      {/* <FundPositionForm /> */}
      {/* <AuditedFinancial /> */}
      {/* <MainFile /> */}
      {/* <FinancialDetails /> */}
      {/* <PreliminaryBondRequirements /> */}
      {/* <RegulatoryFiling /> */}
      {/* <IsinActivation /> */}
      {/* <LaunchIssue /> */}
    </>
  );
}
