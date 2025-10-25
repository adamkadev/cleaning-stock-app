export interface Report {
  id?: string;
  building: string;
  floor: string;
  consumables: string[];
  status: "Initial" | "En cours" | "Traité";
  createdAt: Date;
}
