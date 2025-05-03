'use client';

import React, { useState, useMemo, useEffect, useRef } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/feedback-table-row/feedback-table-row";
import Pagination from "@/components/molecules/pagination/pagination";
import FeedbackCard from "@/components/molecules/feedback-card/feedback-card";

interface Feedback {
  profileSrc: string;
  profileAlt: string;
  clientName: string;
  clientId: string;
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

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleSort = (index: number) => {
    const key = ["clientName", "stars", "serviceCenter", "date", "feedback"][index] as keyof Feedback;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleViewClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <TableHead
          headers={[
            { title: "Client Name", sortable: true },
            { title: "Stars", sortable: true },
            { title: "Service Center", sortable: true },
            { title: "Date", sortable: true },
            { title: "Feedback", sortable: true },
          ]}
          onSort={handleSort}
        />
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={index} data={item} onViewClick={handleViewClick} />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-neutral-500 py-4">
                No results found.
              </td>
            </tr>
          )}
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

      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="relative">
            <FeedbackCard
              profileSrc={selectedFeedback.profileSrc}
              profileAlt={selectedFeedback.profileAlt}
              name={selectedFeedback.clientName}
              clientId={selectedFeedback.clientId}
              serviceCenter={selectedFeedback.serviceCenter}
              rating={selectedFeedback.stars}
              feedback={selectedFeedback.feedback}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;