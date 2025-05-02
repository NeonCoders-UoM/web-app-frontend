import { Users, Package, LineChart } from "lucide-react";
import "@/styles/fonts.css";
interface StatusCardProps {
  title: string;
  value: number;
  icon: "customers" | "vehicles" | "serviceCenters";
}

const icons = {
  customers: <Users className="w-[60px] h-[60px] p-[16px] bg-purple-100 rounded-2xl text-purple-600" />,
  vehicles: <Package className="w-[60px] h-[60px] p-[16px] bg-yellow-100 rounded-2xl text-yellow-600" />,
  serviceCenters: <LineChart className="w-[60px] h-[60px] p-[16px] bg-green-100 rounded-2xl text-green-600" />,
};

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-[16px] bg-white shadow-md rounded-[14px] w-[262px] h-[161px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500 text-md font-semibold">{title}</p>
          <h2 className="text-xl font-semibold pt-[18px]">{value.toLocaleString()}</h2>
        </div>
        {icons[icon]}
      </div>
    </div>
  );
};

export default StatusCard;
