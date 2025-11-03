import React from "react";

type StatusBadgeProps = {
  status: "Completed" | "Pending" | "Cancelled";
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusMap = {
    Completed: "bg-emerald-100 text-emerald-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-md font-semibold text-xsm ${statusMap[status]}`}
      style={{
        fontFamily: "var(--font-family-text)",
        fontWeight: "var(--font-weight-semibold)",
        fontSize: "var(--font-size-xsm)",
        lineHeight: "var(--line-height-normal)",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;