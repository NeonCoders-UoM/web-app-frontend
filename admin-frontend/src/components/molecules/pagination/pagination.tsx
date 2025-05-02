'use client';

import React, { useState } from 'react';
import Dropdown from '@/components/atoms/dropdown/dropdown';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [selectedItems, setSelectedItems] = useState(itemsPerPage);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (items: string) => {
    const newItems = parseInt(items, 10);
    setSelectedItems(newItems);
    onItemsPerPageChange(newItems);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, maxVisiblePages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    const result = [];
    if (startPage > 1) {
      result.push(1);
    }
    result.push(...pages);
    if (endPage < totalPages) {
      result.push(totalPages);
    }

    return result.filter((page, index, self) => {
      if (page === '...') {
        return self.indexOf(page) === index;
      }
      return self.indexOf(page) === index;
    });
  };

  return (
    <div className="flex justify-between items-center w-full">
      
      <div className='flex justify-between items-center'>
        <p className='text-sm text-neutral-400 pr-[16px]'>Show Result:</p>
        <div className="w-[68px] h-[38px]">
        <Dropdown
          options={['6', '12', '20']}
          placeholder={`${selectedItems}`}
          onSelect={handleItemsPerPageChange}
          className="w-[68px]"
        />
      </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageClick(1)}
          className="px-2 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-md transition-colors"
          disabled={currentPage === 1}
          suppressHydrationWarning
        >
          «
        </button>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="px-2 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-md transition-colors"
          disabled={currentPage === 1}
          suppressHydrationWarning
        >
          &lt; 
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-neutral-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200'
              }`}
              suppressHydrationWarning
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-sm text-neutral-500">
              {page}
            </span>
          )
        )}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className="px-2 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-md transition-colors"
          disabled={currentPage === totalPages}
          suppressHydrationWarning
        >
          &gt;
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          className="px-2 py-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-md transition-colors"
          disabled={currentPage === totalPages}
          suppressHydrationWarning
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;