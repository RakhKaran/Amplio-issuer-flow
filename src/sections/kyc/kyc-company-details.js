import * as Yup from 'yup';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';

import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import axiosInstance from 'src/utils/axios';

import { enqueueSnackbar } from 'notistack';

import { useGetKycSection } from 'src/api/companyKyc';
import { useGetDocumentsByScreen } from 'src/api/documentsByScreen';

// =====================================================================

export default function KYCCompanyDetails({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const { kycSectionData, kycSectionLoading } = useGetKycSection(
    'company_documents',
    '/company-kyc/company-details'
  );

  const { documents, documentsLoading } = useGetDocumentsByScreen('/company-kyc/company-details');

  // Store file objects for uploaded docs
  const [docs, setDocs] = useState({});
  const prevPercentRef = useRef(null);

  // ========================= FIELD MAP ================================
  const FIELD_MAP = {
    certificate_of_incorporation: 'certificateOfIncorporation',
    sebi_registration_certificate: 'sebiCertificate',
    gst_certificate: 'gstCertificate',
    moa: 'moaDocument',
    aoa: 'aoaDocument',
  };

  // ========================= DOCUMENT MAP =============================
  const DOCUMENT_MAP = useMemo(() => {
    if (!documents) return {};
    const map = {};

    documents.forEach((doc) => {
      map[doc.value] = doc.id;
    });

    return map;
  }, [documents]);

  // ========================= DEFAULT VALUES ===========================
  const defaultValues = useMemo(() => {
    const result = {};

    Object.keys(FIELD_MAP).forEach((backendKey) => {
      const formField = FIELD_MAP[backendKey];
      const docId = DOCUMENT_MAP[backendKey];
      result[formField] = docs[docId] ?? null;
    });

    result.moaAoaType = docs[DOCUMENT_MAP.moa] ? 'moa' : docs[DOCUMENT_MAP.aoa] ? 'aoa' : 'moa';

    return result;
  }, [docs, DOCUMENT_MAP]);

  // ========================= YUP SCHEMA ===============================
  const CompanyDetailSchema = Yup.object().shape({
    certificateOfIncorporation: Yup.object().required('Certificate Of Incorporation is Required'),
    gstCertificate: Yup.object().required('GST Certificate is Required'),
    moaAoaType: Yup.string().required(),

    moaDocument: Yup.object()
      .nullable()
      .when('moaAoaType', {
        is: 'moa',
        then: (schema) => schema.required('MOA Document is Required'),
        otherwise: (schema) => schema.nullable(),
      }),

    aoaDocument: Yup.object()
      .nullable()
      .when('moaAoaType', {
        is: 'aoa',
        then: (schema) => schema.required('AOA Document is Required'),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  // ========================= FORM HOOK ================================

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const moaAoaType = useWatch({ control, name: 'moaAoaType' });
  const values = watch();
  console.log('watched values', values);

  // =====================================================================
  useEffect(() => {
    if (
      !kycSectionData ||
      kycSectionLoading ||
      !DOCUMENT_MAP ||
      Object.keys(DOCUMENT_MAP).length === 0
    )
      return;

    const filled = {};
    (kycSectionData.data || []).forEach((item) => {
      const file = item?.documentFile?.documentFile ?? null;
      filled[item.documentId] = file;
    });

    setDocs(filled);

    // ✅ Reset form ONLY when initial data loads
    const initialValues = {};
    Object.keys(FIELD_MAP).forEach((backendKey) => {
      const formField = FIELD_MAP[backendKey];
      const docId = DOCUMENT_MAP[backendKey];
      initialValues[formField] = filled[docId] ?? null;
    });
    initialValues.moaAoaType = filled[DOCUMENT_MAP.moa]
      ? 'moa'
      : filled[DOCUMENT_MAP.aoa]
      ? 'aoa'
      : 'moa';

    reset(initialValues);
    if (!dataInitializedSteps.includes('kyc_company_documents')) {
      setDataInitializedSteps();
      setActiveStepId();
    }
  }, [kycSectionData, kycSectionLoading, DOCUMENT_MAP, reset, setDataInitializedSteps, dataInitializedSteps, setActiveStepId, FIELD_MAP]);

  // =====================================================================
  // Percent calculation
  const certificateOfIncorporation = useWatch({
    control,
    name: 'certificateOfIncorporation',
  });

  const gstCertificate = useWatch({
    control,
    name: 'gstCertificate',
  });

  const calculatePercent = useCallback(() => {
    let valid = 0;

    // 1️⃣ Certificate of Incorporation
    if (certificateOfIncorporation && !errors.certificateOfIncorporation) {
      valid++;
    }

    // 2️⃣ GST Certificate
    if (gstCertificate && !errors.gstCertificate) {
      valid++;
    }

    // 3️⃣ MOA / AOA document (ONLY ONE COUNTS)
    if (moaAoaType === 'moa') {
      if (values.moaDocument && !errors.moaDocument) {
        valid++;
      }
    }

    if (moaAoaType === 'aoa') {
      if (values.aoaDocument && !errors.aoaDocument) {
        valid++;
      }
    }

    return Math.round((valid / 3) * 100);
  }, [
    certificateOfIncorporation,
    gstCertificate,
    moaAoaType,
    values.moaDocument,
    values.aoaDocument,
    errors,
  ]);

  useEffect(() => {
    const p = calculatePercent();
    if (prevPercentRef.current !== p) {
      prevPercentRef.current = p;
      percent(p);
    }
  }, [percent, calculatePercent]);

  // =====================================================================
  // Submit handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('company_user_id');
      if (!usersId) return enqueueSnackbar('User ID missing', { variant: 'error' });

      const uploadedDocuments = [];

      Object.keys(FIELD_MAP).forEach((backendKey) => {
        const formField = FIELD_MAP[backendKey];
        const uploaded = data[formField];

        if (uploaded?.id) {
          uploadedDocuments.push({
            documentsId: DOCUMENT_MAP[backendKey],
            documentsFileId: uploaded.id,
          });
        }
      });

      const payload = {
        usersId,
        documents: uploadedDocuments,
      };

      const final = await axiosInstance.post('/company-profiles/kyc-upload-documents', payload);

      if (final?.data?.success) {
        enqueueSnackbar('Documents Uploaded Successfully', { variant: 'success' });
        percent(100);
        setActiveStepId();
      }
    } catch (error) {
      enqueueSnackbar('Error uploading documents', { variant: 'error' });
    }
  });

  // =====================================================================
  return (
    <Container>
      <KYCTitle title="Company Details" subtitle="Submit required company documents." />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* ================= COI ================= */}
            <RHFCustomFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation*"
              // existing={docs[DOCUMENT_MAP.certificate_of_incorporation]}
              icon="mdi:certificate-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="certificateOfIncorporation" />

            {/* ================= MOA / AOA TYPE ================= */}
            <RHFSelect name="moaAoaType" label="Select Document Type">
              <MenuItem value="moa">MoA - Memorandum of Association</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association</MenuItem>
            </RHFSelect>

            {/* ================= MOA ================= */}
            {moaAoaType === 'moa' && (
              <RHFCustomFileUploadBox
                name="moaDocument"
                label="MoA - Memorandum of Association*"
                // existing={docs[DOCUMENT_MAP.moa]}
                icon="mdi:file-document-edit-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            )}

            {/* ================= AOA ================= */}
            {moaAoaType === 'aoa' && (
              <RHFCustomFileUploadBox
                name="aoaDocument"
                label="AoA - Articles of Association*"
                // existing={docs[DOCUMENT_MAP.aoa]}
                icon="mdi:file-document-edit-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            )}

            {/* ================= GST ================= */}
            <RHFCustomFileUploadBox
              name="gstCertificate"
              label="GST Certificate*"
              icon="mdi:earth"
              // existing={docs[DOCUMENT_MAP.gst_certificate]}
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button component={RouterLink} href={paths.kycBasicInfo} variant="outlined">
            Back
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Next
          </LoadingButton>
        </Box>
      </FormProvider>

      <KYCFooter />
    </Container>
  );
}
