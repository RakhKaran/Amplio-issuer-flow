import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  Stack,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFTextField, RHFSelect, RHFCustomFileUploadBox } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import KYCFooter from './kyc-footer';
import { useGetKycAddressDetails } from 'src/api/companyKyc';

export default function KYCAddressDetails({
  percent,
  setActiveStepId,
  dataInitializedSteps,
  setDataInitializedSteps,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registeredAddress, correspondenceAddress, addressDetailsLoading } = useGetKycAddressDetails();
  const [registeredAddressData, setRegisteredAddressData] = useState(null);
  const [correspondenceAddressData, setCorrespondenceAddressData] = useState(null);

  const AddressSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select document type'),
    registeredAddressLine1: Yup.string().required('Required'),
    registeredAddressLine2: Yup.string(),
    registeredCountry: Yup.string().required('Required'),
    registeredCity: Yup.string().required('Required'),
    registeredState: Yup.string().required('Required'),
    registeredPincode: Yup.string().required('Required').matches(/^[0-9]+$/, 'Invalid'),
    sameAsRegistered: Yup.boolean(),
    correspondenceAddressLine1: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondenceAddressLine2: Yup.string(),
    correspondenceCountry: Yup.string().required('Required'),
    correspondenceCity: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondenceState: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondencePincode: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required').matches(/^[0-9]{6}$/, 'Invalid'),
    }),
    addressProof: Yup.mixed().required('Required'),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: registeredAddressData?.documentType || 'electricity_bill',
      registeredAddressLine1: registeredAddressData?.addressLineOne || '',
      registeredAddressLine2: registeredAddressData?.addressLineTwo || '',
      registeredCountry: registeredAddressData?.country || 'India',
      registeredCity: registeredAddressData?.city || '',
      registeredState: registeredAddressData?.state || '',
      registeredPincode: registeredAddressData?.pincode || '',
      sameAsRegistered:
        !!registeredAddressData &&
        !!correspondenceAddressData &&
        registeredAddressData.addressLineOne === correspondenceAddressData.addressLineOne &&
        registeredAddressData.city === correspondenceAddressData.city &&
        registeredAddressData.state === correspondenceAddressData.state &&
        registeredAddressData.pincode === correspondenceAddressData.pincode,
      correspondenceAddressLine1: correspondenceAddressData?.addressLineOne || '',
      correspondenceAddressLine2: correspondenceAddressData?.addressLineTwo || '',
      correspondenceCountry: correspondenceAddressData?.country || 'India',
      correspondenceCity: correspondenceAddressData?.city || '',
      correspondenceState: correspondenceAddressData?.state || '',
      correspondencePincode: correspondenceAddressData?.pincode || '',
      addressProof: registeredAddressData?.addressProof || null,
    }),
    [registeredAddressData, correspondenceAddressData]
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(AddressSchema),
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;

  const values = watch();
  const sameAsRegistered = watch('sameAsRegistered');
  const documentType = useWatch({ control, name: 'documentType' });

  useEffect(() => {
    if (sameAsRegistered) {
      setValue('correspondenceAddressLine1', watch('registeredAddressLine1'));
      setValue('correspondenceAddressLine2', watch('registeredAddressLine2'));
      setValue('correspondenceCountry', watch('registeredCountry'));
      setValue('correspondenceCity', watch('registeredCity'));
      setValue('correspondenceState', watch('registeredState'));
      setValue('correspondencePincode', watch('registeredPincode'));
    }
  }, [sameAsRegistered, setValue, watch]);

  const calculatePercent = useCallback(() => {
    const requiredFields = [
      'registeredAddressLine1',
      'registeredCity',
      'registeredState',
      'registeredPincode',
      'addressProof',
      ...(values.sameAsRegistered
        ? []
        : [
          'correspondenceAddressLine1',
          'correspondenceCity',
          'correspondenceState',
          'correspondencePincode',
        ]),
    ];

    let valid = 0;
    requiredFields.forEach((field) => {
      if (values[field] && !errors[field]) valid += 1;
    });
    return Math.round((valid / requiredFields.length) * 100);
  }, [values, errors]);

  useEffect(() => {
    percent(calculatePercent());
  }, [calculatePercent, percent]);

  const onSubmit = async (form) => {
    try {
      const usersId = sessionStorage.getItem('company_user_id');
      if (!usersId) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', { variant: 'error' });
        return;
      }

      setIsSubmitting(true);

      const registeredAddressPayload = {
        addressType: 'registered',
        addressLineOne: form.registeredAddressLine1,
        addressLineTwo: form.registeredAddressLine2 || null,
        country: form.registeredCountry,
        city: form.registeredCity,
        state: form.registeredState,
        pincode: form.registeredPincode,
        documentType: form.documentType,
        addressProofId: form.addressProof?.id,
      };

      const correspondenceAddressPayload = {
        addressType: 'correspondence',
        addressLineOne: form.sameAsRegistered
          ? form.registeredAddressLine1
          : form.correspondenceAddressLine1,
        addressLineTwo: form.sameAsRegistered
          ? form.registeredAddressLine2 || null
          : form.correspondenceAddressLine2 || null,
        country: form.sameAsRegistered ? form.registeredCountry : form.correspondenceCountry,
        city: form.sameAsRegistered ? form.registeredCity : form.correspondenceCity,
        state: form.sameAsRegistered ? form.registeredState : form.correspondenceState,
        pincode: form.sameAsRegistered ? form.registeredPincode : form.correspondencePincode,
        documentType: form.documentType,
        addressProofId: form.addressProof?.id,
      };

      let res;

      if (registeredAddress) {
        res = await axiosInstance.patch('/company-profiles/kyc-address-details', {
          usersId,
          registeredAddress: registeredAddressPayload,
          correspondenceAddress: correspondenceAddressPayload,
        });
      } else {
        res = await axiosInstance.post('/company-profiles/kyc-address-details', {
          usersId,
          registeredAddress: registeredAddressPayload,
          correspondenceAddress: correspondenceAddressPayload,
        });
      }
      enqueueSnackbar('Address details saved successfully', {
        variant: 'success',
      });
      percent(100);
      setActiveStepId();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to save address', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if ((registeredAddress || correspondenceAddress) && !addressDetailsLoading) {
      if (registeredAddress) setRegisteredAddressData(registeredAddress);
      if (correspondenceAddress) setCorrespondenceAddressData(correspondenceAddress);
    }
  }, [registeredAddress, correspondenceAddress, addressDetailsLoading]);

  useEffect(() => {
    if (registeredAddressData) {
      reset(defaultValues);
      if (!dataInitializedSteps?.includes('kyc_address_details')) {
        setDataInitializedSteps();
        setActiveStepId();
      }
    }
  }, [
    registeredAddressData,
    reset,
    defaultValues,
    dataInitializedSteps,
    setDataInitializedSteps,
    setActiveStepId,
  ]);

  return (
    <Container>
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
        <Stack spacing={0.5} alignItems="flex-start" sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#206CFE', textAlign: 'left' }}>
            Address Details
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, color: '#000000', textAlign: 'left' }}>
            Add your registered and correspondence address details.
          </Typography>
        </Stack>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant="h6">Upload Address Proof</Typography>
              <Box sx={{ width: 260 }}>
                <RHFSelect name="documentType" label="Document Type">
                  <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                  <MenuItem value="lease_agreement">Lease Agreement</MenuItem>
                </RHFSelect>
              </Box>

              <RHFCustomFileUploadBox
                name="addressProof"
                label={`Upload ${(documentType === 'electricity_bill' && 'Electricity Bill') ||
                  (documentType === 'lease_agreement' && 'Lease Agreement')
                  }`}
                icon="mdi:file-document-outline"
              />
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Registered Address
                </Typography>

                <Stack spacing={2}>
                  <RHFTextField name="registeredAddressLine1" label="Address Line 1" />
                  <RHFTextField name="registeredAddressLine2" label="Address Line 2" />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <RHFTextField name="registeredCountry" label="Country" disabled />
                    <RHFTextField name="registeredCity" label="City" />
                    <RHFTextField name="registeredState" label="State" />
                  </Box>
                  <RHFTextField name="registeredPincode" label="Pincode" />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">Correspondence Address</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sameAsRegistered}
                        onChange={(e) => setValue('sameAsRegistered', e.target.checked)}
                      />
                    }
                    label="Same as Registered"
                  />
                </Box>

                <Stack spacing={2} sx={{ opacity: sameAsRegistered ? 0.5 : 1 }}>
                  <RHFTextField
                    name="correspondenceAddressLine1"
                    label="Address Line 1"
                    disabled={sameAsRegistered}
                  />
                  <RHFTextField
                    name="correspondenceAddressLine2"
                    label="Address Line 2"
                    disabled={sameAsRegistered}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <RHFTextField name="correspondenceCountry" label="Country" disabled />
                    <RHFTextField
                      name="correspondenceCity"
                      label="City"
                      disabled={sameAsRegistered}
                    />
                    <RHFTextField
                      name="correspondenceState"
                      label="State"
                      disabled={sameAsRegistered}
                    />
                  </Box>
                  <RHFTextField
                    name="correspondencePincode"
                    label="Pincode"
                    disabled={sameAsRegistered}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                Next
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </Card>
      <KYCFooter />
    </Container>
  );
}

KYCAddressDetails.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
};
