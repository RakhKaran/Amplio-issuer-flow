import React from 'react';
import { Box, Typography, Divider, Avatar, Card, Grid, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import {
  DEBENTURE_TRUSTEES,
  RTAS,
  LEAD_MANAGERS,
  LEGAL_ADVISORS,
  VALUERS,
} from './intermediates-dummy-date';

// ------------------ helpers ------------------

const DATA_MAP = {
  trustee: DEBENTURE_TRUSTEES,
  rta: RTAS,
  'lead-manager': LEAD_MANAGERS,
  legal: LEGAL_ADVISORS,
  valuer: VALUERS,
};

const parseNumber = (value) =>
  typeof value === 'number' ? value : Number(String(value).replace(/[^\d]/g, ''));

// ------------------ component ------------------

export default function CompareIntermediaryView() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type'); // trustee | rta | legal | etc
  const selectedIds = searchParams.get('ids')?.split(',') || [];

  const sourceData = DATA_MAP[type] || [];
  const selectedItems = sourceData.filter((i) => selectedIds.includes(i.id));

  if (selectedItems.length < 2) {
    return (
      <Typography textAlign="center" color="text.secondary">
        Select at least 2 items to compare
      </Typography>
    );
  }

  // ------------------ best values ------------------

  const bestExperience = Math.max(...selectedItems.map((i) => parseNumber(i.experience)));

  const bestResponse = Math.min(...selectedItems.map((i) => parseNumber(i.responseTime)));

  const bestFees = Math.min(
    ...selectedItems.map((i) => parseNumber(i.fees || i.feeStructure || '0'))
  );

  const highlight = (condition) => ({
    color: condition ? '#1b5e20' : 'inherit',
    fontWeight: condition ? 700 : 400,
  });

  // ------------------ render ------------------

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        Compare {type?.toUpperCase()}
      </Typography>

      <Grid container spacing={3}>
        {selectedItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: '#0D47A1', width: 56, height: 56 }}>
                  {item.legalEntityName.charAt(0)}
                </Avatar>

                <Typography variant="h6" fontWeight="bold">
                  {item.legalEntityName}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.2}>
                {item.experience && (
                  <Typography sx={highlight(parseNumber(item.experience) === bestExperience)}>
                    <strong>Experience:</strong> {item.experience}
                  </Typography>
                )}

                {item.responseTime && (
                  <Typography sx={highlight(parseNumber(item.responseTime) === bestResponse)}>
                    <strong>Response Time:</strong> {item.responseTime}
                  </Typography>
                )}

                {(item.fees || item.feeStructure) && (
                  <Typography
                    sx={highlight(parseNumber(item.fees || item.feeStructure) === bestFees)}
                  >
                    <strong>Fees:</strong> {item.fees || item.feeStructure}
                  </Typography>
                )}

                {item.regulatory && (
                  <Typography>
                    <strong>Regulatory:</strong> {item.regulatory}
                  </Typography>
                )}

                {item.pastIssues && (
                  <Typography>
                    <strong>Past Issues:</strong> {item.pastIssues}
                  </Typography>
                )}

                {item.techCapability && (
                  <Typography>
                    <strong>Tech:</strong> {item.techCapability}
                  </Typography>
                )}

                {item.rating && (
                  <Typography>
                    <strong>Rating:</strong> {item.rating}
                  </Typography>
                )}

                {item.chargeCreationSupport && (
                  <Typography>
                    <strong>Charge Creation:</strong> {item.chargeCreationSupport}
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
