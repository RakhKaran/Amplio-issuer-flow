import { Box, Button, Stack } from "@mui/material";
import CollateralAssets from "./collatralAssets";
import PropTypes from "prop-types";
import PreliminaryRequirements from "./preliminaryRequirements";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export default function PriliminaryAndCollateralView({ currentPrliminaryRequirements, currentCollateral, percent, setActiveStepId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [priliminaryPercent, setPriliminaryPercent] = useState(0);
    const [collateralPercent, setCollateralPercent] = useState(0);
    const [priliminaryCompleted, setPriliminaryCompleted] = useState(0);
    const [collateralCompleted, setCollateralCompleted] = useState(0);

    const handleNextClick = () => {
        if (!priliminaryCompleted) {
            enqueueSnackbar('please complete priliminary requirements section', { variant: 'error' });
            return;
        }

        if (!collateralCompleted) {
            enqueueSnackbar('please complete collateral assets section', { variant: 'error' });
            return;
        }

        setActiveStepId();
    }

    useEffect(() => {
        const total = priliminaryPercent + collateralPercent;
        percent?.(total);
    }, [priliminaryPercent, collateralPercent, percent]);

    return (
        <Stack direction='column' spacing={2}>
            <PreliminaryRequirements
                currentPriliminaryRequirements={currentPrliminaryRequirements}
                setPercent={setPriliminaryPercent}
                setProgress={setPriliminaryCompleted}
            />
            <CollateralAssets
                currentCollateralAssets={currentCollateral}
                setPercent={setCollateralPercent}
                setProgress={setCollateralCompleted}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="button" variant="contained" onClick={() => handleNextClick()}>
                    Next
                </Button>
            </Box>
        </Stack>
    )
}

PriliminaryAndCollateralView.propTypes = {
    currentPrliminaryRequirements: PropTypes.object,
    currentCollateral: PropTypes.object,
    percent: PropTypes.func,
    setActiveStepId: PropTypes.func
}