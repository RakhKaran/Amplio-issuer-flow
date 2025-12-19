import { Helmet } from 'react-helmet-async';
// sections
import { MyBondCreate } from 'src/sections/mybond/view';
// ----------------------------------------------------------------------

export default function MyBondCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Create</title>
      </Helmet>

      <MyBondCreate />
    </>
  );
}
