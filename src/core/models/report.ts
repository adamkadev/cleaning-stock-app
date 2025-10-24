export interface Report {
  id?: string;
  building: string;
  floor: string;
  room: string;
  products: string[];
  comment?: string;
  status: "Initial" | "En cours" | "Traité";
  createdAt: Date;
}
