import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useParams } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function FundPosition({ currentFundPosition, setPercent, setProgress }) {
    const params = useParams();
    const { applicationId } = params;
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
            const response = await axiosInstance.patch(`/bond-estimations/fund-positions/${applicationId}`, data);
            if (response.data.success) {
                setProgress(true);
                enqueueSnackbar('Fund position saved', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error while updating fund position in bond estimations :', error);
        }
    });

    const calculatePercent = () => {
        let completed = 0;

        if (values.cashBalance) completed++;
        if (values.cashBalanceDate) completed++;
        if (values.bankBalance) completed++;
        if (values.bankBalanceDate) completed++;

        const percentVal = (completed / 4) * 50; // 50% weight for this section

        setPercent?.(percentVal);
    };

    useEffect(() => {
        calculatePercent();
    }, [values]);

    useEffect(() => {
        if (currentFundPosition) {
            reset(defaultValues);
            setProgress(true);
        }
    }, [currentFundPosition, defaultValues, reset, setProgress]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
                <Typography variant="h3" sx={{ color: '#1565c0', fontWeight: 600 }}>
                    Fund Position
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Add and manage your borrowing information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <RHFTextField name="cashBalance" label="Cash Balance as on Date" fullWidth />
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
                        <RHFTextField name="bankBalance" label="Bank Balance as on Date" fullWidth />
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
                    <LoadingButton type="submit" loading={isSubmitting} variant="contained" sx={{ color: '#fff' }}>
                        Save
                    </LoadingButton>
                </Box>
            </Card>
        </FormProvider>
    )
}

FundPosition.propTypes = {
    currentFundPosition: PropTypes.object,
    setPercent: PropTypes.func,
    setProgress: PropTypes.func
}