import { useState } from "react";
import { Report } from "@/core/models/report";
import { CONSUMABLES } from "@/core/utils/constants";
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
  floor: number;
}

export default function ReportForm({ building, floor }: ReportFormProps) {
  const [selectedConsumables, setSelectedConsumables] = useState<string[]>([]);
  const [error, setError] = useState("");
  const toast = useToast();

  const toggleConsumable = (consumable: string) => {
    setSelectedConsumables(prev =>
      prev.includes(consumable) ? prev.filter(p => p !== consumable) : [...prev, consumable]
    );
  };

  const handleSubmit = async () => {
    if (selectedConsumables.length === 0) {
      setError("Veuillez sélectionner au moins un consommable.");
      return;
    }

    try {
      const report: Report = {
        building,
        floor: Number(floor),
        consumables: selectedConsumables,
        status: "Initial",
        createdAt: new Date(),
      };

      await addReport(report);

      toast.success("Signalement envoyé avec succès !");
      setSelectedConsumables([]);
      setError("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'envoi du signalement";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 500, mx: "auto", px: 1 }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h6" sx={{ mb: 1 }}>Nouveau signalement</Typography>

      <TextField label="Bâtiment" value={building} disabled fullWidth />
      <TextField label="Étage" value={floor} disabled fullWidth />

      <FormGroup>
        {CONSUMABLES.map(p => (
          <FormControlLabel
            key={p}
            control={<Checkbox checked={selectedConsumables.includes(p)} onChange={() => toggleConsumable(p)} />}
            label={p}
          />
        ))}
        {error && <FormHelperText error>{error}</FormHelperText>}
      </FormGroup>

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 1 }} disabled={selectedConsumables.length === 0}>
        Envoyer
      </Button>
    </Box>
  );
}
