import React, { useEffect, useMemo } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    MenuItem,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, {
    RHFSelect,
    RHFTextField,
} from 'src/components/hook-form';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { toNumber } from 'lodash';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'notistack';

const repaymentTerm = [
    { label: 'Monthly', value: 0 },
    { label: 'Yearly', value: 1 },
    { label: 'Quarterly', value: 2 },
];

const borrowingTypes = [
    { label: 'Secured', value: 'secured' },
    { label: 'Un-Secured', value: 'unsecured' },
    { label: 'Short-Term', value: 'shortterm' },
    { label: 'Long-Term', value: 'longterm' },
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
];

export default function BorrowingDetails({ currentBorrowingDetails, setPercent, setProgress }) {
    const params = useParams();
    const { applicationId } = params;
    const { enqueueSnackbar } = useSnackbar();

    const borrowingSchema = Yup.object().shape({
        borrowings: Yup.array().of(
            Yup.object().shape({
                lenderName: Yup.string().required('Lender Name is required'),
                lenderAmount: Yup.number()
                    .typeError('Lender Amount must be a number')
                    .required('Lender Amount is required'),
                repaymentTerms: Yup.number().required('Select a repayment term'),
                borrowingType: Yup.string().required('Select borrowing type'),
                interestPayment: Yup.number()
                    .typeError('Interest payment must be a number')
                    .required('Interest payment is required'),
                monthlyPrincipal: Yup.number()
                    .typeError('Monthly principal must be a number')
                    .required('Monthly principal is required'),
                monthlyInterest: Yup.number()
                    .typeError('Monthly interest must be a number')
                    .required('Monthly interest is required'),
            })
        ),
    });

    const defaultValues = useMemo(
        () => ({
            borrowings:
                currentBorrowingDetails?.length > 0
                    ? currentBorrowingDetails.map((details) => ({
                        lenderName: details?.lenderName || '',
                        lenderAmount: details?.lenderAmount ? toNumber(details?.lenderAmount) : '',
                        repaymentTerms: (details?.repaymentTerms !== null && details?.repaymentTerms !== undefined) ? details?.repaymentTerms : '',
                        borrowingType: details?.borrowingType || '',
                        interestPayment: details?.interestPayment || '',
                        monthlyPrincipal: details?.monthlyPrincipal || '',
                        monthlyInterest: details?.monthlyInterest || '',
                    }))
                    : [
                        {
                            lenderName: '',
                            lenderAmount: '',
                            repaymentTerms: '',
                            borrowingType: '',
                            interestPayment: '',
                            monthlyPrincipal: '',
                            monthlyInterest: '',
                        },
                    ],

        }),
        [currentBorrowingDetails]
    );

    const methods = useForm({
        resolver: yupResolver(borrowingSchema),
        defaultValues,
        mode: 'onSubmit',
    });

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = methods;

    const { fields, append } = useFieldArray({
        control,
        name: 'borrowings',
    });

    const handleAddBorrowing = () => {
        append({
            lenderName: '',
            lenderAmount: '',
            repaymentTerms: '',
            borrowingType: '',
            interestPayment: '',
            monthlyPrincipal: '',
            monthlyInterest: '',
        });
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                borrowingDetails: data.borrowings.map((borrowing) => ({
                    ...borrowing,
                    isActive: true
                }))
            };

            const response = await axiosInstance.patch(`/bond-estimations/borrowing-details/${applicationId}`, payload);

            if (response?.data?.success) {
                enqueueSnackbar('Borrowing details submitted', { variant: 'success' });
                setProgress(true);
            }
        } catch (error) {
            console.error('Error while submitting borrowing details form :', error);
        }
    });

    const calculateCompletion = () => {
        const borrowings = watch('borrowings') || [];

        if (!borrowings.length) {
            setPercent(0);
            setProgress(false);
            return;
        }

        let validCount = 0;

        borrowings.forEach((item) => {
            const allFilled =
                item.lenderName &&
                item.lenderAmount &&
                item.repaymentTerms !== '' &&
                item.borrowingType &&
                item.interestPayment &&
                item.monthlyPrincipal &&
                item.monthlyInterest;

            if (allFilled) validCount++;
        });

        const percentage = Math.round((validCount / borrowings.length) * 40);

        setPercent(percentage);
    };

    useEffect(() => {
        const subscription = watch(() => {
            calculateCompletion();
        });
        return () => subscription.unsubscribe();
    }, [watch("borrowings")]);

    useEffect(() => {
        if (currentBorrowingDetails && currentBorrowingDetails?.length > 0) {
            reset(defaultValues);
            setProgress(true);
        }
    }, [currentBorrowingDetails, reset, defaultValues, setProgress]);


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={3}>
                {fields.map((item, index) => (
                    <Card
                        key={item.id}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 3,
                            border: '1px solid #e0e0e0',
                        }}
                    >
                        <Typography variant="h3" fontWeight={600} color="#1874ED" mb={1}>
                            Borrowing Details
                        </Typography>
                        <Typography variant="body1" color="#5E5E5E" mb={3}>
                            Add and manage your borrowing information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <RHFTextField
                                    name={`borrowings[${index}].lenderName`}
                                    label="Lender Name"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFTextField
                                    name={`borrowings[${index}].lenderAmount`}
                                    label="Lender Amount"
                                    fullWidth
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFSelect
                                    name={`borrowings[${index}].repaymentTerms`}
                                    label="Repayment Terms"
                                    fullWidth
                                >
                                    {repaymentTerm.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFSelect
                                    name={`borrowings[${index}].borrowingType`}
                                    label="Borrowing Type"
                                    fullWidth
                                >
                                    {borrowingTypes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFTextField
                                    name={`borrowings[${index}].interestPayment`}
                                    label="Interest Payment (%)"
                                    fullWidth
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFTextField
                                    name={`borrowings[${index}].monthlyPrincipal`}
                                    label="Monthly Principal Payment"
                                    fullWidth
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <RHFTextField
                                    name={`borrowings[${index}].monthlyInterest`}
                                    label="Monthly Interest Payment"
                                    fullWidth
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </Card>
                ))}
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        onClick={handleAddBorrowing}
                        sx={{
                            background: 'linear-gradient(90deg, #1877F2 0%, #0E458C 100%)',
                            color: '#fff',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            mt: 3,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #0E458C 0%, #1877F2 100%)',
                            },
                        }}
                    >
                        + Add Another Borrowing
                    </Button>
                </Box>
                <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            loading={isSubmitting}
                            type="submit"
                            variant="contained"
                            sx={{ color: '#fff' }}
                        >
                            Save All borrowings
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    );
}

BorrowingDetails.propTypes = {
    currentBorrowingDetails: PropTypes.array,
    setPercent: PropTypes.func,
    setProgress: PropTypes.func
};
