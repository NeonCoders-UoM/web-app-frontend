// src/components/organism/table/table.tsx
import React, { useState, useEffect } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/table-row/table-row";
import Pagination from "@/components/molecules/pagination/pagination";
import SearchBar from "@/components/atoms/search-bar/search-bar";

interface TableProps {
  headers: { title: string; sortable?: boolean }[];
  data: string[][];
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
  hideActions?: boolean;
  showSearchBar?: boolean;
  onAction?: (action: string, row: string[]) => void;
  onServiceCenterClick?: (id: string) => void;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  actions,
  hideActions = false,
  showSearchBar = false,
  onAction,
  onServiceCenterClick,
}) => {
  const [filteredData, setFilteredData] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Increased to avoid pagination
  const [sortConfig, setSortConfig] = useState<{
    column: number;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSort = (index: number) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.column === index && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredData].sort((a, b) => {
      const result = a[index].localeCompare(b[index]);
      return direction === "asc" ? result : -result;
    });

    setSortConfig({ column: index, direction });
    setFilteredData(sorted);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = data.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(value.toLowerCase()))
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFilterClick = () => {
    console.log("Filters button clicked");
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="overflow-x-auto">
      {showSearchBar && (
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onFilterClick={handleFilterClick}
          placeholder="Search by name, type, brand, or other..."
        />
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg mt-[48px]">
        <TableHead headers={headers} onSort={handleSort} />
        <tbody>
          {paginatedData.map((row, index) => (
            <TableRow
              key={index}
              data={row}
              actions={actions}
              hideActions={hideActions}
              onAction={onAction}
              onServiceCenterClick={onServiceCenterClick}
            />
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-[40px]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default Table;