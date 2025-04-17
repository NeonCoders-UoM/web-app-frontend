"use client";

import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import { ClientCell } from "@/components/molecules/client-cell/client-cell";
import KebabMenuWithActions from "@/components/molecules/kebab-menu-with-actions/kebab-menu-with-actions";

interface TableRowProps {
  row: Record<string, string>;
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
  columns: string[];
  showClientCell?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  actions,
  columns,
  showClientCell = false,
}) => {
  return (
    <tr className="hover:bg-neutral-100 transition-colors">
      {columns.map((key, index) => {
        const value = row[key] || "";

        if (showClientCell && key === "client") {
          return (
            <TableCell key={index}>
              <ClientCell name={value} pictureSrc={row.pictureSrc || ""} />
            </TableCell>
          );
        }

        return <TableCell key={index}>{value}</TableCell>;
      })}

    <TableCell>
      <KebabMenuWithActions actions={actions} />
    </TableCell>
    </tr>
  );
};