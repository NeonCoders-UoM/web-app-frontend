import { Users, Package, LineChart } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number;
  icon: "customers" | "vehicles" | "serviceCenters";
}

const icons = {
  customers: <Users className="w-10 h-10 p-2 bg-purple-100 rounded-full text-purple-600" />,
  vehicles: <Package className="w-10 h-10 p-2 bg-yellow-100 rounded-full text-yellow-600" />,
  serviceCenters: <LineChart className="w-10 h-10 p-2 bg-green-100 rounded-full text-green-600" />,
};

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 bg-neutral-100 shadow-md rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500 text-lg">{title}</p>
          <h2 className="text-3xl font-semibold">{value.toLocaleString()}</h2>
        </div>
        {icons[icon]}
      </div>
    </div>
  );
};

export default StatusCard;
