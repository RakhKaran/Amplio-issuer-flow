import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFPriceField, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function BorrowingDetails({ currentBorrowingDetails, setPercent, setProgress, onSaved }) {
  const { enqueueSnackbar } = useSnackbar();

  const borrowingDetailsSchema = Yup.object().shape({
    secured: Yup.string().required('Secured is required'),
    unsecured: Yup.object().shape({
      fromPromoters: Yup.string().required('From promoters is required'),
      fromOthers: Yup.string().required('From others is required'),
    }),
    totalBorrowings: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      secured: currentBorrowingDetails?.secured ?? '',
      unsecured: {
        fromPromoters: currentBorrowingDetails?.unsecured?.fromPromoters ?? '',
        fromOthers: currentBorrowingDetails?.unsecured?.fromOthers ?? '',
      },
      totalBorrowings: currentBorrowingDetails?.totalBorrowings ?? '',
    }),
    [currentBorrowingDetails]
  );

  const methods = useForm({
    resolver: yupResolver(borrowingDetailsSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const secured = Number(values?.secured || 0);
    const fromPromoters = Number(values?.unsecured?.fromPromoters || 0);
    const fromOthers = Number(values?.unsecured?.fromOthers || 0);
    const total = secured + fromPromoters + fromOthers;

    setValue('totalBorrowings', total ? String(total) : '', { shouldValidate: false });
  }, [values?.secured, values?.unsecured?.fromPromoters, values?.unsecured?.fromOthers, setValue]);

  useEffect(() => {
    if (currentBorrowingDetails) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentBorrowingDetails, defaultValues, reset, setProgress]);

  useEffect(() => {
    let completed = 0;
    if (values?.secured) completed++;
    if (values?.unsecured?.fromPromoters) completed++;
    if (values?.unsecured?.fromOthers) completed++;

    const completion = Math.round((completed / 3) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        borrowingDetails: {
          secured: Number(data.secured || 0),
          unsecured: {
            fromPromoters: Number(data.unsecured?.fromPromoters || 0),
            fromOthers: Number(data.unsecured?.fromOthers || 0),
          },
          totalBorrowings: Number(data.totalBorrowings || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);

      setProgress?.(true);
      onSaved?.(payload.borrowingDetails);
      enqueueSnackbar('Borrowing details saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message || 'Something went wrong while saving borrowing details.',
        { variant: 'error' }
      );
      console.error('Error while updating borrowing details:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 0,
            mt: '0px',
          }}
        >
          <Typography variant="h5" color="primary" fontWeight="bold">
            Borrowing Details
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Add secured and unsecured borrowings
          </Typography>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <RHFPriceField name="secured" label="Secured" fullWidth />
            </Grid>
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                +
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <RHFPriceField name="unsecured.fromPromoters" label="Unsecured - Promoters" fullWidth />
            </Grid>
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                +
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <RHFPriceField name="unsecured.fromOthers" label="Unsecured - Others" fullWidth />
            </Grid>
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                =
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <RHFTextField name="totalBorrowings" label="Total Borrowings" fullWidth disabled />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main',
                  boxShadow: 'none',
                },
              }}
              color="primary"
            >
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

BorrowingDetails.propTypes = {
  currentBorrowingDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
