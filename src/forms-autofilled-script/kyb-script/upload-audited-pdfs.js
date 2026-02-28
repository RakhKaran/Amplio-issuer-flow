import axiosInstance from 'src/utils/axios';

const PDF_ROOT = '/pdfs/kyb';

const PDF_CONFIG = {
  financial_statements: ['financial_statement_year_1.pdf', 'financial_statement_year_2.pdf', 'financial_statement_year_3.pdf'],
  income_tax_returns: ['income_tax_return_year_1.pdf', 'income_tax_return_year_2.pdf', 'income_tax_return_year_3.pdf'],
  gstr_9: ['gstr9_year_1.pdf', 'gstr9_year_2.pdf', 'gstr9_year_3.pdf'],
};

const GST3B_PDF_BY_MONTH = {
  jan: 'gst3b_jan.pdf',
  feb: 'gst3b_feb.pdf',
  mar: 'gst3b_mar.pdf',
  apr: 'gst3b_apr.pdf',
  may: 'gst3b_may.pdf',
  jun: 'gst3b_jun.pdf',
  jul: 'gst3b_jul.pdf',
  aug: 'gst3b_aug.pdf',
  sep: 'gst3b_sep.pdf',
  oct: 'gst3b_oct.pdf',
  nov: 'gst3b_nov.pdf',
  dec: 'gst3b_dec.pdf',
};

const resolveFileName = ({ category, doc, index }) => {
  if (category === 'gst_3b') {
    return GST3B_PDF_BY_MONTH[(doc?.month || '').toLowerCase()] || null;
  }

  return PDF_CONFIG[category]?.[index] || null;
};

const fetchPdfAsFile = async (fileName) => {
  const response = await fetch(`${PDF_ROOT}/${fileName}`);

  if (!response.ok) {
    throw new Error(`Unable to read PDF: ${fileName}`);
  }

  const blob = await response.blob();
  return new File([blob], fileName, { type: 'application/pdf' });
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/files', formData);
  return response?.data?.files?.[0] || null;
};

export const autoUploadAuditedPdfs = async ({ category, documents = [] }) => {
  const uploadedFiles = await Promise.all(
    documents.map(async (doc, index) => {
      const fileName = resolveFileName({ category, doc, index });
      if (!fileName) return null;

      try {
        const file = await fetchPdfAsFile(fileName);
        return await uploadFile(file);
      } catch (error) {
        console.error(`Auto upload failed for ${fileName}`, error);
        return null;
      }
    })
  );

  return uploadedFiles;
};
