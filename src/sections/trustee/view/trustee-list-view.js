import React, { useState } from 'react';
import {
    Card, CardContent, Typography, Box, Checkbox,
    Stack, Divider, Avatar, Button, Dialog, Grid
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import FormProvider, { RHFMultiSelect } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function TrusteeSelection() {
    const methods = useForm({
        defaultValues: {
            trustees: [],
        },
    });

    const router = useRouter();
    const { control } = methods;

    const [checkedTrustees, setCheckedTrustees] = useState([]);
    const [open, setOpen] = useState(false);
    const [activeTrustee, setActiveTrustee] = useState(null);

    const trustees = [
        {
            id: 1,
            name: "CATALYST TRUSTEESHIP LIMITED (FORMERLY GDA TRUSTEESHIP LIMITED)",
            experience: "10 + yrs",
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹2L setup + ₹1L annual",
            responseTime: "2 hrs",
            pastIssue: "50+ secured issues",
            techCapability: "Digital docs / API",
            reputation: "4.8/5.0",
            supportInChargeCreation: "Yes"
        },
        {
            id: 2,
            name: "IDBI TRUSTEESHIP SERVICES LIMITED",
            experience: "8 + yrs",
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹2L setup + ₹1L annual",
            responseTime: "1 hr",
            pastIssue: "40+ secured issues",
            techCapability: "Digital docs / API",
            reputation: "4.6/5.0",
            supportInChargeCreation: "Yes"
        },
        {
            id: 3,
            name: "Zenith Capital Advisors",
            experience: "8 + yrs",
            regulatoryStatus: "SEBI / RBI registered",
            feeStructure: "₹1.5L setup + ₹70K annual",
            responseTime: "1 hr",
            pastIssue: "30+ secured issues",
            techCapability: "Digital docs / API",
            reputation: "4.4/5.0",
            supportInChargeCreation: "Yes"
        },
    ];

    const selectedTrustees = useWatch({
        control,
        name: "trustees",
    });

    const getInitials = (name) => {
        const parts = name.split(" ");
        return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    };

    const handleCheck = (id) => {
        setCheckedTrustees((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleCompare = () => {
        const ids = checkedTrustees.join(",");
        router.push(`/dashboard/trustee/compare?ids=${ids}`);
    };

    const handleOpen = (trustee) => {
        setActiveTrustee(trustee);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setActiveTrustee(null);
    };

    return (
        <FormProvider methods={methods}>
            <Box sx={{ width: "100%" }}>
                <RHFMultiSelect
                    checkbox
                    name="trustees"
                    label="Select Trustees"
                    options={trustees.map((t) => ({ label: t.name, value: t.id }))}
                    sx={{ width: { xs: "100%", md: "50%" } }}
                />

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 3 }}>
                    {selectedTrustees?.map((id) => {
                        const t = trustees.find((tr) => tr.id === id);
                        if (!t) return null;

                        return (
                            <Card
                                key={id}
                                sx={{
                                    width: 380,
                                    p: 2,
                                    borderRadius: 3,
                                    position: "relative",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Box display="flex" justifyContent="space-between" gap={1}>
                                        <Box display="flex" gap={2} flex={1}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#0D47A1",
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {getInitials(t.name)}
                                            </Avatar>

                                            <Typography
                                                variant="subtitle2"
                                                fontWeight="bold"
                                                sx={{ flex: 1, wordBreak: "break-word", lineHeight: 1.2 }}
                                            >
                                                {t.name}
                                            </Typography>
                                        </Box>

                                        <Checkbox
                                            checked={checkedTrustees.includes(t.id)}
                                            onChange={() => handleCheck(t.id)}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Typography variant="body2"><strong>Experience:</strong> {t.experience}</Typography>
                                    <Typography variant="body2"><strong>Regulatory:</strong> {t.regulatoryStatus}</Typography>
                                    <Typography variant="body2"><strong>Fees:</strong> {t.feeStructure}</Typography>
                                    <Typography variant="body2"><strong>Response:</strong> {t.responseTime}</Typography>
                                </CardContent>

                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        bgcolor: '#1976d2',
                                        position: "absolute",
                                        bottom: 8,
                                        right: 8,
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                        fontSize: 12,
                                        padding: "2px 10px",
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: '#1565c0', boxShadow: 'none', },
                                    }}
                                    onClick={() => handleOpen(t)}
                                >
                                    View Details
                                </Button>

                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    maxWidth="sm"
                                    fullWidth
                                >
                                    <Box sx={{ p: 3 }}>
                                        {activeTrustee && (
                                            <>

                                                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
                                                    Trustee Details
                                                </Typography>
                                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                                    {activeTrustee.name}
                                                </Typography>
                                                <Divider sx={{ my: 1.5 }} />
                                                <Typography><strong>Experience:</strong> {activeTrustee.experience}</Typography>
                                                <Typography><strong>Regulatory:</strong> {activeTrustee.regulatoryStatus}</Typography>
                                                <Typography><strong>Fee Structure:</strong> {activeTrustee.feeStructure}</Typography>
                                                <Typography><strong>Response Time:</strong> {activeTrustee.responseTime}</Typography>
                                                <Typography><strong>Past Issue:</strong>{activeTrustee.pastIssue}</Typography>
                                                <Typography><strong>Tech Capability:</strong>{activeTrustee.techCapability}</Typography>
                                                <Typography><strong>reputation/Rate:</strong>{activeTrustee.reputation}</Typography>
                                                <Typography><strong>Support In Charge Creation:</strong>{activeTrustee.supportInChargeCreation}</Typography>

                                                <Box textAlign="right" mt={3}>
                                                    <Button variant="contained" sx={{
                                                        bgcolor: '#1976d2',


                                                        boxShadow: 'none',
                                                        '&:hover': { bgcolor: '#1565c0', boxShadow: 'none', },
                                                    }}
                                                        onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Dialog>
                            </Card>
                        );
                    })}
                </Stack>


                {selectedTrustees?.length > 0 && (
                    <Grid item xs={12}>
                        <Box sx={{
                            mt: 3, display: 'flex',
                            justifyContent: 'flex-end', gap: 2,
                        }} >
                            <Button variant="contained"
                                sx={{
                                    bgcolor: '#1976d2',
                                    textTransform: 'none',
                                    color: '#fff',
                                    py: 1.5,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#1565c0', boxShadow: 'none', },
                                }} >
                                Send Request
                            </Button>

                            <Button variant="contained" disabled={checkedTrustees.length < 2}
                                sx={{ textTransform: 'none' }}
                                onClick={handleCompare}
                            >
                                Compare
                            </Button>

                        </Box>
                    </Grid>)}
            </Box>
        </FormProvider>
    );
}
