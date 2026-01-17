import { Helmet } from 'react-helmet-async';
import { Initial } from 'src/sections/business-kyc/business-kyc-start';

// ----------------------------------------------------------------------

export default function InitialPage() {
  return (
    <>
      <Helmet>
        <title> Post: List</title>
      </Helmet>

      <Initial />
    </>
  );
}
