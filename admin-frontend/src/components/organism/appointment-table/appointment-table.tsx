import React, { useState, useEffect } from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/appointment-table-row/appointment-table-row";
import Pagination from "@/components/molecules/pagination/pagination";

interface Appointment {
  id: string;
  name: string;
  date: string;
  status?: string;
}

interface TableProps {
  data: Appointment[];
  onView: (appointment: Appointment) => void;
}

const Table: React.FC<TableProps> = ({ data, onView }) => {
  const [sortedData, setSortedData] = useState<Appointment[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleSort = (index: number) => {
    let sorted = [...sortedData];
    switch (index) {
      case 0:
        sorted = sortAsc
          ? sorted.sort((a, b) => a.id.localeCompare(b.id))
          : sorted.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 1:
        sorted = sortAsc
          ? sorted.sort((a, b) => a.name.localeCompare(b.name))
          : sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 2:
        sorted = sortAsc
          ? sorted.sort((a, b) => a.date.localeCompare(b.date))
          : sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 3:
        sorted = sortAsc
          ? sorted.sort((a, b) => (a.status || "").localeCompare(b.status || ""))
          : sorted.sort((a, b) => (b.status || "").localeCompare(a.status || ""));
        break;
    }
    setSortedData(sorted);
    setSortAsc(!sortAsc);
    setCurrentPage(1);
  };

  const handleAccept = (appointment: Appointment) => {
    console.log(`Accept clicked for appointment ${appointment.id}`);
  };

  const handleReject = (appointment: Appointment) => {
    console.log(`Reject clicked for appointment ${appointment.id}`);
  };

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
      <table className="w-full border-collapse border-neutral-400 bg-white">
        <TableHead
          headers={[
            { title: "Appointment ID", sortable: true },
            { title: "Name", sortable: true },
            { title: "Date", sortable: true },
            { title: "Status", sortable: true },
            { title: "", sortable: false },
          ]}
          onSort={handleSort}
        />
        <tbody>
          {paginatedData.map((appointment) => (
            <TableRow
              key={appointment.id}
              appointmentId={appointment.id}
              name={appointment.name}
              date={appointment.date}
              status={appointment.status}
              onView={() => onView(appointment)}
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