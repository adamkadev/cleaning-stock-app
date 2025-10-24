"use client";

import "./globals.css";
import { ReactNode, useState, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  AppBar,
  Toolbar,
  Box,
  Container,
  Tooltip,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? "dark" : "light" },
        typography: {
          fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
        },
      }),
    [darkMode]
  );

  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* AppBar */}
          <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
              borderBottom: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "grey.800" : "grey.200",
              backdropFilter: "blur(8px)",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              {/* Logo */}
              <Link
                href="https://allianceservicesproprete.github.io"
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo.png"
                  alt="Logo Alliance Services Propreté"
                  width={120}
                  height={120}
                  priority
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Link>

              {/* Dark/Light Mode Switch */}
              <Tooltip
                title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label="Changer le thème"
                  color="inherit"
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          {/* Contenu principal */}
          <main>
            <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
              {children}
            </Container>
          </main>

          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
