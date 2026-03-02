import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFPriceField,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { AutoFill } from 'src/forms-autofilled-script/autofill';
import { NewGuarantorDetails } from 'src/forms-autofilled-script/kyb-script/newkyb';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { DatePicker } from '@mui/x-date-pickers';
import axiosInstance from 'src/utils/axios';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { status } from 'nprogress';

const guarantorType = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Corporate', label: 'Corporate' },
];

export default function AddGuarantorForm({
  open,
  onClose,
  onSuccess,
  companyId,
  currentGurantor,
  onSubmitSuccess,
  // isViewMode,
  isEditMode,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [extractedPan, setExtractedPan] = useState(null);
  const [panExtractionStatus, setPanExtractionStatus] = useState('idle');
  const isViewMode = currentGurantor;

  const NewUserSchema = Yup.object().shape({
    guarantorName: Yup.string().when('guarantorType', {
      is: 'Corporate',
      then: (schema) => schema.required('Company Name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Please enter a valid email address'
      ),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
    cin: Yup.string().when('guarantorType', {
      is: (val) => val === 'Corporate',
      then: (schema) => schema.required('CIN is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    boardResolutionFile: Yup.mixed().when('guarantorType', {
      is: (val) => val === 'Corporate',
      then: (schema) => schema.required('fileRequired', 'Board resolution is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    guarantorType: Yup.string().required('Guarantor Type is required'),
    guarantorAmountLimit: Yup.number().required('Amount Limit is required'),
    panCardFile: Yup.mixed().required('fileRequired', 'PAN card is required'),
    adharCardFile: Yup.mixed().when('guarantorType', {
      is: 'individual',
      then: (schema) =>
        schema.test('fileRequired', 'Aadhar card is required', function (value) {
          if (currentGurantor?.id) return true; // ✅ edit mode
          return !!value;
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
    fullName: Yup.string().required("Guarantor's Full Name is required"),
    estimetedNetWorth: Yup.number().required('Estimated Net Worth is required'),
    panNumber: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN Number is required'),
    dateOfBirth: Yup.date().when('guarantorType', {
      is: 'Individual',
      then: (schema) =>
        schema.required('Date of Birth is required').max(new Date(), 'DOB cannot be in future'),
      otherwise: (schema) => schema.notRequired(),
    }),
    adharNumber: Yup.string().when('guarantorType', {
      is: 'Individual',
      then: (schema) =>
        schema
          .required('Aadhar Number is required')
          .matches(/^\d{12}$/, 'Aadhar must be exactly 12 digits'),
      otherwise: (schema) => schema.notRequired(),
    }),
    gstCertificateFile: Yup.mixed().nullable(),
    financialStatementFile: Yup.mixed().nullable(),
    addressProofFile: Yup.mixed().nullable(),
    itrFile: Yup.mixed().nullable(),
    consent: Yup.boolean()
      .oneOf([true], 'You must provide consent to proceed')
      .required('Consent is required'),
  });

  const defaultValues = useMemo(
    () => ({
      guarantorName: currentGurantor?.guarantorCompanyName || '',
      email: currentGurantor?.email || '',
      phoneNumber: currentGurantor?.phoneNumber || currentGurantor?.phone || '',
      cin: currentGurantor?.CIN || '',
      guarantorAmountLimit:
        currentGurantor?.guaranteedAmountLimit || currentGurantor?.GaurantorAmountLimit || '',
      guarantorType: currentGurantor?.guarantorType || 'Corporate',
      fullName: currentGurantor?.fullName || '',
      estimetedNetWorth: currentGurantor?.estimatedNetWorth || '',
      panNumber: currentGurantor?.panNumber || '',
      dateOfBirth: currentGurantor?.dateOfBirth ? new Date(currentGurantor.dateOfBirth) : null,
      adharNumber: currentGurantor?.adharNumber || '',
      adharCardFile: currentGurantor?.companyAadhar || null,
      panCardFile: currentGurantor?.companyPan || null,
      boardResolutionFile: currentGurantor?.boardResoluton || null,
      gstCertificateFile: currentGurantor?.gstCertificate || null,
      financialStatementFile: currentGurantor?.financialStatement || null,
      addressProofFile: currentGurantor?.addressProof || null,
      itrFile: currentGurantor?.itr || null,

      consent: currentGurantor ? true : false,
    }),
    [currentGurantor]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const netWorth = useWatch({
    control,
    name: 'estimetedNetWorth',
  });

  useEffect(() => {
    if (!netWorth) return;

    const calculatedLimit = Math.floor(Number(netWorth) * 0.4);

    setValue('guarantorAmountLimit', calculatedLimit, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [netWorth, setValue]);

  const getErrorMessage = (fieldName) => {
    if (!errors[fieldName]) return null;
    return (
      <Box
        component="span"
        sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, display: 'block' }}
      >
        {errors[fieldName]?.message}
      </Box>
    );
  };
  const selectedGuarantorType = useWatch({
    control,
    name: 'guarantorType',
  });

  // const panFile = useWatch({
  //   control: methods.control,
  //   name: 'panCard',
  // });
  // const isPanUploaded = Boolean(panFile?.id || panFile?.files?.[0]?.id);

  // const watchRole = methods.watch('role');

  const getFileId = (fileValue) => {
    if (!fileValue) return null;

    // Existing file (edit mode)
    if (fileValue.id) return fileValue.id;

    // Newly uploaded file
    if (fileValue.files?.length > 0) {
      return fileValue.files[0]?.id || null;
    }

    return null;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const isCorporate = data.guarantorType === 'Corporate';

      const panCardFileId = getFileId(data.panCardFile);
      const adharCardFileId = getFileId(data.adharCardFile);
      const boardResolutionFileId = getFileId(data.boardResolutionFile);
      const gstCertificateFileId = getFileId(data.gstCertificateFile);
      const financialStatementFileId = getFileId(data.financialStatementFile);
      const addressProofFileId = getFileId(data.addressProofFile);
      const itrFileId = getFileId(data.itrFile);

      // if (!panCardFileId || !adharCardFileId) {
      //   enqueueSnackbar('PAN & Aadhaar documents are required', { variant: 'error' });
      //   return;
      // }

      // ✅ Backend-aligned payload
      const payload = {
        phoneNumber: data.phoneNumber,
        email: data.email,
        guarantorType: data.guarantorType,
        guaranteedAmountLimit: Number(data.guarantorAmountLimit),
        estimatedNetWorth: Number(data.estimetedNetWorth),
        fullName: data.fullName,
        panNumber: data.panNumber,

        ...(data.guarantorType === 'Corporate' && {
          guarantorCompanyName: data.guarantorName,
          CIN: data.cin,
        }),

        ...(data.guarantorType === 'Individual' && {
          dateOfBirth: data.dateOfBirth,
          adharNumber: data.adharNumber,
        }),

        companyPanId: panCardFileId,
        companyAadharId: data.guarantorType === 'Individual' ? adharCardFileId : undefined,
        boardResolutonId: data.guarantorType === 'Corporate' ? boardResolutionFileId : undefined,
        gstCertificateId:
          data.guarantorType === 'Corporate' ? gstCertificateFileId || undefined : undefined,
        financialStatementId:
          data.guarantorType === 'Corporate' ? financialStatementFileId || undefined : undefined,
        addressProofId:
          data.guarantorType === 'Individual' ? addressProofFileId || undefined : undefined,
        itrId: data.guarantorType === 'Individual' ? itrFileId || undefined : undefined,
      };
      let response;

      // 🟢 EDIT → PATCH
      if (currentGurantor?.id) {
        response = await axiosInstance.patch(
          `/business-kyc/guarantor-details/${currentGurantor.id}`,
          payload
        );
      }
      // 🔵 ADD → POST
      else {
        response = await axiosInstance.post('/business-kyc/guarantor-details', payload);
      }

      if (response?.status === 200 || response?.status === 201) {
        enqueueSnackbar(
          currentGurantor?.id ? 'Guarantor updated successfully' : 'Guarantor added successfully',
          { variant: 'success' }
        );

        onSubmitSuccess?.(response.data);
        onClose();
        reset();
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || 'Failed to save guarantor', {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, currentGurantor, defaultValues, reset]);

  useEffect(() => {
    if (selectedGuarantorType === 'Corporate') {
      setValue('dateOfBirth', undefined);
    } else {
      setValue('guarantorName', undefined);
      setValue('cin', undefined);
    }
  }, [selectedGuarantorType, setValue]);

  // useEffect(() => {
  //   if (!panFile?.id) return;

  //   const extractPanDetails = async () => {
  //     try {
  //       setPanExtractionStatus('loading');

  //       const response = await axiosInstance.post('/extract/pan-info', {
  //         fileId: panFile.id,
  //       });

  //       const data = response?.data?.data || {};

  //       const panNumber = data?.extractedPanNumber;
  //       const panName = data?.extractedPanHolderName;
  //       const panDob = data?.extractedDateOfBirth;

  //       if (!panNumber && !panName && !panDob) {
  //         setPanExtractionStatus('failed');
  //         enqueueSnackbar("Couldn't extract PAN details. Please fill manually.", {
  //           variant: 'error',
  //         });
  //         return;
  //       }

  //       if (panName) {
  //         setValue('panHoldersName', panName, {
  //           shouldValidate: true,
  //           shouldDirty: true,
  //         });
  //       }

  //       if (panNumber) {
  //         setValue('panNumber', panNumber, {
  //           shouldValidate: true,
  //           shouldDirty: true,
  //         });
  //       }

  //       if (panDob) {
  //         setValue('submittedDateOfBirth', panDob, {
  //           shouldValidate: true,
  //           shouldDirty: true,
  //         });
  //       }

  //       setPanExtractionStatus('success');
  //       enqueueSnackbar('PAN details extracted successfully', {
  //         variant: 'success',
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       setPanExtractionStatus('failed');
  //       enqueueSnackbar('Unable to extract PAN details. Please fill manually.', {
  //         variant: 'error',
  //       });
  //     }
  //   };

  //   extractPanDetails();
  // }, [panFile?.id]);

  const handleAutoFill = async () => {
    const autoData = NewGuarantorDetails({
      guarantorType: selectedGuarantorType || 'Corporate',
    });
    AutoFill({ setValue, fields: autoData });

    const isCorporate = (selectedGuarantorType || 'Corporate') === 'Corporate';

    const uploadTargets = isCorporate
      ? [
        { field: 'panCardFile', fileName: 'financial_statement_year_1.pdf' },
        { field: 'boardResolutionFile', fileName: 'income_tax_return_year_1.pdf' },
        { field: 'gstCertificateFile', fileName: 'gstr9_year_1.pdf' },
        { field: 'financialStatementFile', fileName: 'financial_statement_year_2.pdf' },
      ]
      : [
        { field: 'panCardFile', fileName: 'financial_statement_year_1.pdf' },
        { field: 'adharCardFile', fileName: 'income_tax_return_year_1.pdf' },
        { field: 'addressProofFile', fileName: 'gstr9_year_1.pdf' },
        { field: 'itrFile', fileName: 'income_tax_return_year_2.pdf' },
      ];

    const uploadResults = await Promise.all(
      uploadTargets.map(async ({ field, fileName }) => {
        try {
          const response = await fetch(`/pdfs/kyb/${fileName}`);
          if (!response.ok) return { field, file: null };

          const blob = await response.blob();
          const file = new File([blob], fileName, { type: 'application/pdf' });
          const formData = new FormData();
          formData.append('file', file);

          const uploadRes = await axiosInstance.post('/files', formData);
          return { field, file: uploadRes?.data?.files?.[0] || null };
        } catch (error) {
          return { field, file: null };
        }
      })
    );

    uploadResults.forEach(({ field, file }) => {
      if (!file) return;
      setValue(field, file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });

    const uploadedCount = uploadResults.filter((entry) => !!entry.file).length;
    if (uploadedCount > 0) {
      enqueueSnackbar(`Autofill uploaded ${uploadedCount} guarantor PDF(s)`, {
        variant: 'success',
      });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 2,
          }}
        >
          <DialogTitle color="primary.main" sx={{ p: 0 }}>
            {currentGurantor?.id ? 'Edit Guarantor' : 'Add Guarantor'}
          </DialogTitle>
          <Iconify
            icon="mingcute:close-line"
            width={24}
            onClick={onClose}
            sx={{ cursor: 'pointer', color: 'text.secondary' }}
          />
        </Box>
        <DialogContent
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pr: 2,
          }}
        >
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="guarantorType"
                label="Guarantor Type*"
                // disabled={isViewMode}
              >
                {guarantorType.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            {/* Row 1 */}
            {selectedGuarantorType === 'Corporate' && (
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="guarantorName"
                  label="Company Name*"
                  // disabled={isViewMode}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
            )}

            {selectedGuarantorType === 'Corporate' && (
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="cin"
                  label="CIN*"

                  // disabled={isViewMode}
                />
              </Grid>
            )}

            {/* Row 2 */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="email"
                label="Email*"
                // disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="phoneNumber"
                label="Phone Number*"
                inputProps={{ maxLength: 10 }}
                // disabled={isViewMode}
              />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} md={6}>
              <RHFPriceField name="estimetedNetWorth" label="Estimated Net Worth*" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFPriceField
                name="guarantorAmountLimit"
                label="Guaranteed Amount Limit*"
                disabled
              />
            </Grid>

            {/* Row 4 */}

            {/* Full width uploads */}

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mt: 2,
                }}
              >
                PAN Section
              </Typography>
            </Grid>

            {selectedGuarantorType === 'Corporate' && (
              <Grid item xs={12}>
                <RHFCustomFileUploadBox
                  name="panCardFile"
                  label="Upload Corporate PAN Card*"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                  fullWidth
                  // disabled={isViewMode}
                />
                {getErrorMessage('panCardFile')}
              </Grid>
            )}

            {selectedGuarantorType === 'Individual' && (
              <Grid item xs={12}>
                <RHFCustomFileUploadBox
                  name="panCardFile"
                  label="Upload PAN Card*"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                  fullWidth
                  // disabled={isViewMode}
                />
                {getErrorMessage('panCardFile')}
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="fullName"
                label="Full Name* (as per PAN)"
                inputProps={{ style: { textTransform: 'uppercase' } }}
                // disabled={isViewMode}
              />
            </Grid>

            {/* Row 5 */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="panNumber"
                label="PAN Number*"
                inputProps={{ maxLength: 10 }}
                // disabled={isViewMode}
              />
            </Grid>

            {selectedGuarantorType === 'Individual' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date of Birth*"
                      format="dd/MM/yyyy"
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
            )}

            {selectedGuarantorType === 'Corporate' && (
              <>
                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="boardResolutionFile"
                    label="Upload Board Resolution*"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('boardResolutionFile')}
                </Grid>
                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="gstCertificateFile"
                    label="Upload GST Certificate (optional)"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('gstCertificateFile')}
                </Grid>
                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="financialStatementFile"
                    label="Upload Financial Statement (optional)"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('financialStatementFile')}
                </Grid>
              </>
            )}
            {selectedGuarantorType === 'Individual' && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      mt: 2,
                    }}
                  >
                    Aadhar Section
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="adharCardFile"
                    label="Upload Aadhaar Card*"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('adharCardFile')}
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="adharNumber"
                    label="Aadhaar Number*"
                    inputProps={{ maxLength: 12 }}
                    // disabled={isViewMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="addressProofFile"
                    label="Upload Address Proof (optional)"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('addressProofFile')}
                </Grid>
                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name="itrFile"
                    label="Upload ITR (optional)"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    fullWidth
                    // disabled={isViewMode}
                  />
                  {getErrorMessage('itrFile')}
                </Grid>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: '100%', px: 2, pt: 2 }}>
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{
                      alignItems: 'flex-start', // keeps checkbox aligned with multiline text
                    }}
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I confirm that I am the guarantor / authorized person and consent to the
                        collection and verification of my PAN and Aadhaar details for guarantor KYC,
                        compliance, and risk assessment purposes.
                      </Typography>
                    }
                  />
                )}
              />

              {errors.consent && (
                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                  {errors.consent.message}
                </Typography>
              )}
            </Box>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
           <Button
                type='button'
                variant="contained"
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    boxShadow: 'none',
                  },
                }}
                color="primary"
                onClick={() => handleAutoFill()}
              >
                Autofill
              </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main',
                  boxShadow: 'none',
                },
              }}
            >
              Save & Continue
            </Button>
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddGuarantorForm.propTypes = {
  currentGurantor: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  isViewMode: PropTypes.bool,
  isEditMode: PropTypes.bool,
  companyId: PropTypes.string,
};
