// src/components/molecules/table-row/table-row.tsx
import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import KebabMenuWithActions from "@/components/molecules/kebab-menu-with-actions/kebab-menu-with-actions";

interface TableRowProps {
  data: string[];
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
  onAction?: (action: string, row: string[]) => void;
  onServiceCenterClick?: (id: string) => void; // New prop
}

const TableRow: React.FC<TableRowProps> = ({ data, actions, onAction, onServiceCenterClick }) => {
  const handleActionSelect = (action: string) => {
    if (onAction) {
      onAction(action, data);
    }
  };

  return (
    <tr className="hover:bg-neutral-100">
      {data.map((item, index) => (
        <TableCell key={index}>
          {index === 1 && onServiceCenterClick ? (
            <button
              onClick={() => onServiceCenterClick(data[0])} // data[0] is the ID
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {item}
            </button>
          ) : (
            item
          )}
        </TableCell>
      ))}
      <td className="px-4 py-2 text-right border-b">
        <KebabMenuWithActions actions={actions} onActionSelect={handleActionSelect} />
      </td>
    </tr>
  );
};

export default TableRow;