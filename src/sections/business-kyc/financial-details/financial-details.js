import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  useGetChargeTypes,
  useGetCollateralTypes,
  useGetOwnershipTypes,
} from 'src/api/fieldOptions';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFPriceField,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function FinancialDetails({ percent, fullFinancialSection }) {
  const { enqueueSnackbar } = useSnackbar();
  const isInitialLoad = useRef(true);

  const newCollateralSchema = Yup.object().shape({
    auditedFinancials: Yup.array()
      .of(
        Yup.object().shape({
          year: Yup.string().required('Year  is required'),
          amount: Yup.string().required('Amount  is required'),

        })
      )
      .min(1, 'At least one finacial is required'),
  })

  const defaultValues = useMemo(
    () => ({
      auditedFinancials: [
        {
          year: '',
          amount: '',
        },
      ],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newCollateralSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const auditedFinancials = watch('auditedFinancials');

  const { fields, append } = useFieldArray({
    control,
    name: 'auditedFinancials',
  });

  const handleAddAsset = () => {
    append({
      year: '',
      amount: ''
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        auditedFinancials: data.auditedFinancials.map((asset) => ({
          year: asset.year,
          amount: asset.amount,

        })),
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      enqueueSnackbar('Financial details  submitted', { variant: 'success' });
    } catch (error) {
      console.error('Error while submitting financial details form:', error);
    }
  });

  const calculatePercent = (assets = []) => {
    if (!assets.length) {
      percent?.(0);
      return;
    }

    const asset = assets[0];

    const fields = [
      asset.year,
      asset.amount,
    ];

    const filled = fields.filter(Boolean).length;
    const total = fields.length;

    percent?.(Math.round((filled / total) * 100));
  };

  useEffect(() => {
    // 🚨 Skip first render
    if (isInitialLoad.current) return;
    calculatePercent(auditedFinancials);
  }, [auditedFinancials]);

  // useEffect(() => {
  //   if (currentCollateralAssets) {
  //     reset(defaultValues);
  //   }
  // }, [currentCollateralAssets, reset, defaultValues]);



  useEffect(() => {
    if (!fullFinancialSection) return;

    const apiAssets = fullFinancialSection?.auditedFinancials ?? [];


    // ✅ if API empty → keep ONE default form
    if (apiAssets.length === 0) {
      reset({
        auditedFinancials: [
          {
            year: '',
            amount: ''
          },
        ],
      });

      percent?.(0);
      isInitialLoad.current = false;
      return;
    }

    // ✅ if API has data → map & show
    const mappedAssets = apiAssets.map((asset) => ({
      year: asset.year ?? '',
      amount: asset.amount ?? '',
    }));

    reset({ auditedFinancials: mappedAssets });
    percent?.(100);

    isInitialLoad.current = false;
  }, [fullFinancialSection, reset]);


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
          <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
            Financial Details
          </Typography>
          <>
            {fields.map((field, index) => (
              <Grid container sx={{ mb: 2 }} spacing={3}>
                <Grid item xs={12} md={5}>
                  <RHFTextField
                    name={`auditedFinancials.${index}.year`}
                    label="Financial Year"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <RHFPriceField
                    name={`auditedFinancials.${index}.amount`}
                    label="Amount"
                    fullWidth
                  />
                </Grid>


                <Grid item xs={12} md={2}>
                  {index === fields.length - 1 && (
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddAsset()}
                      sx={{ color: '#fff' }}
                    >
                      + Add More
                    </Button>
                  )}
                </Grid>



              </Grid>
            ))}
          </>
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


        {/* <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
         
        </Box> */}


      </Box>
    </FormProvider>
  );
}

FinancialDetails.propTypes = {
  currentCollateral: PropTypes.object,
  percent: PropTypes.func,
  fullFinancialSection: PropTypes.object,
};

