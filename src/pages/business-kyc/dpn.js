import { Helmet } from 'react-helmet-async';
import DPN from 'src/sections/business-kyc/dpn/dpn-view';

// ----------------------------------------------------------------------

export default function DpnPage() {
  return (
    <>
      <Helmet>
        <title> Kyc </title>
      </Helmet>

      <DPN />
    </>
  );
}
