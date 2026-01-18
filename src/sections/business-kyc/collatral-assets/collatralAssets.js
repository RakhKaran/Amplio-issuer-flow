import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import {
//     useGetChargeTypes,
//     useGetCollateralTypes,
//     useGetOwnershipTypes,
// } from 'src/api/fieldOptions';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
// import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

// ✅ Dummy dropdown data (TEMP until API is ready)
const DUMMY_CHARGE_TYPES = [
  { id: 'ct_1', label: 'First Charge' },
  { id: 'ct_2', label: 'Second Charge' },
  { id: 'ct_3', label: 'Pari Passu Charge' },
];

const DUMMY_COLLATERAL_TYPES = [
  { id: 'col_1', label: 'Land & Building' },
  { id: 'col_2', label: 'Plant & Machinery' },
  { id: 'col_3', label: 'Inventory / Stock' },
  { id: 'col_4', label: 'Receivables' },
];

const DUMMY_OWNERSHIP_TYPES = [
  { id: 'own_1', label: 'Owned' },
  { id: 'own_2', label: 'Leased' },
  { id: 'own_3', label: 'Hypothecated' },
];

export default function CollateralAssets({ percent, setActiveStepId, currentCollateralAssets }) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  // const { chargeTypes, chargeTypesLoading } = useGetChargeTypes();
  // const { collateralTypes, collateralTypesLoading } = useGetCollateralTypes();
  // const { ownershipTypes, ownershipTypesLoading } = useGetOwnershipTypes();
  //   const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'collateral_assets');
  //   const [currentCollateralAssets, setCurrentCollateralAssets] = useState([
  //     {
  //       collateralType: '',
  //       chargeType: '',
  //       description: '',
  //       estimatedValue: '',
  //       valuationDate: null,
  //       ownershipType: '',
  //       trustName: '',
  //       securityDocRef: '',
  //       securityDocument: null,
  //       assetCoverCertificate: null,
  //       valuationReport: null,
  //       remark: '',
  //     }
  //   ]);
  const [chargeTypesData, setChargeTypesData] = useState([]);
  const [collateralTypesData, setCollateralTypesData] = useState([]);
  const [ownershipTypesData, setOwnershipTypesData] = useState([]);
  const [approvalScreen, setApprovalScreen] = useState(false);

  const router = useRouter();

  const estimationReport = useCallback(
    (id) => {
      router.push(paths.dashboard.issureservices.view(id));
    },
    [router]
  );

  const newCollateralSchema = Yup.object().shape({
    collateralAssets: Yup.array()
      .of(
        Yup.object().shape({
          collateralType: Yup.string().required('Collateral Type is required'),
          chargeType: Yup.string().required('Charge Type is required'),
          description: Yup.string().required('Description is required'),
          estimatedValue: Yup.number()
            .typeError('Estimated value must be a number')
            .required('Estimated value is required'),
          valuationDate: Yup.date().required('Valuation date is required'),
          ownershipType: Yup.string().required('Ownership type is required'),
          trustName: Yup.string().required('Trust name is required'),
          securityDocRef: Yup.string().required('Security document ref is required'),
          securityDocument: Yup.mixed().required('Security document is required'),
          // assetCoverCertificate: Yup.mixed().required('Asset cover certificate is required'),
          // valuationReport: Yup.mixed().required('Valuation report is required'),
          remark: Yup.string(),
        })
      )
      .min(1, 'At least one collateral asset is required'),
  });

  const defaultValues = useMemo(
    () => ({
      collateralAssets:
        currentCollateralAssets?.map((asset) => ({
          ...asset,
          ownershipType: asset?.ownershipTypesId || '',
          collateralType: asset?.collateralTypesId || '',
          chargeType: asset?.chargeTypesId || '',
          securityDocRef: asset?.securityDocumentRef || '',
        })) || [],
    }),
    [currentCollateralAssets]
  );

  const methods = useForm({
    resolver: yupResolver(newCollateralSchema),
    defaultValues,
  });

  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  console.log('errors :', errors);

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collateralAssets',
  });

  const COLLATERAL_PROGRESS_FIELDS = [
    'collateralType',
    'chargeType',
    'description',
    'estimatedValue',
    'ownershipType',
    'securityDocRef',
    'trustName',
    'valuationDate',
    'securityDocument',
  ];

  const calculatePercent = useCallback(() => {
    const asset = values.collateralAssets?.[0];
    if (!asset) {
      percent?.(0);
      return;
    }

    const filledCount = COLLATERAL_PROGRESS_FIELDS.reduce((count, field) => {
      const value = asset[field];

      if (value instanceof Date) return count + 1;
      if (typeof value === 'number') return count + 1;
      if (typeof value === 'string' && value.trim() !== '') return count + 1;
      if (value && typeof value === 'object') return count + 1;

      return count;
    }, 0);

    const percentValue = Math.round((filledCount / COLLATERAL_PROGRESS_FIELDS.length) * 100);

    percent?.(percentValue);
  }, [values.collateralAssets, percent]);

  useEffect(() => {
    calculatePercent();
  }, [calculatePercent]);

  useEffect(() => {
    // if no existing collateral and no fields rendered
    if ((!currentCollateralAssets || currentCollateralAssets.length === 0) && fields.length === 0) {
      append({
        collateralType: '',
        chargeType: '',
        description: '',
        estimatedValue: '',
        valuationDate: null,
        ownershipType: '',
        trustName: '',
        securityDocRef: '',
        securityDocument: null,
        remark: '',
      });
    }
  }, [currentCollateralAssets, fields.length, append]);

  const handleAddAsset = () => {
    append({
      collateralType: '',
      chargeType: '',
      description: '',
      estimatedValue: '',
      valuationDate: null,
      ownershipType: '',
      trustName: '',
      securityDocRef: '',
      securityDocument: null,
      //   assetCoverCertificate: null,
      //   valuationReport: null,
      remark: '',
    });
  };

  // Load collateral assets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('formData');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCollateralAssets = parsed.collateral_assets_verification?.collateralAssets || [];
        if (savedCollateralAssets.length > 0) {
          reset({
            collateralAssets: savedCollateralAssets.map((asset) => ({
              ...asset,
              ownershipType: asset?.ownershipTypesId || asset?.ownershipType || '',
              collateralType: asset?.collateralTypesId || asset?.collateralType || '',
              chargeType: asset?.chargeTypesId || asset?.chargeType || '',
              securityDocRef: asset?.securityDocumentRef || asset?.securityDocRef || '',
              valuationDate: asset?.valuationDate
                ? asset.valuationDate instanceof Date
                  ? asset.valuationDate
                  : new Date(asset.valuationDate)
                : null,
            })),
          });
        }
      }
    } catch (error) {
      console.error('Error loading collateral assets:', error);
    }
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Store full form data in localStorage
      const saved = localStorage.getItem('formData');
      const formData = saved ? JSON.parse(saved) : {};

      // Save full collateral assets data
      formData.collateral_assets_verification = {
        collateralAssets: data.collateralAssets.map((asset) => ({
          ...asset, // Store all fields
          estimatedValue: asset.estimatedValue,
          securityDocumentRef: asset.securityDocRef,
          trustName: asset.trustName,
          valuationDate: asset.valuationDate,
          description: asset.description,
          collateralTypesId: asset.collateralType,
          chargeTypesId: asset.chargeType,
          ownershipTypesId: asset.ownershipType,
          remark: asset.remark,
          securityDocument: asset.securityDocument, // Store full document object
          isActive: true,
          isDeleted: false,
          // Store document ID if exists
          securityDocumentId:
            asset.securityDocument?.id || asset.securityDocument?.files?.[0]?.id || null,
        })),
      };

      localStorage.setItem('formData', JSON.stringify(formData));

      // Commented out API call
      // const payload = data.collateralAssets.map((asset) => ({
      //   estimatedValue: asset.estimatedValue,
      //   securityDocumentRef: asset.securityDocRef,
      //   trustName: asset.trustName,
      //   valuationDate: asset.valuationDate,
      //   description: asset.description,
      //   collateralTypesId: asset.collateralType,
      //   chargeTypesId: asset.chargeType,
      //   ownershipTypesId: asset.ownershipType,
      //   remark: asset.remark,
      //   isActive: true,
      //   isDeleted: false,
      //   securityDocumentId: asset.securityDocument.id,
      // }));

      // const response = await axiosInstance.patch(
      //   `/bond-estimations/collateral-assets/${applicationId}`,
      //   payload
      // );

      // if (response?.data?.success) {
      enqueueSnackbar('Collateral assets saved successfully', { variant: 'success' });
      // Update progress to 100%
      percent?.(100);
      setActiveStepId();
      // }
    } catch (error) {
      console.error('Error while saving collateral assets:', error);
      enqueueSnackbar('Error saving collateral assets', { variant: 'error' });
    }
  });

  useEffect(() => {
    setChargeTypesData(DUMMY_CHARGE_TYPES);
    setCollateralTypesData(DUMMY_COLLATERAL_TYPES);
    setOwnershipTypesData(DUMMY_OWNERSHIP_TYPES);
  }, []);

  useEffect(() => {
    calculatePercent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.collateralAssets]);

  // Removed - now loading from localStorage in the effect above
  // useEffect(() => {
  //   if (currentCollateralAssets) {
  //     reset(defaultValues);
  //   }
  // }, [currentCollateralAssets, reset, defaultValues]);

  // useEffect(() => {
  //     if (chargeTypes?.length > 0 && !chargeTypesLoading) {
  //         setChargeTypesData(chargeTypes);
  //     }
  // }, [chargeTypes, chargeTypesLoading]);

  // useEffect(() => {
  //     if (collateralTypes?.length > 0 && !collateralTypesLoading) {
  //         setCollateralTypesData(collateralTypes);
  //     }
  // }, [collateralTypes, collateralTypesLoading]);

  // useEffect(() => {
  //     if (ownershipTypes?.length > 0 && !ownershipTypesLoading) {
  //         setOwnershipTypesData(ownershipTypes);
  //     }
  // }, [ownershipTypes, ownershipTypesLoading]);

  //   useEffect(() => {
  //     if (stepData?.length > 0 && !stepDataLoading) {
  //       setCurrentCollateralAssets(stepData);
  //     }
  //   }, [stepData, stepDataLoading]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {/* {approvalScreen && <ValuatorApprovalPendingNotice />} */}
      <Box
        sx={{
          minHeight: '100vh',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {fields.map((field, index) => (
          <Card
            key={field.id}
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
              Collateral & Asset Verification
            </Typography>
            <Grid container spacing={3}>
              {/* Collateral Type */}
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name={`collateralAssets.${index}.collateralType`}
                  label="Collateral Type"
                  defaultValue=""
                >
                  {collateralTypesData.length > 0 ? (
                    collateralTypesData.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No collateral types
                    </MenuItem>
                  )}
                </RHFSelect>
              </Grid>

              {/* Charge Type */}
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name={`collateralAssets.${index}.chargeType`}
                  label="Charge Type"
                  defaultValue=""
                >
                  {chargeTypesData.length > 0 ? (
                    chargeTypesData.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No charge types
                    </MenuItem>
                  )}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name={`collateralAssets.${index}.ownershipType`}
                  label="Ownership Type"
                  defaultValue=""
                >
                  {ownershipTypesData.length > 0 ? (
                    ownershipTypesData.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No ownership types
                    </MenuItem>
                  )}
                </RHFSelect>
              </Grid>

              {/* Asset Description */}

              {/* Estimated Value */}
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name={`collateralAssets.${index}.estimatedValue`}
                  label="Estimated Value"
                  fullWidth
                />
              </Grid>

              {/* Security Document Ref */}
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name={`collateralAssets.${index}.securityDocRef`}
                  label="Security Document Ref"
                  fullWidth
                />
              </Grid>

              {/* Valuation Date */}

              {/* Trust Name */}
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name={`collateralAssets.${index}.trustName`}
                  label="  Trust Name"
                  fullWidth
                />
              </Grid>

              {/* Ownership Type */}

              {/* Remarks */}
              <Grid item xs={12} md={6}>
                <RHFTextField name={`collateralAssets.${index}.remark`} label="Remarks" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name={`collateralAssets.${index}.valuationDate`}
                  label="Valuation Date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Valuation Date"
                      value={
                        field.value
                          ? field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                          : null
                      }
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
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
              <Grid item xs={12} md={12}>
                <RHFTextField
                  name={`collateralAssets.${index}.description`}
                  label="Asset Description"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={2}>
                  <RHFCustomFileUploadBox
                    name={`collateralAssets.${index}.securityDocument`}
                    label="Reference doc*"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                  />
                  <YupErrorMessage name={`collateralAssets.${index}.securityDocument`} />

                  {/* <RHFCustomFileUploadBox
                    name={`collateralAssets.${index}.assetCoverCertificate`}
                    label="Asset Cover Certificate"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                  />
                  <YupErrorMessage name={`collateralAssets.${index}.assetCoverCertificate`} />

                  <RHFCustomFileUploadBox
                    name={`collateralAssets.${index}.valuationReport`}
                    label="Valuation Report"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                  />
                  <YupErrorMessage name={`collateralAssets.${index}.valuationReport`} /> */}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        ))}

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            type="button"
            variant="contained"
            onClick={() => handleAddAsset()}
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            + Add Collateral Asset
          </Button>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
            variant="contained"
            color="primary"
          >
            Save & Continue
          </LoadingButton>
        </Box>
      </Box>
      {/* <ValuatorApprovalCard /> */}
    </FormProvider>
  );
}

CollateralAssets.propTypes = {
  currentCollateral: PropTypes.object,
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
};
