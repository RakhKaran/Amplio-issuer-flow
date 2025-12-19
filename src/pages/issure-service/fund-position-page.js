import { Helmet } from 'react-helmet-async';
import FundPositionForm from 'src/sections/issure-services/creditRatings';


// ----------------------------------------------------------------------

export default function FundPositionPage() {
  return (
    <>
      <Helmet>
        <title> Roi: FundPositionForm</title>
      </Helmet>

      <FundPositionForm />
    </>
  );
}
