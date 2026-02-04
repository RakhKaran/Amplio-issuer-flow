import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function SanctionLetter({ data }) {
  const methods = useForm({
    defaultValues: {
      remark: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (formData) => {
    console.log('Remarks:', formData);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" color="primary">
            Sanction Letter Preview
          </Typography>
        </Box>
        <Card sx={{ p: 4, mt: 2 }}>
          <Box
            component="iframe"
            src={document.pdfUrl}
            width="100%"
            height="100%"
            sx={{ border: 'none' }}
          />
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h5"> Request Changes / Remarks</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column">
              <RHFTextField
                name="remark"
                label="Remark"
                placeholder="Remark (optional) the changes you want in the section letter (limit, company, details, terms, etc.)"
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Maximum 500 characters
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: 'primary.dark',
                    borderColor: 'primary.dark',
                    boxShadow: 'none',
                  },
                }}
              >
                Submit Remarks
              </Button>

              <Button variant="contained" color="primary">
                Next
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
