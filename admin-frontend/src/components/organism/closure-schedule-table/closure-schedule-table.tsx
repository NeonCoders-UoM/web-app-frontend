"use client";

import { useEffect, useState } from "react";
import { TableRow } from "@/components/molecules/closure-schedule-row/closure-schedule-row";
import Pagination from "@/components/molecules/pagination/pagination";
import SearchBar from "@/components/atoms/search-bar/search-bar";

type RowData = {
  id: string;
  label: string;
  checked: boolean;
  price?: number;
  category?: string;
  description?: string;
};

type TableProps = {
  data: RowData[];
};

export const Table = ({ data }: TableProps) => {
  const [rows, setRows] = useState<RowData[]>(data);
  const [filteredRows, setFilteredRows] = useState<RowData[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle toggle
  const handleToggle = (id: string) => {
    const updated = rows.map((row) =>
      row.id === id ? { ...row, checked: !row.checked } : row
    );
    setRows(updated);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
  };

  // Search effect
  useEffect(() => {
    const filtered = rows.filter(
      (row) =>
        row.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.category &&
          row.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.description &&
          row.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRows(filtered);
    setCurrentPage(1);
  }, [rows, searchTerm]);

  // Reset to page 1 on items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Update rows when data changes
  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFilterClick={() => console.log("Filters clicked")}
        placeholder="Search services..."
      />

      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-sm font-medium text-neutral-600">
            <th className="pb-2">Service</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <TableRow
              key={row.id}
              label={row.label}
              checked={row.checked}
              price={row.price}
              category={row.category}
              description={row.description}
              onToggle={() => handleToggle(row.id)}
              onDelete={() => handleDelete(row.id)}
            />
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
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
