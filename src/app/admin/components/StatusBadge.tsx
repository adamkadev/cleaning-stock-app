import { Chip } from "@mui/material";

interface StatusBadgeProps {
  status: "Initial" | "En cours" | "Traité";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = status === "Initial" ? "error" : status === "En cours" ? "warning" : "success";
  return <Chip label={status} color={color} size="small" />;
}
