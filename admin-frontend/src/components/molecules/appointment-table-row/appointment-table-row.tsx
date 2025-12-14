"use client";

import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import Button from "@/components/atoms/button/button";

interface TableRowProps {
  appointmentId: string;
  name: string;
  date: string;
  status?: string;
  onView: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ appointmentId, name, date, status, onView}) => {
  // Status badge styling
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Payment_Pending":
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const displayStatus = status === "Payment_Pending" ? "Payment Pending" : status || "Pending";

  return (
    <tr>
      <TableCell>#{appointmentId}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(status)}`}>
          {displayStatus}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex gap-[54px]">
          <Button variant="primary" size="small" onClick={onView}>
            View
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};

export default TableRow;