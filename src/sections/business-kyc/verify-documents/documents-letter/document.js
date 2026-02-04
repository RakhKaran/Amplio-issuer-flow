import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

export default function DocumentPreview({ document }) {
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

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          size="large"
          sx={{ px: 4, borderRadius: 2 }}
        >
          Continue to E-Sign
        </Button>
      </Stack>
    </Container>
  );
}
