import ToggleButton from "@/components/atoms/toggle-button/toggle-button";
import { DeleteButton } from "@/components/atoms/delete-icon/delete-icon";

type Props = {
  label: string;
  checked: boolean;
  price?: number;
  category?: string;
  description?: string;
  onToggle: () => void;
  onDelete: () => void;
};

export const TableRow = ({
  label,
  checked,
  price,
  category,
  description,
  onToggle,
  onDelete,
}: Props) => (
  <tr className="bg-blue-50">
    <td className="py-2 px-4">
      <div>
        <div className="font-medium text-neutral-900">{label}</div>
        {description && (
          <div className="text-xs text-neutral-500 mt-1">{description}</div>
        )}
      </div>
    </td>
    <td className="py-2 px-4 text-sm text-neutral-600">
      {category || "General"}
    </td>
    <td className="py-2 px-4 text-sm font-medium text-neutral-900">
      {price ? `${price} LKR` : "N/A"}
    </td>
    <td className="py-2 px-4 text-center">
      <span
        className={`px-2 py-1 rounded text-xs ${
          checked ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {checked ? "Available" : "Not Available"}
      </span>
    </td>
    <td className="py-2 px-4 text-center flex items-center justify-end gap-4">
      <ToggleButton checked={checked} onChange={onToggle} />
      <DeleteButton onClick={onDelete} />
    </td>
  </tr>
);
