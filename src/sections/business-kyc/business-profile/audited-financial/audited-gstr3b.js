import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import { fDate } from 'src/utils/format-time';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
// import { useParams } from 'src/routes/hook';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 1,
  border: `1px dashed ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.72,
  },
}));

// ----------------------------------------------------------------------

export default function AuditedGST3B({
  currentBaseYear,
  currentData,
  setPercent,
  setProgress,
  onSave,
}) {
  // Commented out API integration
  // const params = useParams();
  // const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const [auditorName, setAuditorName] = useState('');
  const [documents, setDocuments] = useState([]);

  const months = [
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' },
  ];

  const getLastTwelveMonthsDesc = () => {
    const result = [];

    for (let i = 0; i < 12; i++) {
      const date = dayjs().subtract(i, 'month');

      result.push({
        value: date.format('MMM').toLowerCase(), // jan, dec
        label: date.format('MMMM'), // January
        monthIndex: date.month(),
        year: date.year(),
      });
    }

    return result; // already DESC order
  };

  const lastSixMonths = getLastTwelveMonthsDesc();

  const handleFileUpload = async (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axiosInstance.post('/files', formData);

      const uploadedFile = res?.data?.files?.[0];

      if (!uploadedFile?.id) {
        enqueueSnackbar('File upload failed', { variant: 'error' });
        return;
      }

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
              ...doc,
              file: uploadedFile,
              status: 'Uploaded',
              reportDate: new Date(),
            }
            : doc
        )
      );

      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('File upload failed', { variant: 'error' });
    } finally {
      e.target.value = null;
    }
  };


  const handleDelete = (id) => {
    setDocuments(docs =>
      docs.map(d =>
        d.id === id
          ? { ...d, file: null, status: 'Pending', reportDate: null }
          : d
      )
    );
  };

  const handleViewFile = (file) => {
    if (!file?.fileUrl) {
      enqueueSnackbar('File URL not available', { variant: 'warning' });
      return;
    }

    window.open(file.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Uploaded':
        return 'success';
      case 'Invalid':
        return 'error';
      default:
        return 'warning';
    }
  };

  const toValidDate = (value) => {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleDateChange = (date, id) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === id ? { ...doc, reportDate: date } : doc)));
  };

  const calculateCompletion = () => {
    let score = 0;

    // Auditor Name max: 5%
    if (auditorName?.trim()) score += 5;

    const totalDocs = documents.length;

    if (totalDocs > 0) {
      const uploadCount = documents.filter((doc) => !!doc.file).length;
      const dateCount = documents.filter((doc) => !!doc.reportDate).length;

      // Files max 7.5%
      score += Math.min(uploadCount * (7.5 / totalDocs), 7.5);

      // Dates max 7.5%
      score += Math.min(dateCount * (7.5 / totalDocs), 7.5);
    }

    const rawScore = Math.min(20, Math.round(score));
    // When score reaches 20 (all fields complete), set percent to 100
    // Otherwise use the calculated score as percentage
    const percent = rawScore === 20 ? 100 : rawScore;
    setPercent(percent);
    setProgress(percent === 100);
  };

  const validateBeforeSubmit = () => {
    if (!auditorName?.trim()) {
      enqueueSnackbar('Auditor name is required', { variant: 'error' });
      return false;
    }

    if (!documents.length) {
      enqueueSnackbar('No financial records found', { variant: 'error' });
      return false;
    }

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const yearLabel = `${doc.periodStartYear}-${doc.periodEndYear}`;

      if (!doc.file) {
        enqueueSnackbar(`File missing for FY ${yearLabel}`, { variant: 'error' });
        return false;
      }

      if (!doc.file?.id) {
        enqueueSnackbar(`Invalid uploaded file for FY ${yearLabel}`, { variant: 'error' });
        return false;
      }

      if (!doc.reportDate) {
        enqueueSnackbar(`Report date required for FY ${yearLabel}`, { variant: 'error' });
        return false;
      }

      if (!doc.auditedType) {
        enqueueSnackbar(`Audited/Provisional type required for FY ${yearLabel}`, {
          variant: 'error',
        });
        return false;
      }

      if (!doc.month) {
        enqueueSnackbar(`Invalid month`, {
          variant: 'error',
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateBeforeSubmit()) return;

    try {
      const financialsData = documents.map((doc) => ({
        category: 'gst_3b',
        type: 'month_wise',
        baseFinancialStartYear: Number(currentBaseYear) - 1,
        baseFinancialEndYear: Number(currentBaseYear),
        month: doc.month,
        auditedType: doc.auditedType,
        auditorName: auditorName.trim(),
        reportDate: doc.reportDate,
        fileId: doc.file.id,
        // file: doc.file,
        // isActive: true,
        // isDeleted: false,
      }));

      // Commented out API integration
      const payloadData = {
        auditedFinancials: financialsData,
      };
      const response = await axiosInstance.patch(`/business-kyc/audited-financials`, payloadData);

      if (response.status === 200) {
        enqueueSnackbar('Audited financials saved successfully', { variant: 'success' });
        setProgress(true);
      }
    } catch (error) {
      console.error('Error while uploading financials:', error);

      enqueueSnackbar(
        error?.response?.data?.error?.message ||
        'Something went wrong while saving audited financials',
        { variant: 'error' }
      );
    }
  };

  useEffect(() => {
    calculateCompletion();
  }, [auditorName, documents]);

  useEffect(() => {
    if (currentData?.length) {
      setAuditorName(currentData[0]?.auditorName);
      setDocuments(
        currentData.map((doc) => ({
          id: `gst3b-${doc.month}`,
          month: doc.month,
          file: doc.file ?? null,
          status: 'Uploaded',
          reportDate: doc.reportDate ? new Date(doc.reportDate) : null,
          auditedType: doc.auditedType,
        }))
      );
      // If saved data exists, the form was already completed
      // Set percent to 100 to reflect completion
      setPercent(100);
      setProgress(true);
      return;
    }

    if (!currentData?.length) {
      const initialDocs = lastSixMonths.map((m) => ({
        id: `gst3b-${m.value}`,
        month: m.value,
        file: null,
        status: 'Pending',
        reportDate: null,
        auditedType: 'audited',
      }));

      setDocuments(initialDocs);
    }
  }, [currentData]);

  return (
    <Container disableGutters>
      <Grid
        container
        sx={{
          mt: 2,
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Grid xs={12}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            GST-3B Monthly Returns (Last 3 Years)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Upload your GST-3B monthly returns.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Auditor Name
            </Typography>
            <RHFTextField
              name="auditorName"
              placeholder="Enter auditor name"
              fullWidth
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
            />
          </Box>

          <Box
            sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'column' } }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Year {`${Number(currentBaseYear) - 1}-${currentBaseYear}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'grid' },
                gridTemplateColumns: {
                  md: '1fr 2fr 2fr 1fr 1.5fr 120px',
                  lg: '1fr 2fr 1.5fr 1.2fr 1.8fr 120px',
                },
                border: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                overflow: 'hidden',
                '& > *': {
                  p: 1.5,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <Typography variant="subtitle2">Month</Typography>
              <Typography variant="subtitle2">Type</Typography>
              <Typography variant="subtitle2">Upload File</Typography>
              <Typography variant="subtitle2">Status</Typography>
              <Typography variant="subtitle2">Report Date</Typography>
              <Typography variant="subtitle2">Actions</Typography>
            </Box>

            {/* Desktop/Tablet View */}
            {documents.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: {
                    md: '1fr 2fr 2fr 1fr 1.5fr 120px',
                    lg: '1fr 2fr 1.5fr 1.2fr 1.8fr 120px',
                  },
                  border: '1px solid',
                  borderTop: 'none',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                  '& > *': {
                    p: 1.5,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                    '&:last-child': {
                      borderRight: 'none',
                      justifyContent: 'center',
                    },
                  },
                }}
              >
                <Select
                  readOnly
                  variant="standard"
                  value={doc.month || ''}
                  onChange={(e) => {
                    const { value } = e.target;

                    setDocuments((prev) =>
                      prev.map((docItem) =>
                        docItem.id === doc.id ? { ...docItem, month: value } : docItem
                      )
                    );
                  }}
                >
                  {lastSixMonths.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>

                <Box>
                  <RadioGroup
                    row
                    value={doc.auditedType}
                    onChange={(e) => {
                      const newDocuments = documents.map((d) =>
                        d.id === doc.id ? { ...d, auditedType: e.target.value } : d
                      );
                      setDocuments(newDocuments);
                    }}
                  >
                    <FormControlLabel
                      value="audited"
                      control={<Radio size="small" />}
                      label="Audited"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    />
                    <FormControlLabel
                      value="provisional"
                      control={<Radio size="small" />}
                      label="Provisional"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    />
                  </RadioGroup>
                </Box>
                <Box>
                  {!doc.file ? (
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      Not Uploaded
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      title={doc.file.fileOriginalName || doc.file.fileName}
                      sx={{
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.file.fileOriginalName || doc.file.fileName}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      typography: 'caption',
                      color: (theme) => theme.palette[getStatusColor(doc.status)].darker,
                      bgcolor: (theme) =>
                        alpha(theme.palette[getStatusColor(doc.status)].main, 0.16),
                    }}
                  >
                    {doc.status}
                  </Box>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={toValidDate(doc.reportDate)}
                      format="dd/MM/yyyy"
                      onChange={(newValue) => handleDateChange(newValue, doc.id)}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '& .MuiSvgIcon-root': {
                              color: 'text.disabled',
                              width: 20,
                              height: 20,
                              mr: 1,
                            },
                          }}
                        >
                          {InputProps?.endAdornment}
                          <input
                            ref={inputRef}
                            {...inputProps}
                            placeholder="Select date"
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              fontSize: '0.875rem',
                            }}
                          />
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ gap: 1, display: 'flex' }}>
                  {doc.file && (
                    <IconButton size="small" color="primary" onClick={() => handleViewFile(doc.file)}>
                      <Iconify icon="solar:eye-bold" width={20} />
                    </IconButton>
                  )}
                  <>
                    <input
                      id={`file-upload-${doc.id}`}
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, doc.id)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                    >
                      <Iconify icon="solar:upload-minimalistic-bold" width={20} />
                    </IconButton>
                  </>
                  {doc.file && (
                    <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                      <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

            {/* Mobile View */}
            {documents.map((doc) => (
              <Box
                key={`mobile-${doc.id}`}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  '&:last-child': {
                    mb: 0,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2">Month:</Typography>
                  <Typography variant="body2">{doc.month || '-'}</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2">Type:</Typography>
                  <RadioGroup
                    row
                    value={doc.statementType}
                    onChange={(e) => {
                      const newDocuments = documents.map((d) =>
                        d.id === doc.id ? { ...d, statementType: e.target.value } : d
                      );
                      setDocuments(newDocuments);
                    }}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  >
                    <FormControlLabel
                      value="audited"
                      control={<Radio size="small" />}
                      label="Audited"
                    />
                    <FormControlLabel
                      value="provisional"
                      control={<Radio size="small" />}
                      label="Provisional"
                    />
                  </RadioGroup>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2">Status:</Typography>
                  <Box
                    component="span"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      typography: 'caption',
                      color: (theme) => theme.palette[getStatusColor(doc.status)].darker,
                      bgcolor: (theme) =>
                        alpha(theme.palette[getStatusColor(doc.status)].main, 0.16),
                    }}
                  >
                    {doc.status}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2">Report Date:</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={toValidDate(doc.reportDate)}
                      format="dd/MM/yyyy"
                      onChange={(newValue) => handleDateChange(newValue, doc.id)}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {InputProps?.endAdornment}
                          <input
                            ref={inputRef}
                            {...inputProps}
                            style={{
                              width: '120px',
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              fontSize: '0.875rem',
                              textAlign: 'right',
                            }}
                          />
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    pt: 2,
                    borderTop: '1px dashed',
                    borderColor: 'divider',
                  }}
                >
                  {!doc.file ? (
                    <label
                      htmlFor={`mobile-file-upload-${doc.id}`}
                      style={{ flexGrow: 1, marginRight: 2 }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        component="span"
                        startIcon={<Iconify icon="solar:upload-minimalistic-bold" width={16} />}
                        size="small"
                      >
                        Upload File
                      </Button>
                      <input
                        id={`mobile-file-upload-${doc.id}`}
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, doc.id)}
                      />
                    </label>
                  ) : (
                    <Typography variant="body2" sx={{ flexGrow: 1, mr: 1 }}>
                      {doc.file.fileOriginalName || doc.file.fileName}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {doc.file && (
                      <IconButton size="small" color="primary">
                        <Iconify icon="solar:eye-bold" width={20} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() =>
                        document.getElementById(`mobile-file-upload-${doc.id}`)?.click()
                      }
                    >
                      <Iconify icon="solar:refresh-bold" width={20} />
                    </IconButton>
                    {doc.file && (
                      <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            width: '100%',
          }}
        >
          {/* <Button
            variant="contained"
            onClick={() => handleAddRow()}
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            + Add row
          </Button> */}

          <Button
            variant="contained"
            onClick={() => handleSave()}
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </Container>
  );
}

AuditedGST3B.propTypes = {
  currentBaseYear: PropTypes.string.isRequired,
  setPercent: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
  currentData: PropTypes.array,
  onSave: PropTypes.func,
};
