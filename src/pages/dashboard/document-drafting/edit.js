import { Helmet } from 'react-helmet-async';
// sections
import { JobEditView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

export default function TrusteeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard:Trustee Edit</title>
      </Helmet>

      <JobEditView />
    </>
  );
}
