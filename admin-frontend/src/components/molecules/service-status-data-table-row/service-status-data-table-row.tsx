import TableCheckbox from "@/components/atoms/tick-box/tick-box";

type Props = {
  checked: boolean;
  onToggle: () => void;
  service: string;
  price?: number;
};

export const ServiceStatusDataTableRow = ({ checked, onToggle, service, price }: Props) => (
  <tr className="bg-blue-50 text-neutral-600 font-regular text-md">
    <td className="py-2 px-4 w-1/3 h-12">{service}</td>
    {price !== undefined && <td className="py-2 px-4 w-1/3 h-12">{price}</td>}
    <td className="py-2 px-4 w-1/3 h-12">
      <TableCheckbox checked={checked} onChange={onToggle} />
    </td>
  </tr>
);