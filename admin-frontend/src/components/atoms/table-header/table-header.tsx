import React from "react";
import { ArrowDownUp } from "lucide-react";

interface TableHeaderProps {
  title: string;
  sortable?: boolean;
  onSort?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title, sortable, onSort }) => {
  return (
    <th
      className="px-4 py-3 text-left font-semibold border-b cursor-pointer select-none"
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-2">
        <span>{title}</span>
        {sortable && <ArrowDownUp size={16} className="text-neutral-500" />}
      </div>
    </th>
  );
};

export default TableHeader;