"use client";

import { useEffect, useState } from "react";
import { subscribeReports, updateReportStatus } from "@/core/services/reportService";
import { Report } from "@/core/models/report";
import { STATUS } from "@/core/utils/constants";
import { Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, Box } from "@mui/material";
import StatusBadge from "./StatusBadge";

export default function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeReports(setReports);
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: Report["status"]) => {
    await updateReportStatus(id, status);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Immeuble</TableCell>
          <TableCell>Étage</TableCell>
          <TableCell>Pièce</TableCell>
          <TableCell>Produits</TableCell>
          <TableCell>Commentaire</TableCell>
          <TableCell>État</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map(r => (
          <TableRow key={r.id}>
            <TableCell>{r.building}</TableCell>
            <TableCell>{r.floor}</TableCell>
            <TableCell>{r.room}</TableCell>
            <TableCell>{r.products.join(", ")}</TableCell>
            <TableCell>{r.comment}</TableCell>
            <TableCell>
              <Box className="flex items-center gap-2">
                <StatusBadge status={r.status} />
                <Select
                  value={r.status}
                  onChange={e => handleStatusChange(r.id!, e.target.value as Report["status"])}
                  size="small"
                >
                  {STATUS.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </Box>
            </TableCell>
            <TableCell>{r.createdAt?.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
