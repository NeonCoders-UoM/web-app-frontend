import ToggleButton from "@/components/atoms/toggle-button/toggle-button";
import { DeleteButton } from "@/components/atoms/delete-icon/delete-icon";

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export const TableRow = ({ label, checked, onToggle, onDelete }: Props) => (
  <tr className="bg-blue-50">
    <td className="py-2 px-4">{label}</td>
    <td className="py-2 px-4 text-center flex items-center justify-end gap-12">
      <ToggleButton checked={checked} onChange={onToggle} />
      <DeleteButton onClick={onDelete} />
    </td>
  </tr>
);