"use client";

import { useState } from "react";
import { Report } from "@/core/models/report";
import { PRODUCTS } from "@/core/utils/constants";
import { addReport } from "@/core/services/reportService";
import { useToast } from "@/shared/hooks/useToast";
import { Checkbox, FormControlLabel, TextField, Button } from "@mui/material";

interface ReportFormProps {
  building: string;
  floor: string;
  room: string;
}

export default function ReportForm({ building, floor, room }: ReportFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const toast = useToast();

  const toggleProduct = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );
  };

  const handleSubmit = async () => {
    try {
      const report: Report = {
        building,
        floor,
        room,
        products: selectedProducts,
        comment,
        status: "Initial",
        createdAt: new Date(),
      };

      await addReport(report);
      toast.success("✅ Signalement envoyé avec succès");
      setSelectedProducts([]);
      setComment("");
    } catch {
      toast.error("❌ Erreur lors de l'envoi du signalement");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <TextField label="Immeuble" value={building} disabled fullWidth />
      <TextField label="Étage" value={floor} disabled fullWidth />
      <TextField label="Pièce" value={room} disabled fullWidth />

      <div className="flex flex-col">
        {PRODUCTS.map(p => (
          <FormControlLabel
            key={p}
            control={<Checkbox checked={selectedProducts.includes(p)} onChange={() => toggleProduct(p)} />}
            label={p}
          />
        ))}
      </div>

      <TextField
        label="Commentaire (optionnel)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <Button variant="contained" onClick={handleSubmit}>
        Envoyer
      </Button>
    </div>
  );
}
