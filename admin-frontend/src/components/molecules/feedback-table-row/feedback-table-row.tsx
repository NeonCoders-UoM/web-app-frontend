import React from "react";
import TableCell from "@/components/atoms/table-cell//table-cell";
import { Eye } from "lucide-react";
import StarRating from "@/components/atoms/star-rating/star-rating";

interface TableRowProps {
  data: {
    clientName: string;
    stars: number;
    serviceCenter: string;
    date: string;
    feedback: string;
  };
}

const TableRow: React.FC<TableRowProps> = ({ data }) => {
  return (
    <tr className="hover:bg-neutral-100 transition">
      <TableCell>{data.clientName}</TableCell>
      <TableCell><StarRating maxStars={5} initialRating={data.stars} onChange={() => {}} /></TableCell>
      <TableCell>{data.serviceCenter}</TableCell>
      <TableCell>{data.date}</TableCell>
      <TableCell>{data.feedback}</TableCell>
      <TableCell className="text-center">
        <Eye className="text-neutral-500 cursor-pointer" size={18} />
      </TableCell>
    </tr>
  );
};

export default TableRow;