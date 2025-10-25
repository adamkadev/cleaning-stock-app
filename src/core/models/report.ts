export interface Report {
  id?: string;
  building: string;
  floor: string;
  products: string[];
  status: "Initial" | "En cours" | "Traité";
  createdAt: Date;
}
