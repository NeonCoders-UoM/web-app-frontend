import InputField from "@/components/atoms/input-fields/input-fields";
import { DeleteButton } from "@/components/atoms/delete-icon/delete-icon";

type Props = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  onDelete: () => void;
};

export const TableRow = ({ label, value, onChange, onDelete }: Props) => (
  <tr className="bg-blue-50">
    <td className="py-2 px-4">{label}</td>
    <td className="py-2 px-4 text-center flex items-center justify-end gap-12"> 
      <div className="transform scale-75">
        <InputField
          value={value.toString()}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              onChange(num);
            } else {
              onChange(0); // or handle invalid number differently
            }
          }}
          placeholder="Enter quantity"
          type="number"
        />
      </div>
      <DeleteButton onClick={onDelete} />
    </td>
  </tr>
);