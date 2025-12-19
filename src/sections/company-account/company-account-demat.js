import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// components / utils (adjust paths if necessary)
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { Card } from '@mui/material';

/**
 * BankDematNewForm
 * - Keeps only Bank + Demat sections (replaced address form)
 * - Auto-fill from uploaded passbook/cheque/bank statement
 * - Verify IFSC and submit bank details
 * - Submit demat details
 */
export default function DematNewForm({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(null);
  const [showDemat, setShowDemat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const COMPANY_ID = sessionStorage.getItem('company_information_id');

  // -------------------------------------------------------
  // Validation Schema
  // -------------------------------------------------------
  const schema = Yup.object().shape({
    // Demat fields (only validated when shown)
    dpId: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('DP ID is required'),
    }),
    dpName: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('DP Name is required'),
    }),
    beneficiaryClientId: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Beneficiary/Client ID is required'),
    }),
    dematAccountNumber: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Demat Account Number is required'),
    }),
    depository: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Depository is required'),
    }),
  });

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // demat
      dpId: '',
      dpName: '',
      beneficiaryClientId: '',
      dematAccountNumber: '',
      depository: 'CDSL',
      // helper field for conditional validation
      showDemat: false,
    },
    reValidateMode: 'onChange',
  });

  const {
    setValue,
    control,
    watch,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const addressProof = useWatch({ control, name: 'addressProof' });
  const documentType = useWatch({ control, name: 'documentType' });

 
  // -------------------------------------------------------
  // Submit demat details (and optionally bank)
  // -------------------------------------------------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsUploading(true);

      // build demat payload
      const dematPayload = {
        dp_name: data.dpName,
        depository_participant: data.depository,
        dp_id: Number(data.dpId),
        demat_account_number: String(data.dematAccountNumber),
        client_id_bo_id: String(data.beneficiaryClientId),
      };

      // Post demat
      const dematRes = await axiosInstance.post(`/api/kyc/issuer_kyc/company/demat/`, dematPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      enqueueSnackbar(dematRes?.data?.message || 'Demat details submitted', { variant: 'success' });

      // Optionally navigate or call onClose
      onClose?.();
    } catch (err) {
      console.error('onSubmit error', err);
      const errMsg =
        err?.response?.data?.message || 'Submission failed. Please check details and try again.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  });

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
     <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {/* Demat fields - shown after verify */}
          <Paper
            // variant="outlined"
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Demat Account Details
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <RHFTextField name="dpId" placeholder="Enter DP ID (8 Digits)" />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField name="dpName" placeholder="DP / Broker Name" />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField name="beneficiaryClientId" placeholder="Enter Client ID / BO ID" />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField name="dematAccountNumber" placeholder="Enter Demat Account Number" />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFSelect name="depository" placeholder="Select Depository">
                  <MenuItem value="CDSL">CDSL</MenuItem>
                  <MenuItem value="NSDL">NSDL</MenuItem>
                </RHFSelect>
              </Grid>
            </Grid>
          </Paper>
        {/* Submit / buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'end' ,gap: 2 , mt: 4 }}>
          {/* <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button> */}

          <Button variant="contained" type="submit" disabled={isUploading || isSubmitting}>
            {isUploading || isSubmitting ? 'Submitting...' : 'Save'}
          </Button>

           {/* & Continue */}
        </Box>
      </Stack>
    </FormProvider>
  );
}

DematNewForm.propTypes = {
  onClose: PropTypes.func,
};
