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
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StatusBadge from "./StatusBadge";
import { CSVLink } from "react-csv";

export default function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeReports(setReports);
    return () => unsubscribe();
  }, []);

  const handleBadgeClick = (r: Report) => {
    const currentIndex = STATUS.indexOf(r.status);
    const nextStatus = STATUS[(currentIndex + 1) % STATUS.length];
    updateReportStatus(r.id!, nextStatus);
  };

  const filteredReports = reports.filter((r) => {
    return (
      (filterBuilding === "" || r.building.toLowerCase().includes(filterBuilding.toLowerCase())) &&
      (filterStatus === "" || r.status === filterStatus)
    );
  });

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
    <Box sx={{ p: 4 }}>
      {/* CSV Export */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <CSVLink
          data={reports}
          filename="reports.csv"
          className="inline-block px-4 py-2 rounded border transition"
          style={{
            backgroundColor: "transparent",
            color: "inherit",
            border: "1px solid currentColor",
          }}
        >
          Exporter le CSV
        </CSVLink>
      </Box>

      {/* Filters */}
      <Box className="flex flex-wrap gap-4 mb-6">
        <TextField
          label="Bâtiment"
          value={filterBuilding}
          onChange={(e) => setFilterBuilding(e.target.value)}
          size="small"
        />
        <TextField
          label="État"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          select
          slotProps={{
            inputLabel: { shrink: true },
            select: { native: false },
          }}
        >
          <MenuItem value="">Tous</MenuItem>
          {STATUS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Reports Table */}
      <Box
        sx={{
          overflowX: "auto",
          border: "1px solid",
          borderColor: isDarkMode ? "grey.700" : "grey.200",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: isDarkMode ? "grey.800" : "grey.100" }}>
              <TableCell sx={{ fontWeight: "bold", width: 200 }}>Bâtiment</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 80 }}>Étage</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 250 }}>Consommables</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 130 }}>État</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 160 }}>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedReports.map((r, i) => (
              <TableRow
                key={r.id}
                sx={{
                  backgroundColor:
                    i % 2 === 0 ? (isDarkMode ? "grey.800" : "white") : (isDarkMode ? "grey.700" : "grey.50"),
                  "&:hover": {
                    backgroundColor: isDarkMode ? "grey.600" : "grey.100",
                  },
                }}
              >
                <TableCell sx={{ whiteSpace: "nowrap", py: 1 }}>{r.building}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", py: 1 }}>{r.floor}</TableCell>
                <TableCell sx={{ py: 1, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.consumables.join(", ")}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <StatusBadge
                    status={r.status}
                    onClick={() => handleBadgeClick(r)}
                    className="whitespace-nowrap"
                  />
                </TableCell>                
                <TableCell sx={{ py: 1 }}>{formatDate(r.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
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
