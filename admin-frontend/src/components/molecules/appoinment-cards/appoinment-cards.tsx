import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface AppointmentProps {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services: string[];
  onAccept: () => void;
  onReject: () => void;
}

const AppointmentCard: React.FC<AppointmentProps> = ({
  appointmentId,
  owner,
  licensePlate,
  date,
  vehicle,
  services,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-white p-[86px] rounded-[20px] shadow-md w-[715px] h-[638px]">
      <h2 className="text-lg font-semibold mb-[56px]" style={{ color: colors.primary[200] }}>
        Appointment Details
      </h2>
      <div className="grid grid-cols-2 text-neutral-400 text-sm">
        <div>
          <span className="font-semibold mb-[8px]">Appointment ID:</span>
          <p className="text-neutral-600 mb-[22px]">{appointmentId}</p>
        </div>
        <div>
          <span className="font-semibold mb-[8px]">Owner:</span>
          <p className="text-neutral-600 mb-[22px]">{owner}</p>
        </div>
        <div>
          <span className="font-semibold mb-[8px]">License Plate Number:</span>
          <p className="text-neutral-600 mb-[22px]">{licensePlate}</p>
        </div>
        <div>
          <span className="font-semibold mb-[8px]">Date:</span>
          <p className="text-neutral-600 mb-[22px]">{date}</p>
        </div>
        <div className="col-span-2">
          <span className="font-semibold mb-[8px]">Vehicle:</span>
          <p className="text-neutral-600 mb-[22px]">{vehicle}</p>
        </div>
        <div className="col-span-2">
          <span className="font-semibold mb-[8px]">Services:</span>
          <ul className="list-inside mt-1 text-neutral-600">
            {services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-[30px]">
        <button className="w-[123px] h-[40px] px-[16px] rounded-xl text-white text-sm bg-green-500 hover:bg-green-600 active:bg-green-400" onClick={onAccept}>
          Accept
        </button>
        <button className="w-[123px] h-[40px] px-[16px] rounded-xl text-white text-sm bg-red-500 hover:bg-red-600 active:bg-red-400" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;