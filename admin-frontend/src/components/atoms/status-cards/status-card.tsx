import { Users, Package, LineChart, TrendingUp } from "lucide-react";
import "@/styles/fonts.css";

interface StatusCardProps {
  title: string;
  value: number;
  icon: "customers" | "vehicles" | "serviceCenters" | "availableCenters";
  trend?: number; // Optional trend percentage
  isLoading?: boolean;
}

const iconConfig = {
  customers: { 
    icon: Users, 
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600", 
    lightBg: "bg-indigo-50",
    shadowColor: "shadow-indigo-500/20",
    cardBg: "bg-gradient-to-br from-indigo-50/30 to-blue-50/20"
  },
  vehicles: { 
    icon: Package, 
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600", 
    lightBg: "bg-indigo-50",
    shadowColor: "shadow-indigo-500/20",
    cardBg: "bg-gradient-to-br from-indigo-50/30 to-blue-50/20"
  },
  serviceCenters: { 
    icon: LineChart, 
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600", 
    lightBg: "bg-indigo-50",
    shadowColor: "shadow-indigo-500/20",
    cardBg: "bg-gradient-to-br from-indigo-50/30 to-blue-50/20"
  },
  availableCenters: { 
    icon: LineChart, 
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600", 
    lightBg: "bg-indigo-50",
    shadowColor: "shadow-indigo-500/20",
    cardBg: "bg-gradient-to-br from-indigo-50/30 to-blue-50/20"
  },
};

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  isLoading = false 
}) => {
  const config = iconConfig[icon];
  const IconComponent = config.icon;

  return (
    <div className={`
      relative p-6 ${config.cardBg} backdrop-blur-sm rounded-2xl border border-white/50 
      shadow-lg ${config.shadowColor} 
      transition-all duration-300 ease-in-out
      w-[280px] h-[160px] group overflow-hidden
      before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none
    `}>
      {/* Enhanced 3D background layers */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${config.lightBg} rounded-full transform translate-x-16 -translate-y-16 opacity-40`}></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/60 rounded-full transform -translate-x-10 translate-y-10 opacity-50"></div>
      
      {/* 3D depth shadow */}
      <div className={`absolute inset-0 rounded-2xl ${config.cardBg} transform translate-x-1 translate-y-1 opacity-30 -z-10`}></div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-start justify-between h-full">
        <div className="flex flex-col justify-between h-full flex-1">
          {/* Title */}
          <div>
            <p className="text-gray-700 text-sm font-semibold mb-1 drop-shadow-sm">
              {title}
            </p>
            
            {/* Value with loading state */}
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-gray-800 drop-shadow-md">
                {value.toLocaleString()}
              </h2>
            )}
          </div>

          {/* Trend indicator */}
          {trend !== undefined && !isLoading && (
            <div className="flex items-center gap-1 mt-3">
              <div className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium shadow-md
                ${trend >= 0 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
                }
              `}>
                <TrendingUp 
                  size={12} 
                  className={`${trend >= 0 ? 'rotate-0' : 'rotate-180'}`} 
                />
                <span>{Math.abs(trend)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-1 drop-shadow-sm">vs last month</span>
            </div>
          )}
        </div>

        {/* Icon container with enhanced 3D effects */}
        <div className="relative">
          <div className={`
            w-14 h-14 ${config.bgColor} rounded-xl flex items-center justify-center
            transition-all duration-300
            border-2 border-white/20
            ${icon === 'availableCenters' ? '' : 'shadow-lg'}
          `}>
            <IconComponent className={`w-7 h-7 text-white ${icon === 'availableCenters' ? '' : 'drop-shadow-md'}`} />
            

            
          </div>

          
          

          {/* Floating background shape with 3D effect */}
          <div className={`
            absolute -top-1 -right-1 w-16 h-16 ${config.lightBg} rounded-xl 
            opacity-30 -z-10 shadow-inner
          `}></div>
        </div>
      </div>

      {/* Enhanced border glow with 3D effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent"></div>
      
      {/* Top highlight for 3D effect */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};

export default StatusCard;
