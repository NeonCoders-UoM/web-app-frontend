'use client';

import { useState, useEffect } from 'react';
import { TableRow } from '@/components/molecules/loyalty-points-row/loyalty-points-row';
import SearchBar from '@/components/atoms/search-bar/search-bar';
import Pagination from '@/components/molecules/pagination/pagination';

type RowData = {
  label: string;
  value: number;
};

type TableProps = {
  data: RowData[];
};

export const Table = ({ data }: TableProps) => {
  const [rows, setRows] = useState<RowData[]>(data);
  const [filteredRows, setFilteredRows] = useState<RowData[]>(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle input value change
  const handleChange = (index: number, newValue: number) => {
    const updated = [...rows];
    updated[index].value = newValue;
    setRows(updated);
  };

  // Handle row deletion
  const handleDelete = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  // Filter based on search term
  useEffect(() => {
    const filtered = rows.filter(row =>
      row.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
    setCurrentPage(1);
  }, [rows, searchTerm]);

  // Reset page on items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFilterClick={() => console.log('Filters clicked')}
        placeholder="Search by label..."
      />

      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {paginatedRows.map((row, index) => (
            <TableRow
              key={index}
              label={row.label}
              value={row.value}
              onChange={(val) => handleChange(index, val)}
              onDelete={() => handleDelete(rows.indexOf(row))}
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