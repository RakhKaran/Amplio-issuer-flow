import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSignatorie } from 'src/api/signatories';


import { useGetBankDetail } from 'src/api/bank-details';
// import BankDetialsViewForm from '../bank-detials-view-form';
import BankNewForm from '../company-bank-account-new-edit-form';
//



// ----------------------------------------------------------------------

export default function BankDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { bankDetail , refreshBankDetail } = useGetBankDetail(id);
  console.log(bankDetail);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Details', href: paths.dashboard.company.profile },
          {
            name: bankDetail?.bankName || ''

          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BankNewForm refreshBankDetail={refreshBankDetail} bankDetails={bankDetail} />
    </Container>
  );
}
