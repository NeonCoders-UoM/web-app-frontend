'use client';

import { ServiceStatusDataTableRow } from "@/components/molecules/service-status-data-table-row/service-status-data-table-row";

type RowData = {
  service: string;
  checked: boolean;
  serviceCenter: string;
  price?: number;
};

type TableProps = {
  data: RowData[];
  onToggle: (index: number) => void;
  showPrice?: boolean;
};

export const ServiceStatusDataTable = ({ data, onToggle, showPrice }: TableProps) => {
  return (
    <div>
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="text-left">Service</th>
            {showPrice && <th className="text-left">Price (LKR)</th>}
            <th className="text-left">Checked</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <ServiceStatusDataTableRow
              key={index}
              checked={row.checked}
              onToggle={() => onToggle(index)}
              service={row.service}
              // serviceCenter={row.serviceCenter}
              price={showPrice ? row.price : undefined}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};