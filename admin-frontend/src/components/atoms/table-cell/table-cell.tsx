import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <td className={`px-[16px] py-[16px] border-b border-neutral-300 truncate max-w-0 text-sm sm:text-base ${className}`}>{children}</td>;
};

export default TableCell;