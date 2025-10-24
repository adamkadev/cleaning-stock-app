"use client";

import { useSearchParams } from "next/navigation";
import ReportForm from "./components/ReportForm";

export default function ReportPage() {
  const searchParams = useSearchParams();

  const building = searchParams.get("building") || "";
  const floor = searchParams.get("floor") || "";
  const room = searchParams.get("room") || "";

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Signalement de stock</h1>
      <ReportForm building={building} floor={floor} room={room} />
    </div>
  );
}
