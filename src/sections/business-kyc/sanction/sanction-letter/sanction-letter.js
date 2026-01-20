import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function SanctionLetter({ data }) {
  const methods = useForm({
    defaultValues: {
      remark: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (formData) => {
    console.log('Remarks:', formData);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" color="primary">
            Sanction Letter Preview
          </Typography>
        </Box>
        <Card sx={{ p: 4, mt: 2 }}>
          <Grid container>
            <Grid item xs={6} md={6}>
              <Box
                src="images/business-kyc/sanction-letter.png"
                component="img"
                sx={{ width: '32px' }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Stack direction="column" alignItems="flex-end">
                <Typography variant="h5">
                  {data?.letterContent || 'PRIVATE & CONFIDENTIAL'}
                </Typography>
                <Typography variant="body1">Ref: {data?.ref || 'NBFC/SL/2023/98234'}</Typography>
                <Typography variant="body1">Date: {data?.date || 'October 24, 2023'}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="h3"
                textAlign="center"
                sx={{ fontWeight: 700, textDecoration: 'underline', my: 3 }}
              >
                SANCTION LETTER
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pb: 3 }}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="body1">To,</Typography>
                <Typography variant="h4">
                  {data?.companyName || 'ABC Enterprises Pvt Ltd'}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 320, pb: 2 }}>
                  {data?.address || '123, Industial Estate, Sector 15 Gurugram, Harayana - 122001'}
                </Typography>
                <Typography variant="body1">Dear Sir/Madam,</Typography>
                <Typography variant="body1">
                  {data?.description ||
                    'With reference to your application for invoice Discounting facility, we are pleasaed to inform you that we have sanctioned a credit limit as per the term and conditions outlined below:'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pb: 3 }}>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}
              >
                <Table>
                  <TableBody>
                    {/* Facility Type */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          width: '35%',
                          backgroundColor: '#f9fafb',
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        Facility Type
                      </TableCell>
                      <TableCell>
                        {data?.facilityType || 'Invoice Discounting / Factoring'}
                      </TableCell>
                    </TableRow>

                    {/* Sanctioned Limit */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: '#f9fafb',
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        Sanctioned Limit
                      </TableCell>
                      <TableCell>
                        {data?.sanctionedLimit || 'INR 5,00,00,000/- (Five Crores Only)'}
                      </TableCell>
                    </TableRow>

                    {/* Tenor */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: '#f9fafb',
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        Tenor
                      </TableCell>
                      <TableCell>{data?.tenor || '90 Days Per Invoice'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={12}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h4">Security & Collateral:</Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {(data?.securityCollateral?.length
                    ? data.securityCollateral
                    : [
                        'Hypothecation of book debts and receivables.',
                        'Personal guarantee of all directors.',
                      ]
                  ).map((item, index) => (
                    <Box component="li" key={index} sx={{ mb: 0.5 }}>
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5"> Request Changes / Remarks</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column">
              <RHFTextField
                name="remark"
                label="Remark"
                placeholder="Remark (optional) the changes you want in the section letter (limit, company, details, terms, etc.)"
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Maximum 500 characters
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                sx={{
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
                }}
              >
                Submit Remarks
              </Button>

              <Button variant="contained" color="primary">
                Proceed to E-Sign
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
