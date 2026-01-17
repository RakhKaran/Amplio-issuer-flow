import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

// components
import FormProvider, { RHFTextField, RHFCustomFileUploadBox } from 'src/components/hook-form';
import { Grid, IconButton, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

// --------------------------------------------------
// Yup Schema
// --------------------------------------------------

const ClientBusinessProfileSchema = Yup.object().shape({
  name: Yup.string().required('Business name is required'),
  cin: Yup.string().required('CIN is required'),
  gstin: Yup.string().required('GSTIN is required'),
  turnover: Yup.number().typeError('Turnover must be a number').required('Turnover is required'),
  avgCreditDays: Yup.number()
    .typeError('Average credit days must be a number')
    .required('Average credit days is required'),
  relationship: Yup.string().required('Relationship is required'),
  avgInvoiceSize: Yup.number()
    .typeError('Average invoice size must be a number')
    .required('Average invoice size is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  invoice: Yup.mixed().required('Invoice is required'),
});

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function ClientBusinessProfileForm({ open, onClose, onSubmitSuccess, defaultData }) {
  const defaultValues = useMemo(
    () => ({
      name: defaultData?.name || '',
      cin: defaultData?.cin || '',
      gstin: defaultData?.gstin || '',
      turnover: defaultData?.turnover || '',
      avgCreditDays: defaultData?.avgCreditDays || '',
      relationship: defaultData?.relationship || '',
      avgInvoiceSize: defaultData?.avgInvoiceSize || '',
      contactDetails: defaultData?.contactDetails || '',
      invoice: defaultData?.invoice || null,
    }),
    [defaultData]
  );

  const methods = useForm({
    resolver: yupResolver(ClientBusinessProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // --------------------------------------------------
  // Submit Handler
  // --------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    const invoiceFileId = data.invoice?.id || data.invoice?.files?.[0]?.id;

    const payload = {
      name: data.name,
      cin: data.cin,
      gstin: data.gstin,
      turnover: Number(data.turnover),
      avgCreditDays: Number(data.avgCreditDays),
      relationship: data.relationship,
      avgInvoiceSize: Number(data.avgInvoiceSize),
      contactDetails: data.contactDetails,
      invoiceFileId,
    };

    onSubmitSuccess(payload);
    onClose();
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack direction="row" display="flex" justifyContent="space-between">
          <DialogTitle>Add new Client</DialogTitle>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
          >
            <Iconify icon="mingcute:close-line" width={22} />
          </IconButton>
        </Stack>

        <DialogContent>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="name" label="Client Name*" placeholder="Enter client name" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="cin" label="CIN*" placeholder="U12345H2025PTC000111" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="gstin" label="GSTIN*" placeholder="Enter GSTIN" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="turnover"
                label="Turnover (CR)*"
                type="number"
                placeholder="Enter amount"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="avgCreditDays"
                label="Average Credit Days*"
                type="number"
                placeholder="Enter days"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="relationship" label="Relationship*" />
            </Grid>

            {/* Row 4 */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="avgInvoiceSize"
                label="Average Invoice Size*"
                type="number"
                placeholder="Enter invoice size"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="contactDetails"
                label="Contact Details*"
                placeholder="Enter contact number"
              />
            </Grid>

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="invoice"
                label="Upload Invoice*"
                fileType="invoice"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Save & Continue
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ClientBusinessProfileForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  defaultData: PropTypes.object,
};
