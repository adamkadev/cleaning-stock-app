"use client";

import { useSearchParams } from "next/navigation";
import ReportForm from "./components/ReportForm";
import { Typography, Paper, Container } from "@mui/material";

export default function ReportPage() {
  const searchParams = useSearchParams();

  const building = searchParams.get("building") || "";
  const floor = searchParams.get("floor") || "";
  const room = searchParams.get("room") || "";

  return (
      <Container
        maxWidth={false}
        sx={{
          maxWidth: { xs: "100%", md: 600 },
          mt: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
        }}
      >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          Signalement de stock
        </Typography>

        <ReportForm building={building} floor={floor} room={room} />
      </Paper>
    </Container>
  );
}
