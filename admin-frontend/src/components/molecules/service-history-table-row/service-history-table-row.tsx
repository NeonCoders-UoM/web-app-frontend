import React from "react";
import TableCell from "@/components/atoms/table-cell/table-cell";
import StatusBadge from "@/components/atoms/order-image/order-image";
import OrderImage from "@/components/atoms/order-status/order-status";

type Order = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  type: string;
  date: string;
  serviceCenter: string;
  status: "Completed" | "Pending" | "Cancelled";
  image: string;
};

type OrderRowProps = {
  order: Order;
};

const OrderRow: React.FC<OrderRowProps> = ({ order }) => (
  <tr className="bg-white">
    <TableCell>
      <div className="text-sm text-gray-500 mb-1">Order ID #{order.id}</div>
      <div className="flex items-center gap-3">
        <OrderImage src={order.image} alt={order.title} />
        <div>
          <div className="font-medium">{order.title}</div>
          <div className="text-sm">
            Rs {order.price}
            {order.originalPrice && (
              <span className="ml-1 line-through text-gray-400">
                Rs {order.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </TableCell>

    <TableCell>{order.type}</TableCell>
    <TableCell>{order.date}</TableCell>
    <TableCell>{order.serviceCenter}</TableCell>
    <TableCell>
      <StatusBadge status={order.status} />
    </TableCell>
    <TableCell className="w-12">&nbsp;</TableCell>
  </tr>
);

export default OrderRow;
