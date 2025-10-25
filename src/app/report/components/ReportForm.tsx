"use client";

import { useState } from "react";
import { Report } from "@/core/models/report";
import { PRODUCTS } from "@/core/utils/constants";
import { addReport } from "@/core/services/reportService";
import { useToast } from "@/shared/hooks/useToast";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Box,
  FormGroup,
  FormHelperText,
  Typography,
} from "@mui/material";

interface ReportFormProps {
  building: string;
  floor: string;
}

export default function ReportForm({ building, floor }: ReportFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [error, setError] = useState("");
  const toast = useToast();

  const toggleProduct = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      setError("Veuillez sélectionner au moins un produit");
      return;
    }

    try {
      const report: Report = {
        building,
        floor,
        products: selectedProducts,
        status: "Initial",
        createdAt: new Date(),
      };

      await addReport(report);
      toast.success("Signalement envoyé avec succès");
      setSelectedProducts([]);
      setError("");
    } catch {
      toast.error("Erreur lors de l'envoi du signalement");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        px: 1,
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Nouveau signalement
      </Typography>

      <TextField label="Bâtiment" value={building} disabled fullWidth />
      <TextField label="Étage" value={floor} disabled fullWidth />

      <FormGroup>
        {PRODUCTS.map(p => (
          <FormControlLabel
            key={p}
            control={
              <Checkbox
                checked={selectedProducts.includes(p)}
                onChange={() => toggleProduct(p)}
              />
            }
            label={p}
          />
        ))}
        {error && <FormHelperText error>{error}</FormHelperText>}
      </FormGroup>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 1 }}
        disabled={selectedProducts.length === 0}
      >
        Envoyer
      </Button>
    </Box>
  );
}
