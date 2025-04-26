'use client';

import { ServiceStatusDataTableRow } from "@/components/molecules/service-status-data-table-row/service-status-data-table-row";

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
};

type TableProps = {
  data: RowData[];
  onToggle: (index: number) => void;
};

export const ServiceStatusDataTable = ({ data, onToggle }: TableProps) => {
  return (
    <div>
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {data.map((row, index) => (
            <ServiceStatusDataTableRow
              key={index}
              checked={row.checked}
              onToggle={() => onToggle(index)}
              service={row.service}
              serviceCenter={row.serviceCenter}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};