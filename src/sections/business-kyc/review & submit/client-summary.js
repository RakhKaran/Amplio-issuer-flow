import { Card, Typography, Grid, Box, IconButton, Link } from "@mui/material";
import Iconify from "src/components/iconify";

const clients = [
    {
        name: "Mahindra & Mahindra",
        gstin: "27XXXXXXXX5",
        turnover: "₹ 500 Cr",
        creditDays: "45",
        relationship: "10 Years",
        invoiceFile: "Uploaded",
    },
    {
        name: "Tata Motor LTD",
        gstin: "27XXXXXXXX5",
        turnover: "₹ 500 Cr",
        creditDays: "45",
        relationship: "10 Years",
        invoiceFile: "Uploaded",
    },
    {
        name: "Reliance Retails",
        gstin: "27XXXXXXXX5",
        turnover: "₹ 500 Cr",
        creditDays: "45",
        relationship: "10 Years",
        invoiceFile: "Uploaded",
    },
    {
        name: "Adani Power LTD",
        gstin: "27XXXXXXXX5",
        turnover: "₹ 500 Cr",
        creditDays: "45",
        relationship: "10 Years",
        invoiceFile: "Uploaded",
    },
];

export default function ClientSummary() {
    return (
        <>

            <Box mb={2} mt={2} display="flex" justifyContent="center">
                <Typography variant="h5" color="primary" >Client Summary</Typography>
            </Box>

            <Grid
                container
                spacing={2}
                columns={8}
                justifyContent="center"
                sx={{ px: { xs: 0, sm: 4, md: 25 } }}
            >
                {clients.map((client, index) => (
                    <Grid key={index} item xs={8} md={4}>
                        <Card sx={{ p: 3, width: "100%" }}>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                                mb={2}
                            >
                                <Grid item>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {client.name}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="small">
                                        <Iconify icon="solar:pen-bold" width={18} />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            {[
                                { label: "GSTIN", value: client.gstin },
                                { label: "Turnover (CR)", value: client.turnover },
                                { label: "CREDIT DAYS:", value: client.creditDays },
                                { label: "Relationship", value: client.relationship },
                                {
                                    label: "Invoice File",
                                    value: (
                                        <Link component="button" underline="hover" fontSize={13}>
                                            {client.invoiceFile}
                                        </Link>
                                    ),
                                },
                            ].map((item, idx) => (
                                <Grid
                                    container
                                    key={idx}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 1 }}
                                >
                                    <Grid item xs={6}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.label}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" pl={8} display="flex" justifyContent="flex-start" fontWeight={500}>
                                            {item.value}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Card>
                    </Grid>
                ))}
            </Grid>


        </>
    );
}

