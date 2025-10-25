export interface Report {
  id?: string;
  building: string;
  floor: number;
  consumables: string[];
  status: "Initial" | "En cours" | "Traité";
  createdAt: Date;
}
