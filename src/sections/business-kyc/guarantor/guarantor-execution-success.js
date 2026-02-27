import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
export default function GuarantorExecutionSuccess() {


    return (
        <Container
            maxWidth="md"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box width="100%" maxWidth={720}>


                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#c3d4c6',
                        border: '1px solid #a0da91',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="success" fontWeight={700}>
                        Verification successfully Completed
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Your agreement has been successfully signed and verified.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );

}
