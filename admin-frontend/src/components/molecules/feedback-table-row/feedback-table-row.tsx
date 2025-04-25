import React from "react";
import TableCell from "@/components/atoms/table-cell//table-cell";
import { Eye } from "lucide-react";
import StarRating from "@/components/atoms/star-rating/star-rating";

interface TableRowProps {
  data: {
    profileSrc: string;
    profileAlt: string;
    clientId: string;
    clientName: string;
    stars: number;
    serviceCenter: string;
    date: string;
    feedback: string;
  };
  onViewClick: (data: TableRowProps["data"]) => void;
}

const TableRow: React.FC<TableRowProps> = ({ data, onViewClick  }) => {
  return (
    <tr className="hover:bg-neutral-100 transition">
      <TableCell>{data.clientName}</TableCell>
      <TableCell>
        <StarRating maxStars={5} initialRating={data.stars} onChange={() => {}} />
      </TableCell>
      <TableCell>{data.serviceCenter}</TableCell>
      <TableCell>{data.date}</TableCell>
      <TableCell>{data.feedback.length > 30 ? data.feedback.slice(0, 30) + "..." : data.feedback}</TableCell>
      <TableCell className="text-center">
        <Eye
          className="text-neutral-500 cursor-pointer hover:text-neutral-700 transition"
          size={18}
          onClick={() => onViewClick(data)} // Pass clicked data
        />
      </TableCell>
    </tr>
  );
};

export default TableRow;