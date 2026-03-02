import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Card } from '@mui/material';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
  RHFCustomFileUploadBox,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useGetCompanyEntityTypes } from 'src/api/entityType';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useGetKycProgress } from 'src/api/companyKyc';
import { useGetCompanySectorTypes } from 'src/api/sectorType';
import Logo from 'src/components/logo';
import { NewCompanyBasicInfo } from 'src/forms-autofilled-script/kyb-script/newkyb';
import { indianStates } from 'src/_mock/_state';

// ----------------------------------------------------------------------

export default function KYCBasicInfo() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const storedProfileId = sessionStorage.getItem('company_user_id');

  const sessionId = localStorage.getItem('sessionId');
  const { kycProgress, profileId: fetchedProfileId } = useGetKycProgress(sessionId);

  const profileId = storedProfileId || fetchedProfileId;
  console.log('KYCBasicInfo profileId:', profileId);

  const [panExtractionStatus, setPanExtractionStatus] = useState('idle'); // 'idle' | 'success' | 'failed'
  const [extractedPanDetails, setExtractedPanDetails] = useState(null);
  const [skipPanExtractionOnce, setSkipPanExtractionOnce] = useState(false);

  // State to store mapped API values
  const [entityOptions, setEntityOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const { EntityTypes, EntityTypesEmpty } = useGetCompanyEntityTypes();
  const { SectorTypes, SectorTypesEmpty } = useGetCompanySectorTypes();

  const [humanInteraction, setHumanInteraction] = useState({
    companyName: false,
    gstin: false,
    dateOfIncorporation: false,
    msmeUdyamRegistrationNo: false,
    city: false,
    state: false,
    country: false,
    panNumber: false,
    panHoldersName: false,
  });

  const handleHumanInteraction = (fieldName) => {
    if (!humanInteraction[fieldName]) {
      setHumanInteraction((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  const NewUserSchema = Yup.object().shape({
    cin: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, 'Invalid CIN format')
      .required('CIN is required'),
    companyName: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required('Company Name is required')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    gstin: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
        'Invalid GSTIN format'
      )
      .required('GSTIN is required'),
    dateOfIncorporation: Yup.date().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string().matches(
      /^$|^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/,
      'Invalid MSME/Udyam format'
    ),
    // .required('MSME Udyam Registration No is required')
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    panFile: Yup.mixed().required('PAN file is required'),
    panNumber: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN Number is required'),
    panHoldersName: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required("PAN Holder's Name is required")
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    companyEntityTypeId: Yup.string().required('Entity Type is required'),
    companySectorTypeId: Yup.string().required('Sector Type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      cin: '',
      companyName: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      city: '',
      state: '',
      country: 'India',
      panFile: null,
      panNumber: '',
      panHoldersName: '',
      panCardDocumentId: '',
      companyEntityTypeId: '',
      companySectorTypeId: '',
      humanInteraction: { ...humanInteraction },
    }),
    [humanInteraction]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  console.log('values', values);
  const panFile = useWatch({
    control: methods.control,
    name: 'panFile',
  });

  const isPanUploaded = Boolean(panFile?.id);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || '';

      const dateOfIncorporationStr = formData.dateOfIncorporation
        ? dayjs(formData.dateOfIncorporation).format('YYYY-MM-DD')
        : '';
      // Detect if user changed PAN fields manually
      let humanEdited = false;

      if (extractedPanDetails) {
        humanEdited =
          extractedPanDetails.extractedCompanyName !== formData.panHoldersName ||
          extractedPanDetails.extractedPanNumber !== formData.panNumber;
      }

      // Build extracted PAN object
      const extractedPan = extractedPanDetails
        ? {
          extractedCompanyName: extractedPanDetails.extractedCompanyName || '',
          extractedPanNumber: extractedPanDetails.extractedPanNumber || '',
        }
        : undefined;

      // Build submitted PAN object
      const submittedPan = humanEdited
        ? {
          submittedCompanyName: formData.panHoldersName,
          submittedPanNumber: formData.panNumber,
        }
        : {
          submittedCompanyName: formData.panHoldersName,
          submittedPanNumber: formData.panNumber,
        };

      // FINAL API PAYLOAD — 100% MATCHES THE API FORMAT YOU GAVE
      const payload = {
        sessionId,
        companyName: formData.companyName,
        CIN: formData.cin,
        GSTIN: formData.gstin,
        udyamRegistrationNumber: formData.msmeUdyamRegistrationNo,
        dateOfIncorporation: dateOfIncorporationStr,
        cityOfIncorporation: formData.city,
        stateOfIncorporation: formData.state,
        countryOfIncorporation: formData.country,

        humanInteraction: humanEdited ? true : false,

        extractedPanDetails: extractedPan,
        submittedPanDetails: submittedPan,

        panCardDocumentId: formData.panFile.id,
        companyEntityTypeId: formData.companyEntityTypeId,
        companySectorTypeId: formData.companySectorTypeId,
      };

      console.log('FINAL Company Registration Payload:', payload);

      const response = await axiosInstance.post('/auth/company-registration', payload);

      if (response?.data?.success) {
        const usersId = response?.data?.usersId;

        // ✅ Store it so next page can access it
        if (usersId) {
          sessionStorage.setItem('company_user_id', usersId);
        } else {
          console.warn('No usersId found in /company-registration response');
        }
        enqueueSnackbar(response.data.message || 'Company Registration Successful', {
          variant: 'success',
        });

        reset();
        router.push(paths.auth.kyc.companyKyc);
      } else {
        throw new Error(response?.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

  const existingPAN = useMemo(() => {
    const p = kycProgress?.profile?.companyPanCards;
    if (!p || !p.panCardDocument) return null;

    return {
      name: p.panCardDocument.fileOriginalName,
      url: p.panCardDocument.fileUrl,
      status: p.status,
    };
  }, [kycProgress]);

  useEffect(() => {
    if (fetchedProfileId) {
      sessionStorage.setItem('company_profile_id', fetchedProfileId);
    }
  }, [fetchedProfileId]);

  useEffect(() => {
    if (EntityTypes && !EntityTypesEmpty) {
      const allowedTypes = [
        'private_limited_company',
        'llp',
        'public_ltd_company',
        'partnership_firm',
        'sole_proprietorship',
        'opc'
      ];

      const filtered = EntityTypes.filter((item) => allowedTypes.includes(item.value));

      setEntityOptions(filtered);
    } else {
      setEntityOptions([]);
    }
  }, [EntityTypes, EntityTypesEmpty]);

  useEffect(() => {
    if (SectorTypes && !SectorTypesEmpty) {
      setSectorOptions(SectorTypes);
    } else {
      setSectorOptions([]);
    }
  }, [SectorTypes, SectorTypesEmpty]);

  useEffect(() => {
    if (kycProgress?.profile) {
      const p = kycProgress.profile;

      reset({
        cin: p.CIN || '',
        companyName: p.companyName || '',
        gstin: p.GSTIN || '',
        dateOfIncorporation: p.dateOfIncorporation ? dayjs(p.dateOfIncorporation).toDate() : null,
        msmeUdyamRegistrationNo: p.udyamRegistrationNumber || '',
        city: p.cityOfIncorporation || '',
        state: p.stateOfIncorporation || '',
        country: p.countryOfIncorporation || 'India',
        // PAN fields — your GET API does NOT return them
        panFile: p?.companyPanCards?.panCardDocument?.fileUrl || null,
        panCardDocumentId: p?.companyPanCards?.panCardDocumentId || '',

        panNumber:
          p?.companyPanCards?.submittedPanNumber || p?.companyPanCards?.extractedPanNumber || '',

        panHoldersName:
          p?.companyPanCards?.submittedCompanyName ||
          p?.companyPanCards?.extractedCompanyName ||
          '',

        companyEntityTypeId: p?.companyEntityTypeId || '',
        companySectorTypeId: p?.companySectorTypeId || '',
      });
      if (p?.companyPanCards?.panCardDocument) {
        const serverFile = {
          fileOriginalName: p.companyPanCards.panCardDocument.fileOriginalName,
          fileUrl: p.companyPanCards.panCardDocument.fileUrl,
          id: p.companyPanCards.panCardDocument.id,
          fileType: p.companyPanCards.panCardDocument.fileType,
          isServerFile: true,
        };

        setValue('panFile', serverFile, { shouldValidate: true });

        // Also hydrate extractedPanDetails for humanEdited comparison
        setExtractedPanDetails({
          extractedCompanyName:
            p?.companyPanCards?.extractedCompanyName ||
            p?.companyPanCards?.submittedCompanyName ||
            '',
          extractedPanNumber:
            p?.companyPanCards?.extractedPanNumber || p?.companyPanCards?.submittedPanNumber || '',
        });
      }
    }
  }, [kycProgress, reset, setValue]);

  useEffect(() => {
    if (!panFile?.id) return;
    if (skipPanExtractionOnce) {
      setSkipPanExtractionOnce(false);
      return;
    }

    const extractPanDetails = async () => {
      try {
        setPanExtractionStatus('loading');

        const response = await axiosInstance.post('/extract/pan-info', {
          fileId: panFile.id,
        });

        const data = response?.data?.data || {};

        const panNumber = data?.extractedPanNumber;
        const panName = data?.extractedPanHolderName;

        if (!panNumber && !panName) {
          setPanExtractionStatus('failed');
          enqueueSnackbar("Couldn't extract PAN details. Please fill manually.", {
            variant: 'error',
          });
          return;
        }

        if (panName) {
          setValue('panHoldersName', panName, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        if (panNumber) {
          setValue('panNumber', panNumber, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        setPanExtractionStatus('success');
        enqueueSnackbar('PAN details extracted successfully', {
          variant: 'success',
        });
      } catch (error) {
        console.error(error);
        setPanExtractionStatus('failed');
        enqueueSnackbar('Unable to extract PAN details. Please fill manually.', {
          variant: 'error',
        });
      }
    };

    extractPanDetails();
  }, [panFile?.id, skipPanExtractionOnce]);

  const handleAutoFill = async () => {
    const autoData = NewCompanyBasicInfo();

    const applyValue = (name, value) =>
      setValue(name, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

    applyValue('cin', autoData.cin);
    applyValue('companyName', autoData.companyName);
    applyValue('gstin', autoData.gstin);
    applyValue('dateOfIncorporation', autoData.dateOfIncorporation);
    applyValue('msmeUdyamRegistrationNo', autoData.msmeUdyamRegistrationNo);
    applyValue('city', autoData.city);
    
    const stateObj = indianStates.find(
      (s) => s.label === autoData.state
    );
    applyValue('state', stateObj ? stateObj.value : '');
    applyValue('country', autoData.country);
    applyValue('panNumber', autoData.panNumber);
    applyValue('panHoldersName', autoData.companyName);

    if (!getValues('companyEntityTypeId') && entityOptions.length > 0) {
      applyValue('companyEntityTypeId', entityOptions[0].id);
    }

    if (!getValues('companySectorTypeId') && sectorOptions.length > 0) {
      applyValue('companySectorTypeId', sectorOptions[0].id);
    }

    try {
      const fileName = 'financial_statement_year_1.pdf';
      const response = await fetch(`/pdfs/kyb/${fileName}`);
      if (!response.ok) {
        enqueueSnackbar('Autofill data applied, but PAN document upload failed', {
          variant: 'warning',
        });
        return;
      }

      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axiosInstance.post('/files', formData);
      const uploadedFile = uploadRes?.data?.files?.[0] || null;

      if (!uploadedFile?.id) {
        enqueueSnackbar('Autofill data applied, but PAN document upload failed', {
          variant: 'warning',
        });
        return;
      }

      setSkipPanExtractionOnce(true);
      applyValue('panFile', uploadedFile);
      setExtractedPanDetails({
        extractedCompanyName: autoData.companyName,
        extractedPanNumber: autoData.panNumber,
      });

      enqueueSnackbar('Autofill completed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Autofill data applied, but PAN document upload failed', {
        variant: 'warning',
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* <KYCTitle
      title="Basic Information"
      subtitle="Please provide your company details to proceed"
    /> */}

      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
        }}
      >
        <Logo />
      </Box>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 600,
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
            src="/assets/images/kyc/kyc-basic-info/kyb-img.svg"
            alt="background"
            sx={{
              position: 'absolute',
              right: 0,
              bottom: '10%',
              height: '100%',
              width: '100%',
              opacity: 0.1,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          {/* CONTENT WRAPPER */}
          <Box sx={{ position: 'relative', zIndex: 10 }}>
            {/* TITLE */}
            <Stack spacing={0.5} alignItems="flex-start" sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#206CFE',
                  textAlign: 'left',
                }}
              >
                Company Basic Information
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: '#000000',
                  textAlign: 'left',
                }}
              >
                Please provide your company details to proceed
              </Typography>
            </Stack>

            {/* 3 Fields in One Row */}
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <RHFTextField
                  name="cin"
                  label="CIN *"
                  placeholder="Enter CIN"
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          bgcolor: 'primary.main',
                          color: 'white',
                          ml: 1,
                        }}
                        onClick={async () => {
                          const cin = getValues('cin');
                          if (!cin) {
                            enqueueSnackbar('Enter CIN first.', { variant: 'warning' });
                            return;
                          }
                          try {
                            const res = await axiosInstance.post('/extraction/company-info', {
                              CIN: cin,
                            });
                            const data = res?.data?.data;
                            if (res.data.success && data) {
                              setValue('companyName', data.companyName || '');
                              setValue('gstin', data.gstin || '');
                              setValue(
                                'dateOfIncorporation',
                                data.dateOfIncorporation ? new Date(data.dateOfIncorporation) : null
                              );
                              setValue('city', data.cityOfIncorporation || '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              setValue('state', data.stateOfIncorporation || '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              setValue('country', data.countryOfIncorporation || 'India', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              enqueueSnackbar('CIN details fetched!', { variant: 'success' });
                            }
                          } catch (err) {
                            enqueueSnackbar('Unable to fetch CIN details', { variant: 'error' });
                          }
                        }}
                      >
                        Fetch
                      </Button>
                    ),
                  }}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField
                  name="companyName"
                  label="Legal Entity Name *"
                  placeholder="Company Name"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFSelect name="companyEntityTypeId" label="Company Type *">
                  <MenuItem value="">Select Entity Type</MenuItem>
                  {entityOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid xs={12} md={4}>
                <Controller
                  name="dateOfIncorporation"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date of Incorporation *"
                      format="dd/MM/yyyy"
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
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

              <Grid xs={12} md={4}>
                <RHFTextField name="gstin" label="GSTIN *" placeholder="Enter GSTIN" />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFSelect name="companySectorTypeId" label="Sector Type *">
                  <MenuItem value="">Select Sector Type</MenuItem>
                  {sectorOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField name="city" label="City of Incorporation*" placeholder="City" />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFSelect name="state" label="State of Incorporation*">
                  <MenuItem value="" disabled>
                    Select State
                  </MenuItem>

                  {indianStates.map((state) => (
                    <MenuItem key={state.id} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              {/* COUNTRY + ENTITY TYPE */}
              <Grid xs={12} md={4}>
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  readOnly
                  options={['India']}
                  getOptionLabel={(o) => o}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField
                  name="msmeUdyamRegistrationNo"
                  label="MSME / Udyam No."
                  placeholder="Enter MSME Number"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>
              PAN Details
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <RHFCustomFileUploadBox
                  name="panFile"
                  label="Upload PAN Card *"
                  icon="mdi:file-document-outline"
                  accept={{
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                    'application/pdf': ['.pdf'],
                  }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField
                  name="panNumber"
                  label="PAN Number *"
                  placeholder="Enter PAN Number"
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField
                  name="panHoldersName"
                  label="PAN Holder Name *"
                  placeholder="Enter Name"
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
            </Grid>

            {/* SUBMIT BUTTON */}
            <Box textAlign="center" sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 6,
                  py: 1.6,
                  fontWeight: 600,
                  borderRadius: 1,
                }}
                onClick={handleAutoFill}
              >
                Autofill
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                loading={isSubmitting}
                sx={{
                  px: 6,
                  py: 1.6,
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              >
                Save & Continue
              </LoadingButton>
            </Box>
          </Box>
        </Card>

        <KYCFooter />
      </FormProvider>
    </Container>
  );
}
