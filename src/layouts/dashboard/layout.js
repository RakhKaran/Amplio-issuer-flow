import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import CompanyAccountChangePassword from 'src/sections/company-account/company-account-change-password';
//
import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;
  

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  const showFirstTimePasswordPopup =
    !!user?.isBusinessKycComplete &&
    (user?.isFirstTime ?? user?.mustChangePassword ?? false);

  const renderMandatoryPasswordDialog = (
    <Dialog
      open={showFirstTimePasswordPopup}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={() => {}}
    >
      <DialogTitle>Change Password Required</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          For security reasons, you must change your password before using the dashboard.
        </Typography>
        <CompanyAccountChangePassword />
      </DialogContent>
    </Dialog>
  );

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
        {renderMandatoryPasswordDialog}
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
        {renderMandatoryPasswordDialog}
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
      {renderMandatoryPasswordDialog}
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
