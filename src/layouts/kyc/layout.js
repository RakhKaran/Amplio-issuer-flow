import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import KycMain from './main';

export default function KycLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <KycMain>{children}</KycMain>
    </Box>
  );
}

KycLayout.propTypes = {
  children: PropTypes.node,
};
