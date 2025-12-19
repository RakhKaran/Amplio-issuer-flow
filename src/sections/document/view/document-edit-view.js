// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// api
import { useGetDocumentType } from 'src/api/document-type';

// preview
import DocumentFormPreview from '../document-form-preview';

export default function DocumentEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const mapFormFieldsFromApi = (fields = []) =>
    fields.map((f) => ({
      id: f.id,
      label: f.label,
      value: f.value,
      type: f.type,
      required: f.required ?? false,
      options:
        f.options?.map((o) => ({
          id: o.id,
          option: o.option,
          value: o.value,
          nestedFields: mapFormFieldsFromApi(o.nestedFields || []),
        })) || [],
      childFields: mapFormFieldsFromApi(f.childFields || []),
    }));

  const { documentType: currentDocument } = useGetDocumentType(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Preview Document"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Documents', href: paths.dashboard.documentDrafting.list },
          { name: currentDocument?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocumentFormPreview
        fields= {mapFormFieldsFromApi(currentDocument?.form?.fields || [])}
        fileTemplateId={currentDocument?.fileTemplateId}
        setPreview={() => { }}
      />
    </Container>
  );
}
