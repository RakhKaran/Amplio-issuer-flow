import { useGetBondEstimations } from "src/api/bondEstimations";
import ROIGuidance from "../roi-guidance";
import BondsEstimationListView from "./bond-estimations-list-view";

export default function BondEstimationsInitialPageView() {
    const { bondEstimations, bondEstimationsLoading, count } = useGetBondEstimations();

    return (
        <>
            {
                (bondEstimations.length === 0 && !bondEstimationsLoading) ? <ROIGuidance /> : <BondsEstimationListView bondEstimations={bondEstimations} bondEstimationsLoading={bondEstimationsLoading} count={count} />
            }
        </>
    )
}