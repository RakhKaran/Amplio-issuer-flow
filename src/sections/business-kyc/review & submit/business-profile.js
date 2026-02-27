import {
  Card,
  Typography,
  Grid,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { useGetBusinessKycStepData, useGetFinancials } from "src/api/businessKyc";
import Iconify from "src/components/iconify";
import { formatNumberIN } from "src/utils/change-case";

// const businessProfile = [
//   { label: "Years in business :", value: "7" },
//   { label: "FY24 Turnover (Audited) :", value: "₹120 Cr" },
//   { label: "FY25 Projected Turnover :", value: "₹150 Cr" },
//   { label: "EBITDA Margin :", value: "18%" },
// ];
const STATUS_CONFIG = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};


export default function ReviewBusinessProfilePage({ onEdit }) {
  const { stepData, stepDataLoading } = useGetBusinessKycStepData('business_profile');

  const { financialsDetails = [] } = useGetFinancials();

  const profileData = stepData?.data[0];
  const businessProfileRows = [
    {
      label: "Years in Business",
      value: profileData?.yearInBusiness
        ? `${profileData.yearInBusiness} years`
        : '—',
    },
    {
      label: "FY24 Turnover (Audited)",
      value: profileData?.turnover
        ? `₹${formatNumberIN(profileData.turnover)}`
        : '—',
    },
    {
      label: "FY25 Projected Turnover",
      value: profileData?.projectedTurnover
        ? `₹${formatNumberIN(profileData.projectedTurnover)}`
        : '—',
    },
  ];

  return (
    <>
      <Box mb={2} mt={2} display="flex" justifyContent="center">
        <Typography variant="h5" color="primary" >Invoice Financing Application Details</Typography>
      </Box>

      <Grid
        container
        spacing={2}
        columns={12}
        justifyContent="center"
        sx={{ maxWidth: '900px', mx: 'auto', mb: 4 }}
      >

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Grid
              spacing={2}
              container
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item xs={8} md={10}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Business Profile
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: "right" }} item xs={4} md={2}>
                <IconButton size="small" onClick={onEdit}>
                  <Iconify icon="solar:pen-bold" width={18} />
                </IconButton>

              </Grid>
              {businessProfileRows.map((item, index) => (
                <>
                  <Grid item xs={6} md={6}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label} :
                    </Typography>
                  </Grid>
                  <Grid sx={{ textAlign: 'right' }} item xs={6} md={6}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.value}
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Financial Documents */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Grid
              spacing={2}
              container
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item xs={8} md={10}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Financial Documents
                </Typography>
              </Grid>
              <Grid sx={{ textAlign: "right" }} item xs={4} md={2}>
                <IconButton size="small" onClick={onEdit}>
                  <Iconify icon="solar:pen-bold" width={18} />
                </IconButton>

              </Grid>

              {financialsDetails.map((item, index) => (
                <>
                  <Grid item xs={8} md={8}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Grid>
                  <Grid sx={{ textAlign: 'right' }} item xs={4} md={4}>
                    <Chip
                      size="small"
                      label={STATUS_CONFIG[item.status]?.label}
                      color={STATUS_CONFIG[item.status]?.color}
                      variant="soft"
                      sx={{ height: 24, fontSize: 11, fontWeight: 600 }}
                    />

                  </Grid>
                </>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

    </>
  );
}
