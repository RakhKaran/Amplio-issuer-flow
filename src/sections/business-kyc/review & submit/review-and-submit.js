import { Grid, Typography, Stack, Box, Button, Checkbox } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import ReviewBusinessProfilePage from "./business-profile";
import ClientSummary from "./client-summary";



export default function ReviewAndSubmitPage() {

  const ReviewSubmitSchema = Yup.object().shape({
    consent: Yup.boolean()
      .oneOf([true], 'You must confirm before submitting'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReviewSubmitSchema),
    defaultValues: {
      consent: false,
    },
  });

  const methods = useForm();

  const onSubmit = () => {
    console.log('Review submitted');
  };

  return (
    <Box display="flex" justifyContent="center" >
      <Box maxWidth="lg" >

        {/* Header */}
        <Stack spacing={1} alignItems="center" mb={4}>
          <Typography variant="h3" color="primary">
            Review & Submit
          </Typography>
          <Typography variant="body1" color="primary">
            Please review all information before submitting your application
          </Typography>
        </Stack>

        <ReviewBusinessProfilePage />
        <ClientSummary />

        <Box
          mt={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={2}

          >
            Declaration & Consent
          </Typography>

          <Box
            sx={{
              maxWidth: 720,
              width: '100%',
            }}
          >
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <>
                  <Box display="flex" alignItems="flex-start">
                    <Checkbox
                      {...field}
                      checked={field.value}
                      sx={{ mt: 0.2 }}
                    />

                    <Typography variant="body2">
                      I confirm that all information, documents, and details provided
                      above are true, complete, and accurate to the best of my knowledge.
                    </Typography>
                  </Box>

                  {errors.consent && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 4.5, mt: 0.5 }}
                    >
                      {errors.consent.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>

          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={{ px: 4 }}
            >
              Submit for Review
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
