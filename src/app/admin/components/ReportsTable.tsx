"use client";

import { useEffect, useState } from "react";
import { subscribeReports, updateReportStatus } from "@/core/services/reportService";
import { Report } from "@/core/models/report";
import { STATUS } from "@/core/utils/constants";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StatusBadge from "./StatusBadge";
import { CSVLink } from "react-csv";

export default function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const unsubscribe = subscribeReports(setReports);
    return () => unsubscribe();
  }, []);

  // Cycle status on badge click
  const handleBadgeClick = (r: Report) => {
    const currentIndex = STATUS.indexOf(r.status);
    const nextStatus = STATUS[(currentIndex + 1) % STATUS.length];
    updateReportStatus(r.id!, nextStatus);
  };

  // Filter reports based on search input
  const filteredReports = reports.filter(
    (r) =>
      r.building.toLowerCase().includes(search.toLowerCase()) ||
      r.floor.toLowerCase().includes(search.toLowerCase()) ||
      r.room.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box className="p-4">
      {/* CSV Export */}
      <CSVLink
        data={reports}
        filename="reports.csv"
        className={`mb-4 inline-block px-4 py-2 rounded border transition ${
          isDarkMode
            ? "border-white bg-white text-black hover:bg-gray-200"
            : "border-black bg-black text-white hover:bg-gray-700"
        }`}
      >
        Export CSV
      </CSVLink>

      {/* Search */}
      <Box className="mb-6">
        <TextField
          label="Rechercher par immeuble, étage ou pièce"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Reports Table */}
      <Box className={`overflow-x-auto rounded-lg border border-gray-200 shadow ${isDarkMode ? "border-gray-700" : ""}`}>
        <Table className="min-w-full">
          <TableHead>
            <TableRow className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Immeuble</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Étage</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Pièce</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Produits</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Commentaire</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>État</TableCell>
              <TableCell className={`font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports.map((r, i) => (
              <TableRow
                key={r.id}
                className={`${
                  i % 2 === 0
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-white"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-50"
                } hover:${isDarkMode ? "bg-gray-600" : "bg-gray-100"} transition`}
              >
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{r.building}</TableCell>
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{r.floor}</TableCell>
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{r.room}</TableCell>
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{r.products.join(", ")}</TableCell>
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{r.comment}</TableCell>
                <TableCell className="py-2 px-4">
                  <StatusBadge
                    status={r.status}
                    onClick={() => handleBadgeClick(r)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className={`py-2 px-4 ${isDarkMode ? "text-white" : "text-black"}`}>{formatDate(r.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Box className="flex justify-between mt-4">
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Précédent
        </Button>
        <Button
          disabled={(page + 1) * rowsPerPage >= filteredReports.length}
          onClick={() => setPage(page + 1)}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
}
