import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';

import { CircularProgress, Box, Button, Stack, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';
import BankDetailsCard from './company-bank-cards';
import { useRouter } from 'src/routes/hook';

export default function CompanyBankPage() {
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
const router = useRouter();
  const navigate = useNavigate();

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.bankDetails.details(id));
    },
    [router]
  );

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await axiosInstance.get(`/company-profiles/bank-details`);
      setBankData(res?.data?.bankDetails || null);
    } catch {
      setBankData(null);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Header + Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Company Bank Details
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(paths.dashboard.company.new)}
        >
          + Create Bank Details
        </Button>
      </Stack>

      {/* If no bank exists → Show message */}
      {!bankData ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet. Click "Create Bank Details" to continue.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankData?.map((item) => (
            <Grid key={item.id} item xs={12} md={6}>
              <BankDetailsCard bank={item}
                onViewRow={() => handleViewRow(item.id)}
              />
            </Grid>
          ))}
        </Grid>


      )}
    </>
  );
}
