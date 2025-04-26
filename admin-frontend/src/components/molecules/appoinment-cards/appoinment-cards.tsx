import Button from "@/components/atoms/button/button";
import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface AppointmentProps {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services: string[];
}

const AppointmentCard: React.FC<AppointmentProps> = ({
  appointmentId,
  owner,
  licensePlate,
  date,
  vehicle,
  services,
}) => {
  return (
    <div className="bg-neutral-100 p-6 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary[200] }}>
        Appointment Details
      </h2>
      <div className="grid grid-cols-2 gap-2 text-neutral-400 text-sm">
        <div>
          <span className="font-semibold">Appointment ID:</span>
          <p className="text-neutral-600">{appointmentId}</p>
        </div>
        <div>
          <span className="font-semibold">Owner:</span>
          <p className="text-neutral-600">{owner}</p>
        </div>
        <div>
          <span className="font-semibold">License Plate Number:</span>
          <p className="text-neutral-600">{licensePlate}</p>
        </div>
        <div>
          <span className="font-semibold">Date:</span>
          <p className="text-neutral-600">{date}</p>
        </div>
        <div className="col-span-2">
          <span className="font-semibold">Vehicle:</span>
          <p className="text-neutral-600">{vehicle}</p>
        </div>
        <div className="col-span-2">
          <span className="font-semibold">Services:</span>
          <ul className="list-inside mt-1 text-neutral-600">
            {services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="success" icon="check">
          Accept
        </Button>
        <Button variant="danger" icon="close">
          Reject
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;