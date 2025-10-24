import AuthGuard from "@/core/guards/authGuard";
import ReportsTable from "./components/ReportsTable";

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        <ReportsTable />
      </div>
    </AuthGuard>
  );
}
