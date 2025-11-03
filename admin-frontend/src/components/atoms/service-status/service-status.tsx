import { Lock } from "lucide-react";

interface ServiceStatusProps {
  date: string;
  status: "Locked" | "Open";
  submittedHours: string;
  startTime: string;
  endTime: string;
}

const ServiceStatus: React.FC<ServiceStatusProps> = ({
  date,
  status,
  submittedHours,
  startTime,
  endTime,
}) => {
  return (
    <div className="p-4 bg-neutral-100 shadow-md rounded-lg w-full max-w-md">
      <div className="flex justify-between text-neutral-500 text-sm font-semibold mb-2">
        <span>{date}</span>
        <span className="text-neutral-600 font-bold">{status}</span>
        <span>
          Submitted: <span className="font-bold">{submittedHours}</span>
        </span>
      </div>
      <div className="flex justify-between items-center p-3 bg-neutral-100 rounded-md">
        <span className="text-neutral-500">{startTime}</span>
        <span className="text-neutral-300">-------------</span>
        <span className="text-neutral-500">{endTime}</span>
        <Lock className="w-4 h-4 text-neutral-400" />
      </div>
    </div>
  );
};

export default ServiceStatus;
