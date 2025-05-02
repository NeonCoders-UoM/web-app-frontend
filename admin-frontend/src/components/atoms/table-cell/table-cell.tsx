import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <td className={`px-[24px] py-[22px] border-b border-neutral-300 ${className}`}>{children}</td>;
};

export default TableCell;