import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hook/use-router';
import { Grid, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export default function TrusteeCardGrid({ item }) {
  const theme = useTheme();
  const router = useRouter();



  return (
    <Box
      sx={{
        mx: 1.25,
        borderRadius: 1,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 4px 16px ${alpha(theme.palette.grey[500], 0.24)}`,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Bottom Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: '#fff',
          mt: 'auto',
          p: 2.5,
          borderRadius: 1,
        }}
      >
        <Grid container spacing={2}>
          {/* ROW 1 : PRICE - RATING */}
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                Price
              </Typography>
              <Typography variant="caption">₹{item?.price || 'N.A.'}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  border: '2px solid #00A76F',
                  bgcolor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#00A76F',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    padding: '4px',
                  }}
                >
                  {item?.ratings?.[0]?.rating || 'N.A.'}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* ROW 2 : COUPON - YIELD */}
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                Coupon
              </Typography>
              <Typography variant="caption">{item?.coupon_rate_percent || 'N.A.'}%</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                Yield
              </Typography>
              <Typography variant="caption">{item?.ytm_percent || 'N.A.'}%</Typography>
            </Stack>
          </Grid>

          {/* ROW 3 : IP FREQUENCY - MATURITY DATE */}
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                IP Frequency
              </Typography>
              <Typography variant="caption">
                {item?.interest_payment_frequency || 'N.A.'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                Maturity Date
              </Typography>
              <Typography variant="caption">{item?.maturity_date || 'N.A.'}</Typography>
            </Stack>
          </Grid>

          {/* ROW 4 : TYPE OF BOND */}
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.72 }}>
                Type of Bond
              </Typography>

              <Typography
                variant="caption"
                noWrap
                sx={{
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item?.issuer_type || 'N.A.'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

TrusteeCardGrid.propTypes = {
  item: PropTypes.object.isRequired,
};
