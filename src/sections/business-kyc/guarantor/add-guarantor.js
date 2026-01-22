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
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { DatePicker } from '@mui/x-date-pickers';
import axiosInstance from 'src/utils/axios';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';

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
    guarantorName: Yup.string().required('Name is required'),
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
    guarantorType: Yup.string().required('Guarantor Type is required'),
    guarantorAmountLimit: Yup.number().required('Amount Limit is required'),
    panCardFile: Yup.mixed().required('fileRequired', 'PAN card is required'),
    adharCardFile: Yup.mixed().required('fileRequired', 'Aadhar card is required'),
    fullName: Yup.string().required("Guarantor's Full Name is required"),
    estimetedNetWorth: Yup.number().required('Estimated Net Worth is required'),
    panNumber: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN Number is required'),
    adharNumber: Yup.string()
      .max(12, 'Invalid Aadhar format')
      .required('Aadhar Number is required'),
    consent: Yup.boolean()
      .oneOf([true], 'You must provide consent to proceed')
      .required('Consent is required'),

    // submittedPanFullName: Yup.string()
    //   .transform((value) => value?.toUpperCase())
    //   .required("PAN Holder's Name is required")
    //   .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    // submittedPanNumber: Yup.string()
    //   .transform((value) => value?.toUpperCase())
    //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    //   .required('PAN Number is required'),
    // submittedDateOfBirth: Yup.string().required('DOB is required'),
    // panCard: Yup.mixed().test('fileRequired', 'PAN card is required', function (value) {
    //   if (isEditMode) return true;
    //   return !!value;
    // }),
    // boardResolution: Yup.mixed().test(
    //   'fileRequired',
    //   'Board Resolution is required',
    //   function (value) {
    //     if (isEditMode) return true;
    //     return !!value;
    //   }
    // ),
  });

  const defaultValues = useMemo(
    () => ({
      guarantorName: currentGurantor?.guarantorName || '',
      email: currentGurantor?.email || '',
      phoneNumber: currentGurantor?.phoneNumber || currentGurantor?.phone || '',
      cin: currentGurantor?.cin || '',
      guarantorAmountLimit:
        currentGurantor?.guarantorAmountLimit || currentGurantor?.GaurantorAmountLimit || '',
      guarantorType: currentGurantor?.guarantorType || 'Corporate',
      fullName: currentGurantor?.fullName || '',
      estimetedNetWorth: currentGurantor?.estimetedNetWorth || '',
      panNumber: currentGurantor?.panNumber || '',
      adharNumber: currentGurantor?.adharNumber || '',
      // Preserve file objects if editing
      adharCardFile: currentGurantor?.adharCardFile || null,
      panCardFile: currentGurantor?.panCardFile || null,
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

  // const getFileId = (fileValue) => {
  //   if (!fileValue) return null;

  //   // Existing file (edit mode)
  //   if (fileValue.id) return fileValue.id;

  //   // Newly uploaded file
  //   if (fileValue.files?.length > 0) {
  //     return fileValue.files[0]?.id || null;
  //   }

  //   return null;
  // };

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     const usersId = sessionStorage.getItem('trustee_user_id');

  //     if (!usersId) {
  //       enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
  //       return;
  //     }

  //     const panCardFileId = getFileId(data.panCard);
  //     const boardResolutionFileId = getFileId(data.boardResolution);

  //     if (!panCardFileId && !isEditMode) {
  //       enqueueSnackbar('PAN card is required', { variant: 'error' });
  //       return;
  //     }

  //     if (!boardResolutionFileId && !isEditMode) {
  //       enqueueSnackbar('Board Resolution is required', { variant: 'error' });
  //       return;
  //     }

  //     const isCustom = data.role === 'OTHER';

  //     const payload = {
  //       usersId,
  //       signatory: {
  //         fullName: data.name,
  //         email: data.email,
  //         phone: data.phoneNumber,

  //         // Extracted PAN details (from OCR)
  //         extractedPanFullName: extractedPan?.extractedPanFullName || '',
  //         extractedPanNumber: extractedPan?.extractedPanNumber || '',
  //         extractedDateOfBirth: extractedPan?.extractedDateOfBirth || '',

  //         // Submitted PAN details (after human check / edit)
  //         submittedPanFullName: data.submittedPanFullName,
  //         submittedPanNumber: data.submittedPanNumber,
  //         submittedDateOfBirth: data.submittedDateOfBirth,

  //         panCardFileId,
  //         boardResolutionFileId,
  //         designationType: isCustom ? 'custom' : 'dropdown',
  //         designationValue: isCustom
  //           ? data.customDesignation
  //           : ROLES.find((r) => r.value === data.role)?.label || data.role,
  //       },
  //     };

  //     const res = await axiosInstance.post('/trustee-profiles/kyc-authorize-signatory', payload);

  //     if (res?.data?.success) {
  //       enqueueSnackbar('Signatory added successfully', { variant: 'success' });
  //       onSuccess?.(payload.signatory);
  //       onClose();
  //     } else {
  //       enqueueSnackbar(res?.data?.message || 'Something went wrong', {
  //         variant: 'error',
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     enqueueSnackbar('Failed to add signatory', { variant: 'error' });
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    // Store full form data including file objects
    const payload = {
      guarantorName: data.guarantorName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      phone: data.phoneNumber, // Alias for compatibility
      cin: data.cin || '',
      guarantorType: data.guarantorType,
      guarantorAmountLimit: Number(data.guarantorAmountLimit),
      GaurantorAmountLimit: Number(data.guarantorAmountLimit), // For table display
      fullName: data.fullName,
      estimetedNetWorth: Number(data.estimetedNetWorth),
      panNumber: data.panNumber,
      adharNumber: data.adharNumber,
      // Store full file objects
      panCardFile: data.panCardFile || null,
      adharCardFile: data.adharCardFile || null,
    };

    onSubmitSuccess?.(payload);
    reset(); // Reset form after submission
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, currentGurantor, defaultValues, reset]);

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
          <DialogTitle sx={{ p: 0 }}>
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
            {/* Row 1 */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="guarantorName"
                label="Name*"
                InputLabelProps={{ shrink: true }}
              // disabled={isViewMode}
              />
            </Grid>

            {selectedGuarantorType === 'Corporate' && (
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="cin"
                  label="CIN*"
                  InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="phoneNumber"
                label="Phone Number*"
                inputProps={{ maxLength: 10 }}
                // disabled={isViewMode}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="guarantorType"
                label="Guarantor Type*"
                // disabled={isViewMode}
                InputLabelProps={{ shrink: true }}
              >
                {guarantorType.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFPriceField
                name="guarantorAmountLimit"
                label="Guaranteed Amount Limit*"
                InputLabelProps={{ shrink: true }}
              // disabled={isViewMode}
              />
            </Grid>

            {/* Row 4 */}
            <Grid item xs={12} md={6}>
              <RHFPriceField
                name="estimetedNetWorth"
                label="Estimated Net Worth*"
                InputLabelProps={{ shrink: true }}
              // disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="fullName"
                label="Full Name* (as per PAN)"
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              // disabled={isViewMode}
              />
            </Grid>

            {/* Row 5 */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="panNumber"
                label="PAN Number*"
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 10 }}
              // disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="adharNumber"
                label="Aadhaar Number*"
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 12 }}
              // disabled={isViewMode}
              />
            </Grid>

            {/* Full width uploads */}
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
