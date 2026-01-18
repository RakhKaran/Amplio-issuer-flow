import {
  Card,
  Typography,
  Grid,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import Iconify from "src/components/iconify";

const businessProfile = [
  { label: "Years in business :", value: "7" },
  { label: "FY24 Turnover (Audited) :", value: "₹120 Cr" },
  { label: "FY25 Projected Turnover :", value: "₹150 Cr" },
  { label: "EBITDA Margin :", value: "18%" },
];

const financialDocuments = [
  {
    label: "Financial Statements (Last 3 Years) :",
    status: "Approved",
    color: "#00AB59",
  },
  {
    label: "FY24 Turnover (Audited) :",
    status: "Approved",
    color: "#00AB59",
  },
  {
    label: "FY25 Projected Turnover :",
    status: "Under Review",
    color: "#FFAB00",
  },
  {
    label: "EBITDA Margin :",
    status: "Approved",
    color: "#00AB59",
  },
];

export default function ReviewBusinessProfilePage() {
  return (

    <Grid
      container
      spacing={2}
      columns={8}
      sx={{ px: { xs: 0, sm: 4, md: 25 } }}
    >

      <Grid item xs={8} md={4}>
        <Card sx={{ p: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Business Profile
            </Typography>
            <IconButton size="small">
              <Iconify icon="solar:pen-bold" width={20} />
            </IconButton>
          </Box>

          {businessProfile.map((item, index) => (
            <Grid
              container
              key={index}
              display="flex"
              justifyContent="space-between"
              mb={2}
            >
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Grid>
              <Grid item xs={6} pl={10} display="flex" justifyContent="flex-start" >
                <Typography variant="body2" fontWeight={500}>
                  {item.value}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Card>
      </Grid>

      {/* Financial Documents */}
      <Grid item xs={8} md={4}>
        <Card sx={{ p: 3, height: "100%" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Financial Documents
            </Typography>
            <IconButton size="small">
              <Iconify icon="solar:pen-bold" width={20} />
            </IconButton>
          </Box>

          {financialDocuments.map((item, index) => (
            <Grid
              container
              key={index}
              display="flex"
              justifyContent="space-between"
              mb={2}
            >
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Grid>
              <Grid item xs={6} pl={10} display="flex" justifyContent="flex-start">
                <Chip
                  size="small"
                  label={item.status}
                  variant="outlined"
                  sx={{
                    height: 24,
                    fontSize: 11,
                    fontWeight: 600,
                    color: item.color,
                    borderColor: item.color,
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Card>
      </Grid>
    </Grid>


  );
}
