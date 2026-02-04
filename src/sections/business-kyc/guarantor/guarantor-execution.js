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
import GuarantorESignVerify from './guarantor-verify-e-sign';

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
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box width="100%" maxWidth={720}>
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Guarantor Execution
        </Typography>

        {/* NO DATA */}
        {!loading && !error && !data && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#F9FAFB',
              borderRadius: 2,
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

        {/* DATA FOUND */}
        {!loading && data && (
          <>
            {/* Guarantor Info */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#F4F8FF',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" color="primary">
                Guarantor Details
              </Typography>

              <Typography variant="body2" fontWeight={500}>
                {data.guarantorName}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                CIN: {data.cin}
              </Typography>
            </Paper>

            {/* Document Preview */}
            <Card
              sx={{
                height: 420,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                component="iframe"
                // src={data.documentUrl}
                src="/assets/Guarantor_Execution_Dummy.pdf"
                width="100%"
                height="100%"
                sx={{ border: 'none' }}
              />
            </Card>

            {/* CTA */}
            <Stack direction="row" justifyContent="center">
              <Button
                variant="contained"
                size="medium"
                sx={{ px: 4, borderRadius: 2 }}
                onClick={() =>
                  navigate(`/kyc/invoiceFinancing/esign?token=${params.get('token')}`)
                }
              >
                Continue to E-Sign
              </Button>

            </Stack>
          </>
        )}
      </Box>
    </Container>
  );

}
