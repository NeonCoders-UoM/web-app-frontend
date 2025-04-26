import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import Button from "@/components/atoms/button/button";

interface TableRowProps {
  data: string[];
  actions?: {
    label: string;
    variant: "primary" | "success" | "danger";
    icon?: "save" | "send" | "check" | "close" | "loading" | "delete";
    onClick: () => void;
  }[];
}

const TableRow: React.FC<TableRowProps> = ({ data, actions }) => {
  return (
    <tr className="hover:bg-gray-100">
      {data.map((item, index) => (
        <TableCell key={index}>{item}</TableCell>
      ))}
      {actions && (
        <TableCell className="flex gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant} icon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </TableCell>
      )}
    </tr>
  );
};

export default TableRow;