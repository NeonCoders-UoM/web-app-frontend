'use client';

import { useState } from "react";
import { ServiceStatusDataTableRow } from "@/components/molecules/service-status-data-table-row/service-status-data-table-row";

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
};

type TableProps = {
  data: RowData[];
};

export const ServiceStatusDataTable = ({ data }: TableProps) => {
  const [rows, setRows] = useState(data);

  const handleToggle = (index: number) => {
    const updated = [...rows];
    updated[index].checked = !updated[index].checked;
    setRows(updated);
  };

  return (
    <div>
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {rows.map((row, index) => (
            <ServiceStatusDataTableRow
              key={index}
              checked={row.checked}
              onToggle={() => handleToggle(index)}
              service={row.service}
              serviceCenter={row.serviceCenter}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};