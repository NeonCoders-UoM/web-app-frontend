import React, { useEffect, useState } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import OrderRow from "@/components/molecules/service-history-table-row/service-history-table-row";
import Pagination from "@/components/molecules/pagination/pagination";
import SearchBar from "@/components/atoms/search-bar/search-bar";

type Order = {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  type: string;
  date: string;
  serviceCenter: string;
  status: "Completed" | "Pending" | "Cancelled";
  image: string;
};

type OrdersTableProps = {
  orders: Order[];
  showSearchBar?: boolean;
};

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  showSearchBar = false,
}) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    column: number;
    direction: "asc" | "desc";
  } | null>(null);

  const headers = [
    { title: "Order Details", sortable: true },
    { title: "Order Type", sortable: true },
    { title: "Date", sortable: true },
    { title: "Service Center Name", sortable: true },
    { title: "Status", sortable: true },
  ];

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSort = (index: number) => {
    const keyMap = ["title", "type", "date", "serviceCenter", "status"];
    const key = keyMap[index] as keyof Order;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.column === index && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredOrders].sort((a, b) => {
      const aValue = a[key].toString().toLowerCase();
      const bValue = b[key].toString().toLowerCase();
      const result = aValue.localeCompare(bValue);
      return direction === "asc" ? result : -result;
    });

    setSortConfig({ column: index, direction });
    setFilteredOrders(sorted);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = orders.filter((order) =>
      Object.values(order).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleFilterClick = () => {
    console.log("Filter button clicked");
    // TODO: Open filter UI/modal
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="overflow-x-auto mt-16">
      {showSearchBar && (
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onFilterClick={handleFilterClick}
          placeholder="Search orders by name, type, date..."
        />
      )}

      <table className="w-full border-collapse bg-neutral-100 shadow-md rounded-lg mt-16">
        <TableHead headers={headers} onSort={handleSort} />
        <tbody>
          {paginatedOrders.map((order) => (
            <OrderRow key={order.id} order={order} />
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

export default OrdersTable;