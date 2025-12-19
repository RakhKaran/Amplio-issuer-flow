// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetScheduler } from 'src/api/scheduler';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SchedulerNewEditForm from '../signatories-new-edit-form';
import { useGetSignatorie } from 'src/api/signatories';
import SignatoriesNewEditForm from '../signatories-new-edit-form';


//


// ----------------------------------------------------------------------

export default function SignatoriesEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const {signatorie: currentSignatoy}= useGetSignatorie(id);

 console.log('currentScheduler', currentSignatoy)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Signatories',
            href: paths.dashboard.signatories.root,
          },
          {
            name: currentSignatoy?.fullName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SignatoriesNewEditForm currentUser={currentSignatoy} />
    </Container>
  );
}
