import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';
import BorrowingDetails from './borrowing-details';
import ProfitabilityDetails from './profitable-details';
import CapitalDetails from './capital-details';

export default function MainFile({ currentDetails, saveStepData, setActiveStepId, percent }) {
  const [currentFormCount, setCurrentFormCount] = useState(0);
  const [payloadData, setpayloadData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getPercent = (count) => {
    switch (count) {
      case 1:
        return 35;
      case 2:
        return 70;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const p = getPercent(currentFormCount);

    if (typeof percent === 'function') {
      percent(p);
    }
  }, [currentFormCount]);

  const handleNextClick = async () => {
    if (currentFormCount === 3) {
      enqueueSnackbar('Step completed!', { variant: 'success' });
      saveStepData(payloadData);
      setActiveStepId('financial_details');
    } else {
      enqueueSnackbar('Please complete the form', { variant: 'error' });
      return;
    }
  };

  useEffect(() => {
    if (!currentDetails) return;

    let count = 0;

    if (currentDetails.borrowings && Object.keys(currentDetails.borrowings).length > 0) {
      count += 1;
    }
    if (currentDetails.capitalDetails && Object.keys(currentDetails.capitalDetails).length > 0) {
      count += 1;
    }
    if (currentDetails.profitDetails && Object.keys(currentDetails.profitDetails).length > 0) {
      count += 1;
    }

    setCurrentFormCount(count);

    setpayloadData({
      borrowings: currentDetails.borrowings || null,
      capitalDetails: currentDetails.capitalDetails || null,
      profitDetails: currentDetails.profitDetails || null,
    });
  }, [currentDetails]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BorrowingDetails
          currentDetails={currentDetails?.borrowings}
          onSave={(data) => setpayloadData((prev) => ({ ...prev, borrowings: data }))}
          setCurrentFormCount={setCurrentFormCount}
        />
      </Grid>

      <Grid item xs={12}>
        <CapitalDetails
          currentCapitals={currentDetails?.capitalDetails}
          onSave={(data) => setpayloadData((prev) => ({ ...prev, capitalDetails: data }))}
          setCurrentFormCount={setCurrentFormCount}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentProfitable={currentDetails?.profitDetails}
          onSave={(data) => setpayloadData((prev) => ({ ...prev, profitDetails: data }))}
          setCurrentFormCount={setCurrentFormCount}
        />
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {/* <Button
            variant="outlined"
            sx={{ color: '#000000' }}
            onClick={() => setActiveStep(1)}
          >
            Cancel
          </Button> */}

          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ color: '#fff' }}
            onClick={handleNextClick}
          >
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}

MainFile.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
