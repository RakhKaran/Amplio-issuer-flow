import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import BorrowingDetails from './borrowing-details';
import ProfitabilityDetails from './profitable-details';
import CapitalDetails from './capital-details';

export default function MainFile({ setActiveStepId, currentBorrowingDetails, currentCapitalDetails, currentProfitabilityDetails, percent }) {
  const { enqueueSnackbar } = useSnackbar();
  const [borrowingDetailsPercent, setBorrowingDetailsPercent] = useState(0);
  const [capitalDetailsPercent, setCapitalDetailsPercent] = useState(0);
  const [profitabilityDetailsPercent, setProfitabilityDetailsPercent] = useState(0);
  const [isBorrowingDetailsCompleted, setIsBorrowingDetailsCompleted] = useState(false);
  const [isCapitalDetailsCompleted, setIsCapitalDetailsCompleted] = useState(false);
  const [isProfitabilityDetailsCompleted, setIsProfitabilityDetailsCompleted] = useState(false);

  const handleNextClick = () => {
    if (!isBorrowingDetailsCompleted) {
      enqueueSnackbar('please complete Borrowing deta section');
      return;
    }

    if (!isCapitalDetailsCompleted) {
      enqueueSnackbar('please complete capital details section');
      return;
    }

    if (!isProfitabilityDetailsCompleted) {
      enqueueSnackbar('please complete profitability details section');
      return;
    }

    setActiveStepId();
  }

  useEffect(() => {
    const total = borrowingDetailsPercent + capitalDetailsPercent + profitabilityDetailsPercent;
    percent?.(total);
  }, [borrowingDetailsPercent, capitalDetailsPercent, profitabilityDetailsPercent, percent]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BorrowingDetails
          currentBorrowingDetails={currentBorrowingDetails}
          setPercent={setBorrowingDetailsPercent}
          setProgress={setIsBorrowingDetailsCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <CapitalDetails
          currentCapitalDetails={currentCapitalDetails}
          setPercent={setCapitalDetailsPercent}
          setProgress={setIsCapitalDetailsCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentProfitabilityDetails={currentProfitabilityDetails}
          setPercent={setProfitabilityDetailsPercent}
          setProgress={setIsProfitabilityDetailsCompleted}
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
          <LoadingButton variant="contained" sx={{ color: '#fff' }} onClick={handleNextClick}>
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>

  );
}

MainFile.propTypes = {
  setActiveStepId: PropTypes.func,
  currentBorrowingDetails: PropTypes.array,
  currentCapitalDetails: PropTypes.object,
  currentProfitabilityDetails: PropTypes.object,
  percent: PropTypes.func
};
