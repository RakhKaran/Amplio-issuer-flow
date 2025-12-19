import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useGetChargeTypes,
  useGetCollateralTypes,
  useGetOwnershipTypes,
} from 'src/api/fieldOptions';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function CollateralAssets({
  currentCollateralAssets,
  setPercent,
  setProgress,
  saveStepData,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { chargeTypes, chargeTypesLoading } = useGetChargeTypes();
  const { collateralTypes, collateralTypesLoading } = useGetCollateralTypes();
  const { ownershipTypes, ownershipTypesLoading } = useGetOwnershipTypes();
  const [chargeTypesData, setChargeTypesData] = useState([
    {
      id: 'chg-001',
      label: 'First Charge',
      value: 'FIRST_CHARGE',
      description: 'Primary charge created on the asset',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'chg-002',
      label: 'Second Charge',
      value: 'SECOND_CHARGE',
      description: 'Secondary/Residual charge on the asset',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'chg-003',
      label: 'Pari Passu Charge',
      value: 'PARI_PASSU',
      description: 'Charge shared equally among lenders',
      isActive: true,
      isDeleted: false,
    },
  ]);

  const [collateralTypesData, setCollateralTypesData] = useState([
    {
      id: 'col-001',
      label: 'Property',
      value: 'PROPERTY',
      description: 'Land, building, or immovable property',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'col-002',
      label: 'Fixed Deposit',
      value: 'FD',
      description: 'Fixed deposit pledged as collateral',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'col-003',
      label: 'Shares / Securities',
      value: 'SHARES',
      description: 'Shares, bonds, or market securities',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'col-004',
      label: 'Machinery',
      value: 'MACHINERY',
      description: 'Plant, machinery, and equipment',
      isActive: true,
      isDeleted: false,
    },
  ]);

  const [ownershipTypesData, setOwnershipTypesData] = useState([
    {
      id: 'own-001',
      label: 'Sole Ownership',
      value: 'SOLE',
      description: 'Owned by a single entity or individual',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'own-002',
      label: 'Joint Ownership',
      value: 'JOINT',
      description: 'Owned jointly by two or more parties',
      isActive: true,
      isDeleted: false,
    },
    {
      id: 'own-003',
      label: 'Company Owned',
      value: 'COMPANY',
      description: 'Owned by a corporate/legal entity',
      isActive: true,
      isDeleted: false,
    },
  ]);

  const newCollateralSchema = Yup.object().shape({
    collateralType: Yup.string().required('Collateral Type is required'),
    chargeType: Yup.string().required('Charge Type is required'),
    description: Yup.string().required('Asset Description is required'),
    estimatedValue: Yup.string().required('Estimated Value is required'),
    valuationDate: Yup.date().required('Valuation Date is required'),
    ownershipType: Yup.string().required('Ownership Type is required'),
    securityDocument: Yup.mixed().required('Security Document is required'),
    securityDocRef: Yup.string().required('Security Document Ref is required'),
    trustName: Yup.string().required('Trust Name is required'),
    remarks: Yup.string(),
    assetCoverCertificate: Yup.mixed().required('Asset Cover Certificate is required'),
    valuationReport: Yup.mixed().required('Valuation Report is required'),
  });

  const defaultValues = useMemo(
    () => ({
      collateralType: currentCollateralAssets?.collateralType || '',
      chargeType: currentCollateralAssets?.chargeType || '',
      description: currentCollateralAssets?.description || '',
      estimatedValue: currentCollateralAssets?.estimatedValue || '',
      ownershipType: currentCollateralAssets?.ownershipType || '',
      securityDocRef: currentCollateralAssets?.securityDocRef || '',
      trustName: currentCollateralAssets?.trustName || '',
      remarks: currentCollateralAssets?.remarks || '',
      valuationDate: currentCollateralAssets?.valuationDate || new Date(),
      securityDocument: currentCollateralAssets?.securityDocument || null,
      assetCoverCertificate: currentCollateralAssets?.assetCoverCertificate || null,
      valuationReport: currentCollateralAssets?.valuationReport || null,
    }),
    [currentCollateralAssets]
  );

  const methods = useForm({
    resolver: yupResolver(newCollateralSchema),
    defaultValues,
  });

  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit((data) => {
    const payload = {
      collateralType: data.collateralType,
      chargeType: data.chargeType,
      description: data.description,
      estimatedValue: data.estimatedValue,
      valuationDate: data.valuationDate,
      ownershipType: data.ownershipType,
      securityDocRef: data.securityDocRef,
      trustName: data.trustName,
      remarks: data.remarks,
      securityDocument: data.securityDocument,
      assetCoverCertificate: data.assetCoverCertificate,
      valuationReport: data.valuationReport,
    };

    console.log('📌 Collateral Assets Saved:', payload);

    // Call parent save handler
    saveStepData?.(payload);

    setProgress?.(true);

    enqueueSnackbar('Collateral Assets saved (console only)', {
      variant: 'success',
    });
  });

  const handleCollateralFileDrop = async (fieldName, acceptedFiles) => {
    try {
      if (!acceptedFiles) return;

      enqueueSnackbar('Uploading File...', { variant: 'info' });

      const uploadFormData = new FormData();
      uploadFormData.append('file', acceptedFiles);

      const uploadRes = await axiosInstance.post('/files', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setValue(fieldName, uploadRes?.data?.files[0], { shouldValidate: true });
    } catch (err) {
      enqueueSnackbar('File upload failed', { variant: 'error' });
    }
  };

  const handleRemoveCollateralFile = (fieldName) => {
    setValue(fieldName, null, { shouldValidate: true });
  };

  const calculatePercent = () => {
    let completed = 0;

    if (values.collateralType) completed++;
    if (values.chargeType) completed++;
    if (values.description) completed++;
    if (values.estimatedValue) completed++;
    if (values.ownershipType) completed++;
    if (values.securityDocRef) completed++;
    if (values.trustName) completed++;
    if (values.valuationDate) completed++;

    // Optional fields — count them only if needed:
    if (values.securityDocument) completed++;
    if (values.assetCoverCertificate) completed++;
    if (values.valuationReport) completed++;

    // Decide how many are required (you choose)
    const TOTAL = 11; // if only first 8 are required

    const percentVal = (completed / TOTAL) * 50;

    setPercent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.collateralType,
    values.chargeType,
    values.description,
    values.estimatedValue,
    values.ownershipType,
    values.securityDocRef,
    values.trustName,
    values.valuationDate,
    values.securityDocument,
    values.assetCoverCertificate,
    values.valuationReport,
  ]);

  useEffect(() => {
    if (currentCollateralAssets) {
      reset(defaultValues);
    }
  }, [currentCollateralAssets, reset, defaultValues]);

  useEffect(() => {
    if (chargeTypes?.length > 0 && !chargeTypesLoading) {
      setChargeTypesData(chargeTypes);
    }
  }, [chargeTypes, chargeTypesLoading]);

  useEffect(() => {
    if (collateralTypes?.length > 0 && !collateralTypesLoading) {
      setCollateralTypesData(collateralTypes);
    }
  }, [collateralTypes, collateralTypesLoading]);

  useEffect(() => {
    if (ownershipTypes?.length > 0 && !ownershipTypesLoading) {
      setOwnershipTypesData(ownershipTypes);
    }
  }, [ownershipTypes, ownershipTypesLoading]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          minHeight: '100vh',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 0,
            mt: '0px',
          }}
        >
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
            Collateral & Asset Verification
          </Typography>

          <Grid container spacing={3}>
            {/* Collateral Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Collateral Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name="collateralType" label="Collateral Type" defaultValue="">
                    {collateralTypesData.length > 0 ? (
                      collateralTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No collateral types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Charge Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Charge Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name="chargeType" label="Charge Type" defaultValue="">
                    {chargeTypesData.length > 0 ? (
                      chargeTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No charge types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Asset Description */}
            <Grid item xs={12} md={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Asset Description
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField multiline name="description" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Estimated Value */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Estimated Value
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="estimatedValue" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Security Document Ref */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Security Document Ref
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="securityDocRef" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Valuation Date */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Valuation Date
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <Controller
                    name="valuationDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Valuation Date"
                        value={
                          field.value
                            ? field.value instanceof Date
                              ? field.value
                              : new Date(field.value)
                            : null
                        }
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Trust Name */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Trust Name
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="trustName" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Ownership Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Ownership Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name="ownershipType" label="Ownership Type" defaultValue="">
                    {ownershipTypesData.length > 0 ? (
                      ownershipTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No ownership types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Remarks
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="remarks" fullWidth />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={{ py: '20px' }}>Security Document</Typography>
              <RHFFileUploadBox
                name="securityDocument"
                label="Upload security document"
                icon="mdi:file-document-outline"
                // onDrop={(files) => handleCollateralFileDrop('securityDocument', files)}
                // onDelete={() => handleRemoveCollateralFile('securityDocument')}
              />
              <YupErrorMessage name="securityDocument" />
              <Typography sx={{ py: '20px' }}>Asset Cover Certificate</Typography>
              <RHFFileUploadBox
                name="assetCoverCertificate"
                label="Upload Asset cover certificate"
                icon="mdi:file-document-outline"
                // onDrop={(files) => handleCollateralFileDrop('assetCoverCertificate', files)}
                // onDelete={() => handleRemoveCollateralFile('assetCoverCertificate')}
              />
              <YupErrorMessage name="assetCoverCertificate" />
              <Typography sx={{ py: '20px' }}>Valuation Report</Typography>
              <RHFFileUploadBox
                name="valuationReport"
                label="Upload Valuation Report"
                icon="mdi:file-document-outline"
                // onDrop={(files) => handleCollateralFileDrop('valuationReport', files)}
                // onDelete={() => handleRemoveCollateralFile('valuationReport')}
              />
              <YupErrorMessage name="valuationReport" />
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ color: '#fff' }}
            >
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

CollateralAssets.propTypes = {
  currentCollateralAssets: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
