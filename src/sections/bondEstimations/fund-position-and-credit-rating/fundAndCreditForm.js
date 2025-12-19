import PropTypes from "prop-types";
import CreditRating from "./creditRatings";
import FundPosition from "./fundPosition";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";

export default function FundAndCreditForm({ currentFundPosition, currentCreditRatings, percent, setActiveStepId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [fundPositionPercent, setFundPositionPercent] = useState(0);
    const [creditRatingPercent, setCreditRatingPercent] = useState(0);
    const [fundpositionCompleted, setfundpositionCompleted] = useState(false);
    const [creditRatingCompleted, setcreditRatingCompleted] = useState(false);

    const handleNextClick = () => {
        if (!fundpositionCompleted) {
            enqueueSnackbar('please complete fund position section');
            return;
        }

        if (!creditRatingCompleted) {
            enqueueSnackbar('please complete credit rating section');
            return;
        }

        setActiveStepId();
    }

    useEffect(() => {
        const total = fundPositionPercent + creditRatingPercent;
        percent?.(total);
    }, [fundPositionPercent, creditRatingPercent, percent]);

    return (
        <>
            <FundPosition currentFundPosition={currentFundPosition} setPercent={setFundPositionPercent} setProgress={setfundpositionCompleted} />
            <CreditRating currentCreditRatings={currentCreditRatings} setPercent={setCreditRatingPercent} setProgress={setcreditRatingCompleted} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="button" variant="contained" onClick={() => handleNextClick()}>
                    Next
                </Button>
            </Box>
        </>
    )
}

FundAndCreditForm.propTpes = {
    currentFundPosition: PropTypes.object,
    currentCreditRatings: PropTypes.array
}