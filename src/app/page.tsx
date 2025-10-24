"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <Typography variant="h3" className="font-bold text-center">
        Bienvenue dans le système de gestion des stocks
      </Typography>

      <Typography variant="body1" className="text-center max-w-md">
        Utilisez les liens ci-dessous pour signaler les produits manquants ou accéder au tableau de bord admin.
      </Typography>

      <Box className="flex gap-4">
        <Link href="/report?building=A&floor=1&room=WCfemmes" passHref>
          <Button variant="contained">Faire un signalement</Button>
        </Link>
        <Link href="/auth/login" passHref>
          <Button variant="outlined">Portail administrateur</Button>
        </Link>
      </Box>
    </Box>
  );
}
