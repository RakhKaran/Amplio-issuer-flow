import { Grid, Typography, Stack, Box } from "@mui/material";
import ReviewBusinessProfilePage from "./business-profile";
import ClientSummary from "./client-summary";

export default function ReviewAndSubmitPage() {
  return (
<Box display="flex" justifyContent="center" width="100%">
  <Box maxWidth="lg" width="100%">

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

  </Box>
</Box>


  );
}
