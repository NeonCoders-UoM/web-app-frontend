"use client";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
};

export const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
      aria-label="Delete"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};