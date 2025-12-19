import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import * as Yup from "yup";
export default function BasicFinancialDetails({ currentBasicFinancialDetails }) {

    const basicFinancialDetailsSchemas = Yup.object().shape({
        issueName: Yup.string().required("Issue name is required"),
        seriesTrancheNo: Yup.string().required("Tranches no. is required"),
        issueSize: Yup.string().required("Issue size is required"),
        faceValuePerDebenture: Yup.string().required("Face value as per debenture is required"),
        issueType: Yup.string().required("Issue Type is required"),
        issueOpeningDate: Yup.string().required("Issue opening date is required"),
        issueClosingDate: Yup.string().required("Issue closing date is required"),
        dateOfAllotment: Yup.string().required("Date of allotment is required"),
        tenure: Yup.string().required("Tenure is required"),
        maturityDate: Yup.string().required("Maturity/Redemption date is required"),
        listingExchange: Yup.string().required("Listing exchange is required"),
        creditRating: Yup.string().required("Credit rating is required"),
        ratingAgency: Yup.string().required("Rating agency is required"),
        couponRate: Yup.string().required("Coupon/Interest rate (%) is required"),
        interestPaymentFrequencey: Yup.string().required("Interest payment frequencey is required"),
        purposeOfIssue: Yup.string().required("Purpose of issue is required")
    })

    const defaultValues = useMemo(() => ({
        issueName: currentBasicFinancialDetails?.issueName || "",
        seriesTrancheNo: currentBasicFinancialDetails?.seriesTrancheNo || "",
        issueSize: currentBasicFinancialDetails?.issueSize || "",
        faceValuePerDebenture: currentBasicFinancialDetails?.faceValuePerDebenture || "",
        issueType: currentBasicFinancialDetails?.issueType || "",
        issueOpeningDate: currentBasicFinancialDetails?.issueOpeningDate || "",
        issueClosingDate: currentBasicFinancialDetails?.issueClosingDate || "",
        dateOfAllotment: currentBasicFinancialDetails?.dateOfAllotment || "",
        tenure: currentBasicFinancialDetails?.tenure || "",
        maturityDate: currentBasicFinancialDetails?.maturityDate || "",
        listingExchange: currentBasicFinancialDetails?.listingExchange || "",
        creditRating: currentBasicFinancialDetails?.creditRating || "",
        ratingAgency: currentBasicFinancialDetails?.ratingAgency || "",
        couponRate: currentBasicFinancialDetails?.couponRate || "",
        interestPaymentFrequencey: currentBasicFinancialDetails?.interestPaymentFrequencey || "",
        purposeOfIssue: currentBasicFinancialDetails?.purposeOfIssue || "",
    }),
        [currentBasicFinancialDetails]
    );

    const methods = useForm({
        resolver: yupResolver(basicFinancialDetailsSchemas),
        defaultValues,
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = handleSubmit(async (data) => {
        console.log("Submited form data", data)
    });

    useEffect(() => {
        if (currentBasicFinancialDetails) {
            reset(defaultValues)
        }
    }, [currentBasicFinancialDetails, defaultValues, reset])


    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box sx={{ p: 3 }}>
                <Card sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                        Basic Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <RHFTextField name="issueName" label="Issue Name *" placeholder="Enter Issue Name" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RHFTextField name="seriesTrancheNo" label="Series Tranche No *" placeholder="Enter Series Tranche No" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RHFTextField name="issueSize" label="Issue Size *" placeholder="Enter Issue Size" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RHFTextField name="faceValuePerDebenture" label="Face Value Per Debenture *" placeholder="Face Value Per Debenture" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RHFTextField name="issueType" label="Issue Type *" placeholder="Enter Issue Type" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DatePicker name="issueOpeningDate" label="Issue Opening Date *" placeholder="Issue Opening Date" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DatePicker name="issueClosingDate" label="Issue Closing Date *" placeholder="Issue Closing Date" />
                        </Grid>

                    </Grid>
                </Card>
            </Box>
        </FormProvider>
    )
}