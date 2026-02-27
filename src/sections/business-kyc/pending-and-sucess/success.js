import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: '0 auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: 100,
  height: 100,
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  //   border: `solid 2px ${theme.palette.success.main}`,
  '& svg': {
    width: 60,
    height: 60,
    color: theme.palette.success.main,
  },
}));

export default function Sucessfull() {
  return (
    <Container maxWidth="md" sx={{ position: 'relative', py: { xs: 2, sm: 4, md: 5 } }}>
           <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 1200,
          mx: 'auto',
          p: { xs: 3, sm: 5 },
          borderRadius: 2,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          boxShadow: '0px 0px 10.8px 0px #0000005E',
          backgroundColor: 'background.paper',
        }}
      >
        <MotionContainer>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <m.div variants={varFade().inUp}>
              <Box
                component="img"
                src="\assets\images\business-kyc\success.png"
                alt="KYC Success"
                sx={{
                  width: 520,
                  height: 320,
                  mb: 3,
                  display: 'block',
                  mx: 'auto',
                }}
              />
              {/* <StyledIcon>
                <Icon icon="mdi:check-circle" width="100%" height="100%" />
              </StyledIcon> */}
            </m.div>
          </Box>

          <m.div variants={varFade().inUp}>
            <Typography variant="h5" sx={{ mb: 1, color: '#FFAB00' }}>
              Congratulations!
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
              Your Funding Limit is Now Active
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 4 }}>
              Your seller account has been successfully approved. You can now start discounting
              invoices and accessing funds through Birblaplus{' '}
            </Typography>
          </m.div>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <m.div variants={varFade().inUp}>
              <Button
                component={RouterLink}
                href={paths.dashboard.root}
                size="large"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 20, px: 5 }}
              >
                Continue
              </Button>
            </m.div>
          </Box>
        </MotionContainer>
      </Box>
    </Container>
  );
}
