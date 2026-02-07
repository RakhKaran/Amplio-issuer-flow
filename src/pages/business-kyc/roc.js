import { Helmet } from 'react-helmet-async';
import RocChagre from 'src/sections/business-kyc/roc/roc-charge';

// ----------------------------------------------------------------------

export default function RocPage() {
  return (
    <>
      <Helmet>
        <title> Kyc </title>
      </Helmet>

      <RocChagre />
    </>
  );
}
