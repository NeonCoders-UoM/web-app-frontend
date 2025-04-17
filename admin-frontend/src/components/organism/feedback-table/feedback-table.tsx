import React, { useState, useMemo, useEffect } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/feedback-table-row/feedback-table-row";
import Pagination from "@/components/molecules/pagination/pagination";
import SearchBar from "@/components/atoms/search-bar/search-bar";

interface Feedback {
  clientName: string;
  stars: number;
  serviceCenter: string;
  date: string;
  feedback: string;
}

interface TableProps {
  data: Feedback[];
}

const FeedbackTable: React.FC<TableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Feedback; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (index: number) => {
    const key = ["clientName", "stars", "serviceCenter"][index] as keyof Feedback;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterClick = () => {
    console.log("Filter button clicked");
    // filter modal or filter logic
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="overflow-x-auto">
      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        onFilterClick={handleFilterClick}
        placeholder="Search by name, stars, service center..."
      />

      <table className="w-full border-collapse bg-neutral-100 shadow-md rounded-lg mt-16">
        <TableHead
          headers={[
            { title: "Client Name", sortable: true },
            { title: "Stars", sortable: false },
            { title: "Service Center", sortable: true },
            { title: "Date", sortable: true },
            { title: "Feedback", sortable: true },
          ]}
          onSort={handleSort}
        />
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={index} data={item} />
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-neutral-600 py-4">
                No results found.
              </td>
            </tr>
          )}
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

export default FeedbackTable;