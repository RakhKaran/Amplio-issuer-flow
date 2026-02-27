import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { countries } from 'src/assets/data';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { fData } from 'src/utils/format-number';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useGetCompanyEntityTypes } from 'src/api/entityType';
import { useGetCompanySectorTypes } from 'src/api/sectorType';

// developer-provided uploaded file path (used as initial avatarUrl)
const UPLOADED_DEV_FILE = '/mnt/data/Untitled document.docx';

// ----------------------------------------------------------------------

export default function CompanyAccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [hasExistingData, setHasExistingData] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [entityOptions, setEntityOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const { EntityTypes, EntityTypesEmpty } = useGetCompanyEntityTypes();
  const { SectorTypes, SectorTypesEmpty } = useGetCompanySectorTypes();

  // ------------------------------ validation --------------------------------
  const NewUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Company Name is required'),
    gstin: Yup.string().required('GSTIN is required'),
    dateOfIncorporation: Yup.date().nullable().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string().required('MSME Udyam Registration No is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    companyEntityTypeId: Yup.string().required('Entity Type is required'),
    panNumber: Yup.string().required('Pan Number is required'),
    panHoldersName: Yup.string().required('Pan Holders Name is required'),
    companySectorTypeId: Yup.string().required('Sector is required'),
    companyLogo: Yup.object().nullable(),
    companyAbout: Yup.string(),
  });

  // ------------------------------ defaults ----------------------------------
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
      companyAbout: '',
      companyEntityTypeId: '',
      panNumber: '',
      panHoldersName: '',
      companySectorTypeId: '',
      companyLogo: null,
      hasExistingData: hasExistingData,
    }),
    [hasExistingData]
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
    formState: { isSubmitting },
  } = methods;

  // --------------------------- fetch company info --------------------------
  useEffect(() => {
    if (EntityTypes && !EntityTypesEmpty) {
      setEntityOptions(EntityTypes);
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
    const fetchCompanyInfo = async () => {
      try {
        const response = await axiosInstance.get(`/company-profiles/me`);
        const companyData = response.data.profile;

        if (companyData) {
          reset({
            cin: companyData.CIN || '',
            companyName: companyData.companyName || '',
            gstin: companyData.GSTIN || '',
            dateOfIncorporation: companyData.dateOfIncorporation
              ? dayjs(companyData.dateOfIncorporation).toDate()
              : null,
            msmeUdyamRegistrationNo: companyData.udyamRegistrationNumber || '',
            city: companyData.cityOfIncorporation || '',
            state: companyData.stateOfIncorporation || '',
            country: companyData.countryOfIncorporation || 'India',

            companyEntityTypeId: companyData.companyEntityTypeId || '',
            companySectorTypeId: companyData.companySectorTypeId || '',

            panNumber: companyData.companyPanCards?.submittedPanNumber || '',
            panHoldersName: companyData.companyPanCards?.submittedCompanyName || '',

            companyAbout: companyData.companyAbout || '',

            companyLogo: companyData.companyLogoData || null,
          });

          setHasExistingData(true);
          if (companyData.company_id) setUserCompanyId(companyData.company_id);
        }
      } catch (error) {
        // silent fail - form stays empty (dev file used as avatar default)
        console.error('fetchCompanyInfo error', error);
      }
    };

    fetchCompanyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------- PAN extraction ------------------------------

  // --------------------------- Avatar upload (/files) ----------------------
  const handleAvatarDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setAvatarUploading(true);
        const fd = new FormData();
        fd.append('file', file);

        // Upload to your files endpoint
        const res = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploaded = res?.data?.files?.[0];
        if (uploaded?.fileUrl) {
          setValue('companyLogo', uploaded.fileUrl, { shouldValidate: true });
          enqueueSnackbar('Avatar uploaded', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to upload avatar', { variant: 'error' });
        }
      } catch (err) {
        console.error('avatar upload error', err);
        enqueueSnackbar('Avatar upload failed', { variant: 'error' });
      } finally {
        setAvatarUploading(false);
      }
    },
    [setValue, enqueueSnackbar]
  );

  // optional small dropzone wrapper for RHFUploadAvatar if you want to use useDropzone directly
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axiosInstance.post('/files', formData);

        const uploaded = data?.files?.[0];

        if (uploaded) {
          setValue('companyLogo', uploaded, { shouldValidate: true });

          console.log('Saved companyLogoId:', uploaded.id);

          enqueueSnackbar('Logo uploaded!', { variant: 'success' });
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Upload failed', { variant: 'error' });
      }
    },
    [setValue, enqueueSnackbar]
  );

  // --------------------------- submit handler -----------------------------
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        companyLogo: formData.companyLogo.id ? String(formData.companyLogo.id) : null,
        companyAbout: formData.companyAbout?.trim() || '',
      };

      const response = await axiosInstance.patch('/company-profiles/update-general-info', payload);

      if (response?.data?.success) {
        enqueueSnackbar('Company profile updated successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar(response?.data?.message || 'Update failed', { variant: 'error' });
      }
    } catch (error) {
      console.error('Update error:', error);
      enqueueSnackbar('Something went wrong. Try again.', { variant: 'error' });
    }
  });

  // --------------------------- render -------------------------------------
  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                <RHFUploadAvatar
                  name="companyLogo"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <RHFTextField name="cin" label="CIN" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="companyName" label="Company Name" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="gstin" label="GSTIN" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Controller
                      name="dateOfIncorporation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          disabled
                          label="Date Of Incorporation"
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          format="dd-MM-yyyy"
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

                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name="msmeUdyamRegistrationNo"
                      label="MSME/Udyam Registration No.*"
                      disabled
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    {/* <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}> */}
                    <RHFTextField name="city" placeholder="City" label="City Of Incorporation" disabled sx={{ flex: 1 }} />

                    {/* </Stack> */}
                  </Grid>
                  <Grid xs={12} md={6}>
                    <RHFSelect
                      name="state"
                      label="State Of Incorporation"
                      disabled
                      sx={{ flex: 1 }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    </RHFSelect>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <RHFAutocomplete
                      name="country"
                      label="Country Of Incorporation"
                      disabled
                      placeholder="Country"
                      sx={{ flex: 1 }}
                      readOnly
                      options={countries.map((c) => c.label)}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => {
                        const found = countries.find((co) => co.label === option) || {};
                        return (
                          <li {...props} key={option}>
                            <Iconify
                              icon={`circle-flags:${(found.code || '').toLowerCase()}`}
                              width={28}
                              sx={{ mr: 1 }}
                            />
                            {option}
                          </li>
                        );
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={12}>
                    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                      {/* <Box sx={{ flex: 1 }}>
                        <RHFSelect name="entityType" disabled>
                          <MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem>
                          <MenuItem value="private_limited">Private Limited</MenuItem>
                          <MenuItem value="public_limited">Public Limited</MenuItem>
                          <MenuItem value="llp">LLP</MenuItem>
                          <MenuItem value="opc">OPC</MenuItem>
                        </RHFSelect>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <RHFSelect name="sector" disabled>
                          <MenuItem value="it">IT</MenuItem>
                          <MenuItem value="banking">Banking</MenuItem>
                          <MenuItem value="infrastructure">Infrastructure</MenuItem>
                          <MenuItem value="others">Others</MenuItem>
                        </RHFSelect>
                      </Box> */}
                      <RHFSelect name="companyEntityTypeId" label="Entity Type *" disabled>
                        <MenuItem value="">Select Entity Type</MenuItem>
                        {entityOptions.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <RHFSelect name="companySectorTypeId" label="Sector Type *" disabled>
                        <MenuItem value="">Select Sector Type</MenuItem>
                        {sectorOptions.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          {/* PAN Upload */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="panNumber"
                label="PAN Number*"
                disabled
                placeholder="Your PAN Number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="panHoldersName" label="PAN Holders Name*" disabled placeholder="Enter Name as per PAN" />
            </Grid>
            <Grid item xs={12} md={12}>
              <RHFTextField
                name="companyAbout"
                label="About Seller"
                placeholder="Enter about seller"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              color='primary'
              variant="contained"
              loading={isSubmitting}
              sx={{ ml: 'auto' }}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
}

CompanyAccountGeneral.propTypes = {};
