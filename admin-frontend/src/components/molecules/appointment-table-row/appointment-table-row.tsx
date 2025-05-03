"use client";

import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import Button from "@/components/atoms/button/button";

interface TableRowProps {
  appointmentId: string;
  name: string;
  date: string;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ appointmentId, name, date, onView, onAccept, onReject }) => {
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
          <button className="w-[123px] h-[40px] px-[16px] rounded-xl text-white text-sm bg-green-500 hover:bg-green-600 active:bg-green-400" onClick={onAccept}>
            Accept
          </button>
          <button className="w-[123px] h-[40px] px-[16px] rounded-xl text-white text-sm bg-red-500 hover:bg-red-600 active:bg-red-400" onClick={onReject}>
            Reject
          </button>
        </div>
      </TableCell>
    </tr>
  );
};

export default TableRow;