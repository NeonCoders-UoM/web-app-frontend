import React, { useState } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/table-row/table-row";

interface TableProps {
  headers: { title: string; sortable?: boolean }[];
  data: string[][];
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
}

const Table: React.FC<TableProps> = ({ headers, data, actions }) => {
  const [sortedData, setSortedData] = useState(data);

  const handleSort = (index: number) => {
    const sorted = [...sortedData].sort((a, b) => (a[index] > b[index] ? 1 : -1));
    setSortedData(sorted);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <TableHead headers={headers} onSort={handleSort} />
        <tbody>
          {sortedData.map((row, index) => (
            <TableRow key={index} data={row} actions={actions} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;