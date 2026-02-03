import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';

export default function GuarantorExecution() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    axiosInstance
      .get('/business-kyc/guarantor/verify', {
        params: { token },
      })
      .then((res) => {
        setData(res.data.data ?? null);
      })
      .catch((err) => {
        setError(
          err?.data?.error?.message ??
          'Verification link expired or invalid'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  console.log('data', data)

  return (
    
    <Container >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Guarantor Execution
      </Typography>



      {!loading && !error && !data && (
        <Paper
          elevation={0}
          sx={{
            p: 4,

            textAlign: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            No guarantor execution data found
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The execution document is not available at the moment.
          </Typography>
        </Paper>
      )}

      {!loading && data && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: '#F4F8FF',
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
              Guarantor Details
            </Typography>

            <Typography variant="body1" fontWeight={500}>
              Guarantor Name: {data.guarantorName}
            </Typography>

            <Typography variant="body2">
              CIN: {data.cin}
            </Typography>
          </Paper>

          <Card sx={{ height: '75vh', mb: 4 }}>
            <Box
              component="iframe"
              src={data.documentUrl}
              width="100%"
              height="100%"
              sx={{ border: 'none' }}
            />
          </Card>

          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{ px: 4, borderRadius: 2 }}
              // onClick={() => navigate('/kyc/e-sign')}
            >
              Continue to E-Sign
            </Button>
          </Stack>
        </>
      )}
    </Container>
  );
}
