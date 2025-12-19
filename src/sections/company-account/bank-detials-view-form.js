// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

// components
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useForm, useWatch } from 'react-hook-form';

// sections
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const documentOptions = [
  { label: 'Cheque', value: 0 },
  { label: 'Bank Statement', value: 1 },
]

export default function BankDetialsViewForm({ bankDetails }) {
  const router = useRouter();
  const navigate = useNavigate();

  // ---------------- VALIDATION ----------------
  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().required('Address proof is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.number().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      documentType: '0',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'CURRENT',
      addressProof: null,
      accountHolderName: '',
      bankAddress: '',
    },
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const documentType = useWatch({ control, name: 'documentType' });

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('addressProof', file, { shouldValidate: true });
    }
  };

  const existingProof = bankDetails?.bankAccountProof
    ? {
      id: bankDetails.bankAccountProof.id,
      name: bankDetails.bankAccountProof.fileOriginalName,
      url: bankDetails.bankAccountProof.fileUrl,
      status: bankDetails.status === 1 ? 'approved' : 'pending',
      isServerFile: true,
    }
    : null;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const proofFile = data.addressProof;
      let uploadedProofId = null;

      if (proofFile) {
        const fd = new FormData();
        fd.append('file', proofFile);

        const uploadRes = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedProofId = uploadRes?.data?.files?.[0]?.id;

        if (!uploadedProofId) {
          enqueueSnackbar('Failed to upload address proof', { variant: 'error' });
          return;
        }
      }

      const payload = {
        bankDetails: {
          bankName: data.bankName,
          bankShortCode: data.bankShortCode,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          bankAddress: data.bankAddress,
          accountType: data.accountType === 'CURRENT' ? 1 : 0,
          accountHolderName: data.accountHolderName,
          accountNumber: String(data.accountNumber),
          bankAccountProofType: Number(data.documentType),
          bankAccountProofId: uploadedProofId,
        },
      };

      console.log('📤 FINAL BANK PAYLOAD:', payload);

      const res = await axiosInstance.post('/company-profiles/bank-details', payload);

      if (res?.data?.success) {
        enqueueSnackbar('Bank details submitted successfully!', { variant: 'success' });
        router.push(paths.dashboard.company.profile);
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit bank details', { variant: 'error' });
    }
  });

  const requiredFields = ['addressProof', 'bankName', 'branchName', 'accountNumber', 'ifscCode'];

  const errors = methods.formState.errors;

  const calculatePercent = () => {
    let valid = 0;
    requiredFields.forEach((field) => {
      const value = values[field];
      if (value && !errors[field]) valid++;
    });
    return Math.round((valid / requiredFields.length) * 100);
  };

  const percent = calculatePercent();

  useEffect(() => {
    if (bankDetails) {
      reset({
        documentType: bankDetails.bankAccountProofType ?? 0,
        bankName: bankDetails.bankName || '',
        branchName: bankDetails.branchName || '',
        accountNumber: bankDetails.accountNumber || '',
        ifscCode: bankDetails.ifscCode || '',
        accountType: bankDetails.accountType === 1 ? 'CURRENT' : 'SAVINGS',
        addressProof: null,
        accountHolderName: bankDetails.accountHolderName || '',
        bankAddress: bankDetails.bankAddress || '',
        bankShortCode: bankDetails.bankShortCode || '',
      });
    }
  }, [bankDetails, reset]);

  return (
    <Container>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Select Document Type:
          </Typography>

          <Box sx={{ width: 200, mb: 3 }}>
            <RHFSelect name="documentType" label="Document Type" disabled={true} sx={{ width: 200 }}>
              {documentOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

          </Box>

          {/* ---------------- ADDRESS PROOF UPLOAD ---------------- */}
          {/* <RHFFileUploadBox
            name="addressProof"
            label={`Upload ${documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}`}
            icon="mdi:file-document-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
            existing={existingProof}
            onDrop={(files) => handleDrop(files)}
          /> */}
              <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    mb: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                      Check  Uploaded PanCard :
                                    </Typography>
                                </Box>

                                {bankDetails?.bankAccountProof?.fileUrl ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        
                                        startIcon={<Iconify icon="mdi:eye" />}
                                        sx={{
                                            height: 36,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                        onClick={() => window.open(bankDetails.bankAccountProof.fileUrl, '_blank')}
                                    >
                                        Preview Document
                                    </Button>
                                ) : (
                                    <Typography color="text.secondary">No file uploaded.</Typography>
                                )}
                            </Box>
                        </Box>

          {/* ---------------- BANK FIELDS ---------------- */}
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={9}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <RHFTextField
                      name="ifscCode"
                      label="IFSC Code"
                      disabled={true}
                      placeholder="Enter IFSC Code"
                      InputProps={{
                        endAdornment: (
                          <LoadingButton
                            variant="contained"
                            disabled={true}
                            loading={isSubmitting}
                            size="small"
                            sx={{
                              ml: 1,
                              bgcolor: '#00328A',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '6px',
                              minHeight: '32px',
                              px: 2,
                              '&:hover': { bgcolor: '#002670' },
                            }}
                            onClick={async () => {
                              const ifsc = getValues('ifscCode');

                              if (!ifsc) {
                                enqueueSnackbar('Please enter IFSC Code first', {
                                  variant: 'warning',
                                });
                                return;
                              }

                              try {
                                const res = await axiosInstance.get(
                                  `/bank-details/get-by-ifsc/${ifsc}`
                                );

                                const data = res?.data?.bankDetails;

                                if (!data) {
                                  enqueueSnackbar('No bank details found', { variant: 'error' });
                                  return;
                                }

                                // Autofill form values
                                setValue('bankName', data.bankName || '');
                                setValue('branchName', data.branchName || '');
                                setValue('bankShortCode', data.bankShortCode || '');
                                setValue('bankAddress', data.bankAddress || '');
                                setValue('city', data.city || '');
                                setValue('state', data.state || '');
                                setValue('district', data.district || '');

                                enqueueSnackbar('Bank details fetched successfully', {
                                  variant: 'success',
                                });
                              } catch (error) {
                                console.error(error);
                                enqueueSnackbar(
                                  error?.response?.data?.message || 'Invalid IFSC Code',
                                  { variant: 'error' }
                                );
                              }
                            }}
                          >
                            Fetch
                          </LoadingButton>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <RHFTextField name="bankName" label="Bank Name" disabled={true} placeholder="Enter Bank Name" />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="branchName"
                      label="Branch Name"
                      disabled={true}
                      placeholder="Enter Branch Name"
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountHolderName"
                      label="Account Holder Name"
                      disabled={true}
                      placeholder="Enter Account Holder Name"
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountNumber"
                      label="Account Number"
                      disabled={true}
                      placeholder="Enter Account Number"
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="bankAddress"
                      label="Bank Address"
                      disabled={true}
                      placeholder="Bank Address"
                      InputLabelProps={{
                        shrink: Boolean(getValues('bankAddress')),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <RHFSelect name="accountType" label="Account Type" disabled>
                      <MenuItem value="SAVINGS">Savings</MenuItem>
                      <MenuItem value="CURRENT">Current</MenuItem>
                    </RHFSelect>
                  </Box>
                  <Box>
                    <RHFTextField
                      name="bankShortCode"
                      label="Bank Short Code"
                      disabled={true}
                      placeholder="Bank Short Code"
                      InputLabelProps={{
                        shrink: Boolean(getValues('bankShortCode')),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* ---------------- FOOTER BUTTONS ---------------- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
            {/* <Button
              component={RouterLink}
              href={paths.dashboard.company.profile}
              sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
            >
              Back
            </Button> */}
            {/* <Button
              variant="outlined"
           
            >
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
              Create
            </LoadingButton> */}
          </Box>
        </Paper>


      </FormProvider>

    </Container>
  );
}


BankDetialsViewForm.propTypes = {
  bankDetails: PropTypes.object,
}