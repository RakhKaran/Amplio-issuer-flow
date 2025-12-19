import { Helmet } from 'react-helmet-async';
// sections
import { DocumentListView } from 'src/sections/document/view';

// ----------------------------------------------------------------------

export default function DocumentDraftingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Document Drafting List</title>
      </Helmet>

      <DocumentListView />

    </>
  );
}
