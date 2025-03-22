import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import KebabMenuWithActions from "@/components/molecules/kebab-menu-with-actions/kebab-menu-with-actions";

interface TableRowProps {
  data: string[];
  actions: ("edit" | "delete" | "view" | "loyaltyPoints")[];
}

const TableRow: React.FC<TableRowProps> = ({ data, actions }) => {
  return (
    <tr className="hover:bg-neutral-100">
      {data.map((item, index) => (
        <TableCell key={index}>{item}</TableCell>
      ))}
      <td className="px-4 py-2 text-right border-b">
        <KebabMenuWithActions actions={actions} />
      </td>
    </tr>
  );
};

export default TableRow;