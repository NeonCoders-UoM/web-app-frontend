import colors from "@/styles/colors";
import "@/styles/fonts.css";

type ServiceWithPrice = { name: string; price: number };
interface AppointmentProps {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services?: string[];
  servicesWithPrices?: ServiceWithPrice[];
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
  servicesWithPrices,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-white p-[86px] rounded-[20px] shadow-md w-[600px] h-[500px]">
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
          {servicesWithPrices && servicesWithPrices.length > 0 ? (
            <table className="w-full mt-1 text-neutral-600">
              <thead>
                <tr>
                  <th className="text-left">Service</th>
                  <th className="text-left">Price (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {servicesWithPrices.map((svc, idx) => (
                  <tr key={idx}>
                    <td>{svc.name}</td>
                    <td>{svc.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ul className="list-inside mt-1 text-neutral-600">
              {services && services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Removed Accept and Reject buttons as requested */}
    </div>
  );
};

export default AppointmentCard;