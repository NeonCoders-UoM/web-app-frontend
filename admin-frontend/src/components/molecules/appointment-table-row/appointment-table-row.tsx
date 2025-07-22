"use client";

import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import Button from "@/components/atoms/button/button";

interface TableRowProps {
  appointmentId: string;
  name: string;
  date: string;
  onView: () => void;
  
}

const TableRow: React.FC<TableRowProps> = ({ appointmentId, name, date, onView}) => {
  return (
    <tr>
      <TableCell>#{appointmentId}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{date}</TableCell>
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