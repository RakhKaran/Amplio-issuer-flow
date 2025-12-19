import React, { useMemo } from 'react';
import {
    Box,
    Grid,
    Typography,
    Divider,
    MenuItem,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import FormProvider, {
    RHFTextField,
    RHFSelect,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

const groupFieldsBySection = (fields = []) => {
    const sections = [];
    let currentSection = null;

    fields.forEach((field) => {
        if (field.type === 'section') {
            currentSection = {
                id: field.id,
                label: field.label,
                fields: [],
            };
            sections.push(currentSection);
        } else {
            if (!currentSection) {
                currentSection = {
                    id: 'default',
                    label: 'Details',
                    fields: [],
                };
                sections.push(currentSection);
            }
            currentSection.fields.push(field);
        }
    });

    return sections;
};

const buildYupSchema = (fields = []) => {
    const shape = {};

    fields.forEach((field) => {
        if (field.type === 'section') return;

        let schema = Yup.string();

        if (field.type === 'select') {
            schema = Yup.string().oneOf(
                field.options?.map((o) => o.value) || []
            );
        }

        if (field.required) {
            schema = schema.required(`${field.label} is required`);
        }

        shape[field.value] = schema;
    });

    return Yup.object().shape(shape);
};

function SectionCard({ section }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
                {section.label}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                {section.fields.map((field) => (
                    <Grid item xs={12} md={6} key={field.id}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {field.label}
                            {field.required && (
                                <Typography component="span" color="error">
                                    {' '}*
                                </Typography>
                            )}
                        </Typography>

                        {field.type === 'text' && (
                            <RHFTextField
                                name={field.value}
                                fullWidth
                                placeholder={field.label}
                            />
                        )}

                        {field.type === 'select' && (
                            <RHFSelect name={field.value} fullWidth>
                                {field.options?.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.value}>
                                        {opt.option}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        )}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default function DocumentFormPreview({
    fields = [],
    setPreview,
    fileTemplateId,
}) {

     const router = useRouter();

    const sections = useMemo(
        () => groupFieldsBySection(fields),
        [fields]
    );

    const schema = useMemo(
        () => buildYupSchema(fields),
        [fields]
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {},
        mode: 'onSubmit',
    });

    const { handleSubmit } = methods;


    const downloadDocx = (blobData, filename) => {
        const url = window.URL.createObjectURL(
            new Blob([blobData], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            })
        );

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const onSubmit = async (values) => {
        const placeholders = Object.entries(values).map(
            ([key, value]) => ({
                label: key,
                value: String(value ?? ''),
            })
        );

        const payload = {
            fileTemplateId,
            placeholders,
        };

        console.log('payload', payload);

        const response = await axiosInstance.post(
            '/document-drafting/new-document',
            payload,
            {
                responseType: 'blob',
            }
        );

        downloadDocx(response.data, 'generated-document.docx');
        // enqueueSnackbar('Document generated successfully', { variant: 'success' });
        // router.push(paths.dashboard.documentDrafting.list)
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Document Form Preview
            </Typography>

            {sections.length === 0 ? (
                <Typography color="text.secondary">
                    No fields configured
                </Typography>
            ) : (
                sections.map((section) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                    />
                ))
            )}

            <Box sx={{ textAlign: 'right', mt: 3 }}>
                <Button
                    onClick={() => setPreview(false)}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    type="submit"
                >
                    Generate Document
                </Button>
            </Box>
        </FormProvider>
    );
}
