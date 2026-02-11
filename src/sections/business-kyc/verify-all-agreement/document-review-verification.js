import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Checkbox,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const DOCUMENTS = [
  {
    title: 'ROC Charge Filing Details',
    status: 'Approved',
    fields: [
      { label: 'Service Request Number (SRN)', value: 'ZP454544453' },
      { label: 'Filing Date', value: '02/01/2026' },
      { label: 'ROC charge filing acknowledge', value: '—' },
    ],
  },
  {
    title: 'Backup Security',
    status: 'Approved',
    fields: [
      { label: 'Service Request Number (SRN)', value: 'HDFCS8421' },
      { label: 'Bank Name', value: 'HDFC BANK' },
      { label: 'Date', value: '01/01/2026' },
      { label: 'Amount', value: '₹50,00,000' },
    ],
  },
  {
    title: 'Platform Agreement',
    status: 'E-Sign',
    fields: [
      { label: 'Agreement Type', value: 'Master Service Buyer base agreement' },
      { label: 'Signed Via', value: 'E-Sign' },
    ],
  },
  {
    title: 'Sanction Letter',
    status: 'Signed',
    fields: [
      { label: 'Facility Type', value: 'Invoice Discounting / Factoring' },
      { label: 'Sanction Limit', value: '₹10,00,000' },
      { label: 'Tenor', value: '90 Days per invoice' },
      { label: 'Signed Date', value: '02 Jan 2026' },
    ],
  },
  {
    title: 'Guarantor Execution',
    status: 'Signed',
    fields: [
      { label: 'Guarantor Type', value: 'Corporate' },
      { label: 'Execution Location', value: 'Mumbai' },
      { label: 'Execution Date', value: '10 Jan 2026' },
    ],
  },
  {
    title: 'Deed of Hypothecation',
    status: 'E-Sign',
    fields: [
      { label: 'Security', value: 'Book debts & receivables' },
      { label: 'Charge Type', value: 'First Charge' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function DocumentReviewAndVerification() {
  const ReviewSubmitSchema = Yup.object().shape({
    consent: Yup.boolean().oneOf([true], 'You must confirm before submitting'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReviewSubmitSchema),
    defaultValues: {
      consent: false,
    },
  });


  const onSubmit = () => {
    console.log('Review submitted');
    // router.push(paths.kyc.invoiceFinancing.pending)
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={1} color="primary" textAlign="center">
        Document Review & Confirmation
      </Typography>

      <Typography variant="subtitle1" mb={3} color="primary" textAlign="center">
        Please review all information before submitting your application
      </Typography>

      {DOCUMENTS.map((doc, index) => (
        <Accordion key={index} defaultExpanded={index === 0}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '12px 0',
                mr: 2,
              },
              '& .MuiAccordionSummary-content.Mui-expanded': {
                margin: '12px 0',
                mr: 2,
              },
            }}
          >
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {doc.title}
              </Typography>
              <Chip
                size="small"
                label={doc.status}
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#00AB59',
                  borderColor: '#00AB59',
                }}
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={1}>
              {doc.fields.map((item, idx) => (
                <Grid container key={idx}>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} textAlign="right">
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Declaration & Consent
        </Typography>

        <Box
          sx={{
            maxWidth: 720,
            width: '100%',
          }}
        >
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <>
                <Box display="flex" alignItems="flex-start">
                  <Checkbox {...field} checked={field.value} sx={{ mt: 2 }} />

                  <Typography variant="body2">
                    I confirm that the ROC charge filing and backup security details provided above
                    are accurate and I authorize BirbalPlus to proceed with verification, filing,
                    and processing as required for this application.
                  </Typography>
                </Box>

                {errors.consent && (
                  <Typography variant="caption" color="error" sx={{ ml: 4.5, mt: 0.5 }}>
                    {errors.consent.message}
                  </Typography>
                )}
              </>
            )}
          />
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            sx={{ px: 4 }}
          >
            Submit for Review
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
