import React, { useState, useEffect } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/table-row/table-row";
import Pagination from "@/components/molecules/pagination/pagination";
import SearchBar from "@/components/atoms/search-bar/search-bar";

interface TableProps {
  headers: { title: string; sortable?: boolean }[];
  data: string[][];
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
  showSearchBar?: boolean;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  actions,
  showSearchBar = false,
}) => {
  const [filteredData, setFilteredData] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
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
    // TODO: Open a filter modal or toggle filter UI
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

      <table className="w-full border-collapse bg-white shadow-md rounded-lg mt-16">
        <TableHead headers={headers} onSort={handleSort} />
        <tbody>
          {paginatedData.map((row, index) => (
            <TableRow key={index} data={row} actions={actions} />
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
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