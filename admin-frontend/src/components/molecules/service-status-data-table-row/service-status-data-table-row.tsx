import TableCheckbox from "@/components/atoms/tick-box/tick-box";

type Props = {
  checked: boolean;
  onToggle: () => void;
  service: string;
  serviceCenter: string;
};

export const ServiceStatusDataTableRow = ({ checked, onToggle, service, serviceCenter }: Props) => (
  <tr className="bg-blue-50 text-neutral-600 font-regular text-md">
    <td className="py-2 px-4 w-1/2 h-12">
      <TableCheckbox checked={checked} onChange={onToggle} />
    </td>
    <td className="py-2 px-4 w-1/4 h-12">{service}</td>
    <td className="py-2 px-4 w-1/4 h-12">{serviceCenter}</td>
  </tr>
);