import { Card, Typography, Grid, Box, Button, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import FormProvider, { RHFTextField, RHFSelect } from "src/components/hook-form";
import RHFFileUploadBox from "src/components/custom-file-upload/file-upload";
import { useEffect, useMemo } from "react";

const documents = [
    { label: "NDA", value: "nda" },
    { label: "Contract Form", value: "contract" },

]

export default function ExecuteDocument({ currentDocument }) {
    const schema = Yup.object().shape({
        selectDocument: Yup.string().required("Document selection is required"),
        companyLegalName: Yup.string().required("Company legal name is required"),
        cin: Yup.string().required("CIN is required"),
        registeredAddress: Yup.string().required("Registered address is required"),
        authorizedSignatory: Yup.string().required("Signatory name required"),
        designation: Yup.string().required("Designation required"),
        purposeOfIssue: Yup.string().required("Purpose is required"),
        boardResolution: Yup.mixed().required("Upload is required"),
    });


    const defaultValues = useMemo(
        () => ({
            selectDocument: currentDocument?.selectDocument || "",
            companyLegalName: currentDocument?.companyLegalName || "",
            cin: currentDocument?.cin || "",
            registeredAddress: currentDocument?.registeredAddress || "",
            authorizedSignatory: currentDocument?.authorizedSignatory || "",
            designation: currentDocument?.designation || "",
            purposeOfIssue: currentDocument?.purposeOfIssue || "",
            boardResolution: currentDocument?.boardResolution || null,
        }),
        [currentDocument]
    );


    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = handleSubmit(async (formData) => {
        console.log("SUBMITTED FORM DATA:", formData);
    });

    useEffect(() => {
        if (currentDocument) {
            reset(defaultValues)
        }
    }, [currentDocument, defaultValues, reset])


    return (
        <FormProvider methods={methods} onSubmit={(onSubmit)}>
            <Box sx={{ p: 3 }}>
                <Card sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Execute Documents
                    </Typography>

                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
                        Sign to make documents legally binding.
                    </Typography>

                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6}>
                            <RHFSelect name='selectDocument' label="Required" fullWidth>
                                {documents.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
                                Issuer Information
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 2 }} variant="body2">
                                Provide key company and authorization details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name="companyLegalName" label="Company Legal Name *" placeholder="Enter legal name" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name="cin" label="CIN *" placeholder="Corporate Identification Number" />
                        </Grid>

                        <Grid item xs={12}>
                            <RHFTextField
                                name="registeredAddress"
                                label="Registered Address *"
                                placeholder="Enter complete registered address"
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name="authorizedSignatory" label="Authorized Signatory Name *" placeholder="Full name" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <RHFTextField name="designation" label="Designation *" placeholder="e.g., Managing Director" />
                        </Grid>

                        <Grid item xs={12}>
                            <RHFTextField
                                name="purposeOfIssue"
                                label="Purpose of Issue *"
                                placeholder="Describe purpose"
                                multiline
                                rows={3}
                            />
                        </Grid>

                        {/* File Upload */}
                        <Grid item xs={12}>
                            <RHFFileUploadBox
                                name="boardResolution"
                                label="Board Resolution Upload *"
                                icon="mdi:file-document-outline"
                                maxSizeMB={10}
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                        <Button variant="outlined">Back</Button>
                        <Button type="submit" variant="contained" sx={{ px: 4 }}>
                            Next
                        </Button>
                    </Box>

                </Card>
            </Box>
        </FormProvider>
    );
}


