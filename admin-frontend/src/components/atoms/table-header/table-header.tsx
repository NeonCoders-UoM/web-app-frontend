import React from "react";
import { ArrowDownUp } from "lucide-react";
import colors from "@/styles/colors";

interface TableHeaderProps {
  title: string;
  sortable?: boolean;
  onSort?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title, sortable, onSort }) => {
  return (
    <th
      className="px-[24px] py-[22px] text-left font-semibold border-b border-neutral-400 cursor-pointer select-none "
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-2">
        <span>{title}</span>
        {sortable && <ArrowDownUp size={16} className="text-neutral-500" style={{ color: colors.primary[100] }} />}
      </div>
    </th>
  );
};

export default TableHeader;