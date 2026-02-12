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
import { Divider } from '@mui/material';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  border: '2px solid #E17100',
  paddingRight: theme.spacing(2),
  borderRadius: '24px',
  '& .icon-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#FFF8E6',
    '& svg': {
      width: 24,
      height: 24,
      color: '#E17100',
    },
  },
  '& .status-text': {
    color: '#E17100',
    fontWeight: 500,
    fontSize: '1.0rem',
  },
}));

export default function BusinessKycPending() {
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
          backgroundColor: '#FFFBEB',
        }}
      >
        <MotionContainer>
          <m.div variants={varFade().inUp}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Status Timeline
            </Typography>

            <Grid container mb={3} alignItems="center">
              <Grid item xs>
                <Stack alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#0B63F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Icon icon="mdi:check" width={16} />
                  </Box>
                  <Typography variant="caption">Submitted</Typography>
                </Stack>
              </Grid>

              <Grid item xs>
                <Box sx={{ height: 2, backgroundColor: '#0B63F6' }} />
              </Grid>
              <Grid item xs>
                <Stack alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '2px solid #E17100',
                      backgroundColor: '#FFF8E6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E17100',
                    }}
                  >
                    <Icon icon="mdi:clock-time-four-outline" width={16} />
                  </Box>
                  <Typography variant="caption">Under Review</Typography>
                </Stack>
              </Grid>

              <Grid item xs>
                <Box sx={{ height: 2, backgroundColor: '#0B63F6' }} />
              </Grid>

              <Grid item xs>
                <Stack alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '2px solid #E0E0E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9E9E9E',
                    }}
                  >
                    <Icon icon="mdi:check-circle-outline" width={16} />
                  </Box>
                  <Typography variant="caption" align="center">
                    Approved by Birbalplus
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </m.div>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <m.div variants={varFade().inUp}>
              <Box
                component="img"
                src="\assets\images\kyc\kyc-pending.svg"
                alt="KYC Success"
                sx={{
                  width: 520,
                  display: 'block',
                  mx: 'auto',
                  mb: 3,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <StyledIcon>
                  <div className="icon-container">
                    <Icon icon="mdi:clock-time-four-outline" width="100%" height="100%" />
                  </div>
                  <div className="status-text">Under Review</div>
                </StyledIcon>
              </div>
            </m.div>
          </Box>

          <m.div variants={varFade().inUp}>
            <Typography variant="h6" sx={{ mb: 1, color: '#000' }}>
              We are reviewing your application and will notify you once the review is completed.
              <br />
              Expected review time:
              <Box component="span" sx={{ pl: 0.2, color: 'error.main' }}>
                24 – 48 business hours
              </Box>
            </Typography>
          </m.div>
          {/* <m.div variants={varFade().inUp}>
            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
          </m.div> */}
        </MotionContainer>
      </Box>
    </Container>
  );
}
