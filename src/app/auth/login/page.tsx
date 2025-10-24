"use client";

import { useState } from "react";
import { auth, googleProvider } from "@/core/services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useToast } from "@/shared/hooks/useToast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Connexion réussie");
      router.push("/admin");
    } catch (error) {
      toast.error("❌ Email ou mot de passe incorrect: " + error, );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("✅ Connexion Google réussie");
      router.push("/admin");
    } catch (error) {
      toast.error("❌ Erreur de connexion Google: " + error);
    }
  };

  return (
    <Box className="max-w-sm mx-auto mt-20 p-6 border rounded shadow flex flex-col gap-4">
      <Typography variant="h5" className="text-center font-bold">
        Connexion Admin
      </Typography>

      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
      />

      <Button variant="contained" onClick={handleEmailLogin}>
        Se connecter
      </Button>

      <Button variant="outlined" onClick={handleGoogleLogin}>
        Se connecter avec Google
      </Button>
    </Box>
  );
}
