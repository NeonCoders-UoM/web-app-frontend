import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <td className={`px-4 py-3 border-b ${className}`}>{children}</td>;
};

export default TableCell;