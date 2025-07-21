import React from "react";
import TableHead from "@/components/molecules/table-head/table-head";
import TableRow from "@/components/molecules/table-row/table-row";
import ToggleButton from "@/components/atoms/toggle-button/toggle-button";

interface ServiceAvailabilityData {
  id: string;
  label: string;
  checked: boolean;
  price: number;
  category: string;
  description: string;
}

interface ServiceAvailabilityTableProps {
  data: ServiceAvailabilityData[];
  onToggle: (serviceId: string, currentAvailability: boolean) => void;
}

const ServiceAvailabilityTable: React.FC<ServiceAvailabilityTableProps> = ({
  data,
  onToggle,
}) => {
  const headers = [
    { title: "Service ID", sortable: true },
    { title: "Service Name", sortable: true },
    { title: "Category", sortable: true },
    { title: "Price (LKR)", sortable: true },
    { title: "Description", sortable: false },
    { title: "Availability", sortable: false },
  ];

  const tableData = data.map((service) => [
    `#SC-${service.id.padStart(4, "0")}`,
    service.label,
    service.category,
    `${service.price} LKR`,
    service.description,
    "", // Placeholder for toggle button
  ]);

  const handleToggle = (rowIndex: number) => {
    const service = data[rowIndex];
    onToggle(service.id, service.checked);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg mt-[48px]">
        <TableHead headers={headers} onSort={() => {}} />
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="bg-blue-50 text-neutral-600 font-regular text-md">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 h-12">
                  {cellIndex === 5 ? (
                                         <div className="flex items-center justify-center">
                       <ToggleButton
                         checked={data[index].checked}
                         onChange={() => handleToggle(index)}
                       />
                     </div>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceAvailabilityTable; 