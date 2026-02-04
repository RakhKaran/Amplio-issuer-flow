import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

export default function DeedOfHypo({ document }) {
  const AgreementSchema = Yup.object().shape({
    agreement: Yup.boolean().oneOf(
      [true],
      'You must agree to the Platform Agreement before continuing'
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(AgreementSchema),
    defaultValues: {
      agreement: false,
    },
    mode: 'onChange', // enables instant validation
  });

  const onSubmit = () => {
    // onNext?.(); // move to next document / eSign
    console.log('Data submitted');
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
        {document.title}
      </Typography>
      <Card sx={{ height: '75vh', mb: 4 }}>
        <Box
          component="iframe"
          src={document.pdfUrl}
          width="100%"
          height="100%"
          sx={{ border: 'none' }}
        />
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="center">
          {/* Checkbox Container */}
          <Controller
            name="agreement"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: '#eef2f6',
                  borderRadius: 1.5,
                  border: errors.agreement ? '1px solid #d32f2f' : '1px solid #cfd8dc',
                  px: 2,
                  py: 1.2,
                }}
              >
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={
                    <Box>
                      <Typography fontWeight={600}>
                        I have read and agree to the Platform Agreement
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        I authorize escrow-based settlements and acknowledge the key terms above.
                      </Typography>
                    </Box>
                  }
                />

                {errors.agreement && (
                  <FormHelperText error>{errors.agreement.message}</FormHelperText>
                )}
              </Box>
            )}
          />
        </Stack>
      </form>
      <Stack direction="row" justifyContent="center">
        <Button variant="contained" size="large" sx={{ px: 4, borderRadius: 2 }}>
          Continue to E-Sign
        </Button>
      </Stack>
    </Container>
  );
}
