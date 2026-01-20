import { useState, useRef, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Stack, Button, Alert, Box } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import AgreementSuccessDialog from '../success/agreement-success';

export default function ESignVerify() {
  const { enqueueSnackbar } = useSnackbar();

  const OTP_LENGTH = 4;

  const RESEND_TIME = 30;

  const [timer, setTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // const handleVerify = async () => {
  //   const enteredOtp = otp.join('');

  //   if (enteredOtp.length !== OTP_LENGTH) {
  //     setErrorMsg(`Enter all ${OTP_LENGTH} digits`);
  //     return;
  //   }

  //   setErrorMsg('');
  //   setVerifying(true);

  //   try {
  //     await axiosInstance.post('/auth/verify-esign-otp', {
  //       otp: enteredOtp,
  //     });

  //     enqueueSnackbar('OTP verified successfully', { variant: 'success' });

  //     // TODO: Proceed with E-sign flow here
  //     setOpenSuccessDialog(true);
  //   } catch (err) {
  //     enqueueSnackbar(err?.response?.data?.message || 'Invalid OTP', { variant: 'error' });
  //   } finally {
  //     setVerifying(false);
  //   }
  // };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== OTP_LENGTH) {
      setErrorMsg(`Enter all ${OTP_LENGTH} digits`);
      return;
    }

    setErrorMsg('');

    // 🔐 Hardcoded OTP check
    if (enteredOtp !== '1234') {
      enqueueSnackbar('Invalid OTP', { variant: 'error' });
      return;
    }

    // ✅ OTP is correct
    enqueueSnackbar('OTP verified successfully', { variant: 'success' });
    setOpenSuccessDialog(true);
  };

  const handleResendOtp = async () => {
    try {
      await axiosInstance.post('/auth/resend-esign-otp');

      enqueueSnackbar('OTP resent successfully', { variant: 'success' });

      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(RESEND_TIME);
      setCanResend(false);

      otpRefs.current[0]?.focus();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to resend OTP', { variant: 'error' });
    }
  };
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const renderOtpBoxes = (
    <Grid container spacing={2} justifyContent="center">
      {otp.map((digit, index) => (
        <Grid item xs={2} key={index}>
          <TextField
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            inputRef={(el) => (otpRefs.current[index] = el)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[index] && index > 0) {
                otpRefs.current[index - 1]?.focus();
              }
            }}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 600,
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" textAlign="center">
              Verify & Sign Agreement
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center">
              Enter the 4-digit code sent to your registered mobile number and email
            </Typography>
          </Grid>

          {errorMsg && (
            <Grid item xs={12}>
              <Alert severity="error">{errorMsg}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            {renderOtpBoxes}
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ maxWidth: 360, mx: 'auto' }}
            >
              <Typography variant="body2" color="text.secondary">
                Expect OTP in{' '}
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {timer} seconds
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  cursor: canResend ? 'pointer' : 'not-allowed',
                  color: canResend ? 'primary.main' : 'text.disabled',
                }}
                onClick={canResend ? handleResendOtp : undefined}
              >
                Resend OTP
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleVerify}
                disabled={verifying}
                sx={{
                  borderRadius: 10,
                  px: 6,
                  backgroundColor: '#fff',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: 'primary.dark',
                    borderColor: 'primary.dark',
                    boxShadow: 'none',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#fff',
                    color: 'text.disabled',
                    borderColor: 'text.disabled',
                  },
                }}
              >
                Verify & Proceed
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center">
              Your data is encrypted and secure
            </Typography>
          </Grid>
        </Grid>
        <AgreementSuccessDialog
          open={openSuccessDialog}
          onClose={() => setOpenSuccessDialog(false)}
        />
      </Container>
    </Box>
  );
}
