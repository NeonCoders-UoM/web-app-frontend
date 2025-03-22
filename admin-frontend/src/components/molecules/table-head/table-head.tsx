import React from "react";
import TableHeader from "@/components/atoms/table-header/table-header";

interface TableHeadProps {
  headers: { title: string; sortable?: boolean }[];
  onSort: (index: number) => void;
}

const TableHead: React.FC<TableHeadProps> = ({ headers, onSort }) => {
  return (
    <thead className="bg-neutral-200">
      <tr>
        {headers.map((header, index) => (
          <TableHeader
            key={index}
            title={header.title}
            sortable={header.sortable}
            onSort={() => onSort(index)}
          />
        ))}
        <th className="w-12 border-b"></th>
      </tr>
    </thead>
  );
};

export default TableHead;