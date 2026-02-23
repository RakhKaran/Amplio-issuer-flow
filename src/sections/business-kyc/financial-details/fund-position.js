import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFPriceField, RHFTextField } from 'src/components/hook-form';
import { useParams } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function FundPosition({
    currentFundPosition,
    setPercent,
    setProgress,
}) {
    const { enqueueSnackbar } = useSnackbar();

    const newFundPositionSchema = Yup.object().shape({
        cashBalance: Yup.string().required('Cash Balance is required'),
        bankBalance: Yup.string().required('Bank Balance is required'),
        cashBalanceDate: Yup.date()
            .nullable()
            .transform((value, originalValue) => (originalValue === '' ? null : value))
            .required('Date is required'),
        bankBalanceDate: Yup.date()
            .nullable()
            .transform((value, originalValue) => (originalValue === '' ? null : value))
            .required('Date is required'),
    });

    const defaultValues = useMemo(() => ({
        cashBalance: currentFundPosition?.cashBalance || '',
        cashBalanceDate: currentFundPosition?.cashBalanceDate ? new Date(currentFundPosition.cashBalanceDate) : null,
        bankBalance: currentFundPosition?.bankBalance || '',
        bankBalanceDate: currentFundPosition?.bankBalanceDate ? new Date(currentFundPosition.bankBalanceDate) : null,
    }), [currentFundPosition]);

    const methods = useForm({
        resolver: yupResolver(newFundPositionSchema),
        defaultValues
    });

    const {
        watch,
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                fundPosition: {
                    ...data,
                },
            };

            const response = await axiosInstance.patch('/business-kyc/financial-section', payload);

            setProgress?.(true);
            enqueueSnackbar('Fund position saved', { variant: 'success' });

        } catch (error) {
            enqueueSnackbar(
                error?.error?.message ||
                'Something went wrong while saving fund position.',
                { variant: 'error' }
            );
            console.error('Error while updating fund position in bond estimations :', error);
        }
    });

    const calculatePercent = () => {
        let completed = 0;

        if (values.cashBalance) completed++;
        if (values.cashBalanceDate) completed++;
        if (values.bankBalance) completed++;
        if (values.bankBalanceDate) completed++;

        const percentVal = (completed / 4) * 50;

        setPercent?.(percentVal);
    };

    useEffect(() => {
        calculatePercent();
    }, [values]);

    useEffect(() => {
        if (currentFundPosition) {
            reset(defaultValues);
            setProgress?.(true);
        }
    }, [currentFundPosition, defaultValues, reset]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
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
                    <Typography variant="h5" color='primary' fontWeight='bold' >
                        Fund Position
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Add and manage your borrowing information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <RHFPriceField name="cashBalance" label="Cash Balance as on Date" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Controller
                                name="cashBalanceDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        {...field}
                                        label="Cash Balance Date"
                                        value={
                                            field.value
                                                ? field.value instanceof Date
                                                    ? field.value
                                                    : new Date(field.value)
                                                : null
                                        }
                                        onChange={(newValue) => field.onChange(newValue)}
                                        format="dd/MM/yyyy"
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
                        <Grid item xs={12} md={3}>
                            <RHFPriceField name="bankBalance" label="Bank Balance as on Date" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Controller
                                name="bankBalanceDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        {...field}
                                        label="Bank Balance Date"
                                        value={
                                            field.value
                                                ? field.value instanceof Date
                                                    ? field.value
                                                    : new Date(field.value)
                                                : null
                                        }
                                        onChange={(newValue) => field.onChange(newValue)}
                                        format="dd/MM/yyyy"
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
    )
}

FundPosition.propTypes = {
    currentFundPosition: PropTypes.object,
    setPercent: PropTypes.func,
    setProgress: PropTypes.func,
}
