import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';

export default function SanctionLetter({ document, onNext }) {
  const [loading, setLoading] = useState(false);

  const SanctionSchema = Yup.object().shape({
    remark: Yup.string().max(500, 'Maximum 500 characters'),
    agreement: Yup.boolean().oneOf([true], 'You must accept the agreement'),
  });

  const defaultValues = {
    remark: '',
    agreement: false,
  };

  const methods = useForm({
    resolver: yupResolver(SanctionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      console.log('Calling API...');

      const response = await axiosInstance.patch('/business-kyc/agreements', {
        agreementId: document.id,
        isAccepted: true,
        reason: formData.remark || '',
      });
      enqueueSnackbar('Agreement accepted successfully', {
        variant: 'success',
      });

      onNext?.();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to accept agreement1', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" color="primary">
            Sanction Letter Preview
          </Typography>
        </Box>
        <Card sx={{ p: 4, mt: 2, height: '75vh' }}>
          <Box
            component="iframe"
            src={document?.pdfUrl}
            width="100%"
            height="100%"
            sx={{ border: 'none' }}
          />
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5"> Request Changes / Remarks</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column">
              <RHFTextField
                name="remark"
                label="Remark"
                placeholder="Remark (optional) the changes you want in the section letter (limit, company, details, terms, etc.)"
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Maximum 500 characters
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="agreement"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: 'primary.lighter',
                    borderRadius: 1.5,
                    border: errors.agreement ? '1px solid #d32f2f' : '1px solid #cfd8dc',
                    px: 2,
                    py: 1.2,
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <Box>
                        <Typography fontWeight={600}>
                          I have read and agree to the Platform Agreement
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          I authorize escrow-based settlements and acknowledge the key terms above.
                        </Typography>
                      </Box>
                    }
                  />

                  {errors.agreement && (
                    <FormHelperText error>{errors.agreement.message}</FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              {/* <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: 'primary.dark',
                    borderColor: 'primary.dark',
                    boxShadow: 'none',
                  },
                }}
              >
                Submit Remarks
              </Button> */}

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 4, borderRadius: 2, backgroundColor: 'primary.main' }}
                disabled={!isValid || loading}
              >
                {loading ? 'Processing...' : 'Next'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}

SanctionLetter.propTypes = {
  onNext: PropTypes.func,
  document: PropTypes.object,
};
