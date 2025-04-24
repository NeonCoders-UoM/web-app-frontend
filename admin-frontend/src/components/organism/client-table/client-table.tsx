"use client"

import React, { useState, useEffect } from "react"
import TableHead from "@/components/molecules/table-head/table-head"
import { TableRow } from "@/components/molecules/client-table-row/client-table-row"
import Pagination from "@/components/molecules/pagination/pagination"
import SearchBar from "@/components/atoms/search-bar/search-bar"

interface Header {
  title: string
  sortable?: boolean
}

interface TableProps {
  headers: Header[]
  data: Record<string, string>[]
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[]
  showSearchBar?: boolean
  showClientCell?: boolean
  onActionSelect?: (action: string, clientId: string) => void
}

const ClientTable: React.FC<TableProps> = ({
  headers,
  data,
  actions,
  showSearchBar = false,
  showClientCell = false,
  onActionSelect,
}) => {
  const [filteredData, setFilteredData] = useState<Record<string, string>[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [sortConfig, setSortConfig] = useState<{
    column: string
    direction: "asc" | "desc"
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const columnKeys = headers.map((header) =>
    header.title.toLowerCase().replace(/\s+/g, "").replace(/\./g, "")
  )

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleSort = (index: number) => {
    const column = columnKeys[index]
    let direction: "asc" | "desc" = "asc"

    if (sortConfig?.column === column && sortConfig.direction === "asc") {
      direction = "desc"
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[column] || ""
      const bValue = b[column] || ""
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

    setSortConfig({ column, direction })
    setFilteredData(sorted)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    const filtered = data.filter((row) =>
      Object.values(row).some((cell) =>
        cell.toLowerCase().includes(value.toLowerCase())
      )
    )

    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const handleFilterClick = () => {
    console.log("Filter button clicked")
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

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

      <table className="w-full border-collapse neutral-100 shadow-md rounded-lg mt-16">
        <TableHead headers={headers} onSort={handleSort} />
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <TableRow
                key={index}
                row={row}
                actions={actions}
                columns={columnKeys}
                showClientCell={showClientCell}
                onActionSelect={onActionSelect}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="text-center p-4 text-neutral-600"
              >
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
  )
}

export default ClientTable