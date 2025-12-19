// import { useEffect, useMemo, useState } from 'react';
// import * as Yup from 'yup';
// import { useForm, FormProvider } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   Grid,
//   Button,
//   Typography,
//   MenuItem,
//   Card,
// } from '@mui/material';
// import { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
// import { LoadingButton } from '@mui/lab';

// import axiosInstance from 'src/utils/axios';
// import { useSnackbar } from 'src/components/snackbar';
// import { useGetRoles } from 'src/api/role';
// import DocumentFormPreview from './document-form-preview';
// import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hook';
// import slugify from 'slugify';

// /* ------------------------------------------------------------------ */
// /* HELPERS */
// /* ------------------------------------------------------------------ */
// const generateId = () => Math.random().toString(36).substring(2, 10);

// const fieldTypes = [
//   { label: 'Text', value: 'text' },
//   { label: 'Select', value: 'select' },
//   { label: 'Section', value: 'section' },
//   { label: 'Upload', value: 'upload' },
// ];

// /* ------------------------------------------------------------------ */
// /* VALIDATION */
// /* ------------------------------------------------------------------ */
// const DocumentFormSchema = Yup.object({
//   name: Yup.string().required('Document name is required'),
//   description: Yup.string(),
//   roles: Yup.array()
//     .of(Yup.object().required())
//     .min(1, 'Please select at least one role'),
//   fileTemplate: Yup.object().required('Please upload template file'),
//   formFields: Yup.array()
//     .of(
//       Yup.object({
//         id: Yup.string().required(),
//         label: Yup.string().required('Label is required'),
//         value: Yup.string().required('Value is required'),
//         type: Yup.string()
//           .oneOf(['text', 'select', 'section', 'upload'])
//           .required(),

//         required: Yup.boolean().when('type', {
//           is: (v) => v !== 'section',
//           then: (s) => s.required(),
//           otherwise: (s) => s.strip(),
//         }),

//         options: Yup.array().when('type', {
//           is: 'select',
//           then: (s) =>
//             s
//               .of(
//                 Yup.object({
//                   id: Yup.string().required(),
//                   option: Yup.string().required(),
//                   value: Yup.string().required(),
//                   nestedFields: Yup.array(),
//                 }),
//               )
//               .min(1, 'At least one option required'),
//           otherwise: (s) => s.strip(),
//         }),

//         childFields: Yup.array(),
//       }),
//     )
//     .min(1, 'At least one field is required'),
// });

// /* ------------------------------------------------------------------ */
// /* NORMALIZER (BACKEND COMPATIBLE) */
// /* ------------------------------------------------------------------ */
// const normalizeFields = (fields, base = 1) =>
//   fields.map((f, i) => ({
//     ...f,
//     sortOrder: base + i,
//     options:
//       f.options?.map((o, oi) => ({
//         ...o,
//         sortOrder: oi + 1,
//         nestedFields: o.nestedFields
//           ? normalizeFields(o.nestedFields)
//           : [],
//       })) || [],
//     childFields: f.childFields
//       ? normalizeFields(f.childFields)
//       : [],
//   }));

// /* ------------------------------------------------------------------ */
// /* RECURSIVE FORM RENDERER */
// /* ------------------------------------------------------------------ */
// function FormRenderer({
//   data,
//   parentPath,
//   setValue,
// }) {
//   if (!data?.length) return null;

//   const update = (newData) =>
//     setValue('formFields', newData, { shouldValidate: true });

//   return data.map((field, index) => {
//     const path = `${parentPath}[${index}]`;

//     return (
//       <Card key={field.id} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={2}>
//             <RHFSelect name={`${path}.type`} label="Field Type">
//               {fieldTypes.map((t) => (
//                 <MenuItem key={t.value} value={t.value}>
//                   {t.label}
//                 </MenuItem>
//               ))}
//             </RHFSelect>
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <RHFTextField name={`${path}.label`} label="Label" />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <RHFTextField name={`${path}.value`} label="Value" />
//           </Grid>

//           {field.type !== 'section' && (
//             <Grid item xs={12} md={2}>
//               <RHFSelect name={`${path}.required`} label="Required">
//                 <MenuItem value={true}>Required</MenuItem>
//                 <MenuItem value={false}>Optional</MenuItem>
//               </RHFSelect>
//             </Grid>
//           )}

//           <Grid item xs={12} md={2}>
//             <Button
//               color="error"
//               onClick={() => update(data.filter((_, i) => i !== index))}
//             >
//               Remove
//             </Button>
//           </Grid>

//           {/* SELECT OPTIONS */}
//           {field.type === 'select' &&
//             field.options?.map((opt, optIndex) => {
//               const optPath = `${path}.options[${optIndex}]`;

