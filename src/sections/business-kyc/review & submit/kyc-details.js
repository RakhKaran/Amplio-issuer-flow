import { Card, Typography, Grid, Box, IconButton, Chip, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetCompanyBankDetails, useGetCompanyProfiles } from 'src/api/companyProfile';
import { AuthContext } from 'src/auth/context/jwt';
import Iconify from 'src/components/iconify';

const businessProfile = [
  { label: 'Years in business :', value: '7' },
  { label: 'FY24 Turnover (Audited) :', value: '₹120 Cr' },
  { label: 'FY25 Projected Turnover :', value: '₹150 Cr' },
  { label: 'EBITDA Margin :', value: '18%' },
];

const financialDocuments = [
  {
    label: 'Registered Address',
    value: 'Silver Arc Building link road Pune Maharashtra 411045  ',
  },

  {
    label: 'Correspondence Address',
    value: 'Silver Arc Building link road Pune Maharashtra 411045  ',
  },
];

export default function KycDetailsPage() {
  const [data, setData] = useState();
  const [bankData, setBankdata] = useState();

  const { CompanyProfiles, CompanyProfilesLoading } = useGetCompanyProfiles();

  console.log('CompanyProfiles', CompanyProfiles);

  useEffect(() => {
    if (CompanyProfiles && !CompanyProfilesLoading) {
      setData(CompanyProfiles);
    }
  }, [CompanyProfiles, CompanyProfilesLoading]);

  const { BankDetails, BankDetailsLoading } = useGetCompanyBankDetails();
  useEffect(() => {
    if (BankDetails && !BankDetailsLoading) {
      setBankdata(BankDetails[0]);
    }
  }, [BankDetails, BankDetailsLoading]);

  return (
    <>
      <Box mb={2} mt={2} display="flex" justifyContent="center">
        <Typography variant="h5" color="primary">
          KYC Details
        </Typography>
      </Box>

      <Grid container spacing={2} columns={12} sx={{ maxWidth: '900px', mx: 'auto', mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Grid spacing={2} container alignItems="center" justifyContent="space-between">
              <Grid item xs={8} md={10}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Company information
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: 'right' }} item xs={4} md={2}>
                <Tooltip title="View">
                  <IconButton size="small">
                    <Iconify icon="solar:eye-bold" />
                  </IconButton>
                </Tooltip>
              </Grid>
              {data && (
                <>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      Company Name :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {data.companyName}
                    </Typography>
                  </Grid>

                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      CIN :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Tooltip title={data.CIN} arrow placement="top">
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{ cursor: 'pointer', maxWidth: 140 }}
                      >
                        {data.CIN}
                      </Typography>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      GSTIN :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {data.GSTIN}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      Place of Incorporation :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {data.cityOfIncorporation}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      PAN Number :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {data?.companyPanCards?.submittedPanNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      PAN Holder Name :
                    </Typography>
                  </Grid>

                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {data?.companyPanCards?.submittedCompanyName}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Card>
        </Grid>

        {/* Financial Documents */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Grid spacing={2} container alignItems="center" justifyContent="space-between">
              <Grid item xs={8} md={10}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Address Information
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: 'right' }} item xs={4} md={2}>
                <Tooltip title="View">
                  <IconButton size="small">
                    <Iconify icon="solar:eye-bold" />
                  </IconButton>
                </Tooltip>
              </Grid>

              {financialDocuments.map((item, index) => (
                <>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label} :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.value}
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Grid spacing={2} container alignItems="center" justifyContent="space-between">
              <Grid item xs={8} md={10}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Bank Details
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: 'right' }} item xs={4} md={2}>
                <Tooltip title="View">
                  <IconButton size="small">
                    <Iconify icon="solar:eye-bold" />
                  </IconButton>
                </Tooltip>
              </Grid>


              {bankData ? (
                <>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      Bank Name :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {bankData.bankName}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      Account Number :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {bankData.accountNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      IFSC Code :
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography variant="body2" fontWeight={500}>
                      {bankData.ifscCode}
                    </Typography>
                  </Grid>
                </>
              ):(
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 2 }}
                >
                  No records found
                </Typography>
              </Grid>
      )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
