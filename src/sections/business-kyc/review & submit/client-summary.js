import { Card, Typography, Grid, Box, IconButton, Link, Tooltip } from "@mui/material";
import Iconify from "src/components/iconify";


export default function ClientSummary({ data }) {
    const clients = data?.clients || data?.data?.clients || [];
    console.log('eheiudffdeDATAAAAAAAA', clients)
    return (
        <>

            <Box mb={2} mt={2} display="flex" justifyContent="center">
                <Typography variant="h5" color="primary" >Client Summary</Typography>
            </Box>


            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ maxWidth: '900px', mx: 'auto', mb: 4 }}
            >

                {clients.map((client, index) => (
                    <Grid key={index} item xs={12} md={6}>
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
                                { label: "GSTIN", value: client?.gstin },
                                { label: "Turnover (CR)", value: client?.turnover },
                                { label: "CREDIT DAYS:", value: client?.creditDays },
                                { label: "Relationship", value: `${client?.relationship} years` },
                                {
                                    label: "Invoice File",
                                    value: (
                                        <Tooltip title={client.invoice?.fileName || ""} arrow>
                                            <Link
                                                component="button"
                                                noWrap
                                                underline="hover"
                                                sx={{
                                                    cursor: 'pointer',
                                                    maxWidth: 140,
                                                    display: 'inline-block',
                                                }}
                                                fontSize={13}
                                            >
                                                {client.invoice?.fileName || '-'}
                                            </Link>
                                        </Tooltip>
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
                                    <Grid item xs={8} md={8}>
                                        <Typography
                                            variant="body2" fontWeight={600}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Grid>
                                    <Grid sx={{ textAlign: "right" }} item xs={4} md={4}>
                                        <Typography variant="body2" fontWeight={500}>
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