//               return (
//                 <Grid
//                   container
//                   key={opt.id}
//                   spacing={2}
//                   sx={{ pl: 2, mt: 1 }}
//                 >
//                   <Grid item xs={4}>
//                     <RHFTextField
//                       name={`${optPath}.option`}
//                       label="Option"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <RHFTextField
//                       name={`${optPath}.value`}
//                       label="Value"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Button
//                       color="error"
//                       onClick={() => {
//                         const newData = data.map((f, fi) =>
//                           fi !== index
//                             ? f
//                             : {
//                               ...f,
//                               options: f.options.filter(
//                                 (_, oi) => oi !== optIndex,
//                               ),
//                             },
//                         );
//                         update(newData);
//                       }}
//                     >
//                       Remove Option
//                     </Button>
//                   </Grid>

//                   {/* NESTED FIELDS */}
//                   {opt.nestedFields?.length > 0 && (
//                     <FormRenderer
//                       data={opt.nestedFields}
//                       parentPath={`${optPath}.nestedFields`}
//                       setValue={setValue}
//                     />
//                   )}

//                   {fieldTypes.map((t) => (
//                     <Grid item xs={3} key={t.value}>
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           const newField = {
//                             id: generateId(),
//                             label: '',
//                             type: t.value,
//                             required: t.value !== 'section',
//                             options:
//                               t.value === 'select'
//                                 ? [
//                                   {
//                                     id: generateId(),
//                                     option: '',
//                                     value: '',
//                                     nestedFields: [],
//                                   },
//                                 ]
//                                 : [],
//                           };

//                           const newData = data.map((f, fi) => {
//                             if (fi !== index) return f;
//                             return {
//                               ...f,
//                               options: f.options.map((o, oi) =>
//                                 oi !== optIndex
//                                   ? o
//                                   : {
//                                     ...o,
//                                     nestedFields: [
//                                       ...o.nestedFields,
//                                       newField,
//                                     ],
//                                   },
//                               ),
//                             };
//                           });

//                           update(newData);
//                         }}
//                       >
//                         + {t.label}
//                       </Button>
//                     </Grid>
//                   ))}
//                 </Grid>
//               );
//             })}

//           {field.type === 'select' && (
//             <Button
//               sx={{ mt: 2 }}
//               onClick={() => {
//                 const newData = data.map((f, fi) =>
//                   fi !== index
//                     ? f
//                     : {
//                       ...f,
//                       options: [
//                         ...f.options,
//                         {
//                           id: generateId(),
//                           option: '',
//                           value: '',
//                           nestedFields: [],
//                         },
//                       ],
//                     },
//                 );
//                 update(newData);
//               }}
//             >
//               + Add Option
//             </Button>
//           )}
//         </Grid>
//       </Card>
//     );
//   });
// }

// const mapFormFieldsFromApi = (fields = []) =>
//   fields.map((f) => ({
//     id: f.id,
//     label: f.label,
//     value: f.value,
//     type: f.type,
//     required: f.required ?? false,
//     options:
//       f.options?.map((o) => ({
//         id: o.id,
//         option: o.option,
//         value: o.value,
//         nestedFields: mapFormFieldsFromApi(o.nestedFields || []),
//       })) || [],
//     childFields: mapFormFieldsFromApi(f.childFields || []),
//   }));


// /* ------------------------------------------------------------------ */
// /* MAIN COMPONENT */
// /* ------------------------------------------------------------------ */
// export default function AdminDocumentFormBuilder({ currentDocumentWithForm }) {
//   const { enqueueSnackbar } = useSnackbar();
//   const { roles, rolesLoading } = useGetRoles();
//   const [rolesData, setRolesData] = useState([]);
//   const [previewMode, setPreviewMode] = useState(false);
//   const router = useRouter();

//   const handlePreviewClick = () => {
//     setPreviewMode(true);
//   }

//   const defaultValues = useMemo(
//     () => ({
//       name: currentDocumentWithForm?.name || '',
//       description: currentDocumentWithForm?.description || '',
//       roles: currentDocumentWithForm?.roles || [],
//       fileTemplate: currentDocumentWithForm?.fileTemplate || null,
//       formFields: currentDocumentWithForm?.form?.fields
//         ? mapFormFieldsFromApi(currentDocumentWithForm.form.fields)
//         : [],
//     }),
//     [currentDocumentWithForm],
//   );

//   console.log('defaultValues', defaultValues);

//   const methods = useForm({
//     resolver: yupResolver(DocumentFormSchema),
//     defaultValues,
//     mode: 'onChange',
//   });

//   const { watch, setValue, reset, handleSubmit, formState: { isSubmitting, errors } } = methods;
//   const values = watch();

//   console.log('errors', errors);

//   useEffect(() => {
//     if (roles && !rolesLoading) setRolesData(roles);
//   }, [roles, rolesLoading]);

//   const onSubmit = async (data) => {
//     const payload = {
//       name: data.name,
//       value: slugify(data.name, { lower: true, strict: true }),
//       description: data.description,
//       roles: data.roles.map((role) => role.id),
//       fileTemplateId: data.fileTemplate.id,
//       form: {
//         fields: normalizeFields(data.formFields),
//       },
//     };

//     try {
//       await axiosInstance.post('/document-types', payload);
//       enqueueSnackbar('Document created successfully');
//       router.push(paths.dashboard.document.list);
//     } catch {
//       enqueueSnackbar('Something went wrong', { variant: 'error' });
//     }
//   };

//   const handleDrop = async (acceptedFiles) => {
//     try {
//       console.log(acceptedFiles);
//       if (!acceptedFiles || acceptedFiles.length === 0) return;

//       const file = acceptedFiles[0];

//       enqueueSnackbar('Uploading File...', { variant: 'info' });

//       console.log('file', file);
//       const uploadFormData = new FormData();
//       uploadFormData.append('file', file);

//       const uploadRes = await axiosInstance.post('/files', uploadFormData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       console.log('upload res', uploadRes);

//       setValue('fileTemplate', uploadRes?.data?.files[0], { shouldValidate: true });

//     } catch (err) {
//       enqueueSnackbar('File upload failed', { variant: 'error' });
//     }
//   };

//   useEffect(() => {
//     if (currentDocumentWithForm) {
//       reset(defaultValues);
//     }
//   }, [currentDocumentWithForm, defaultValues, reset]);

//   return (
//     <Card sx={{ p: 4 }}>
//       {!previewMode ? (
//         <FormProvider {...methods}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <RHFAutocomplete
//                 name="roles"
//                 label="Roles"
//                 placeholder="Select roles"
//                 multiple
//                 options={rolesData}
//                 getOptionLabel={(option) => option?.label || ''}
//                 isOptionEqualToValue={(option, value) => option.id === value.id}
//                 renderOption={(props, option) => (
//                   <li {...props} key={option.id}>
//                     {option.label}
//                   </li>
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <RHFTextField name="name" label="Document Name" />
//             </Grid>

//             <Grid item xs={12}>
//               <RHFTextField
//                 name="value"
//                 label="Document Value"
//                 value={slugify(values.name || '', { lower: true })}
//                 disabled
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <RHFTextField
//                 name="description"
//                 label="Description"
//                 multiline
//                 rows={3}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <RHFFileUploadBox
//                 name="fileTemplate"
//                 label={'Upload template'}
//                 acceptedTypes=""
//                 maxSizeMB={10}
//                 onDrop={async (acceptedFiles) => handleDrop(acceptedFiles)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">Form Fields</Typography>
//               <FormRenderer
//                 data={values.formFields}
//                 parentPath="formFields"
//                 setValue={setValue}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography>Add Field</Typography>
//               <Grid container spacing={2}>
//                 {fieldTypes.map((t) => (
//                   <Grid item xs={3} key={t.value}>
//                     <Button
//                       fullWidth
//                       variant="contained"
//                       onClick={() =>
//                         setValue(
//                           'formFields',
//                           [
//                             ...values.formFields,
//                             {
//                               id: generateId(),
//                               label: '',
//                               type: t.value,
//                               required: t.value !== 'section',
//                               options:
//                                 t.value === 'select'
//                                   ? [
//                                     {
//                                       id: generateId(),
//                                       option: '',
//                                       value: '',
//                                       nestedFields: [],
//                                     },
//                                   ]
//                                   : [],
//                             },
//                           ],
//                           { shouldValidate: true },
//                         )
//                       }
//                     >
//                       + {t.label}
//                     </Button>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>

//             <Grid item xs={12} sx={{ display: 'flex', gap: '10px', justifyContent: 'end' }}>
//               <Button disabled={!values.fileTemplate || values.formFields.length === 0} type='button' variant='contained' onClick={() => handlePreviewClick()}>Preview</Button>
//               <LoadingButton
//                 variant="contained"
//                 loading={isSubmitting}
//                 onClick={handleSubmit(onSubmit)}
//               >
//                 Save Document
//               </LoadingButton>
//             </Grid>
//           </Grid>
//         </FormProvider>
//       ) : (
//         <DocumentFormPreview fields={values.formFields || []} fileTemplateId={values?.fileTemplate?.id} setPreview={setPreviewMode} />
//       )}
//     </Card>
//   );
// }
