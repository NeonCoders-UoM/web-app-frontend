import Image from "next/image"
import "@/styles/fonts.css"

type AppointmentCardProps = {
  appointmentNo: string
  date: string
  serviceCenter: string
  serviceType: string[]
  additionalNotes: string
  fee: string
};

type LabelTextProps = {
  children: React.ReactNode
};

const LabelText = ({ children }: LabelTextProps) => (
  <span className="text-sm text-gray-600">{children}</span>
);

type ValueTextProps = {
  children: React.ReactNode
  bold?: boolean
};

const ValueText = ({ children, bold = false }: ValueTextProps) => (
  <span
    className={`text-sm whitespace-pre-line ${
      bold ? "font-semibold text-black" : "text-gray-800"
    }`}
  >
    {children}
  </span>
);

type InfoRowProps = {
  label: string
  value: string
  bold?: boolean
};

const InfoRow = ({ label, value, bold = false }: InfoRowProps) => (
  <div className="flex flex-col mb-3">
    <LabelText>{label}</LabelText>
    <ValueText bold={bold}>{value}</ValueText>
  </div>
);

export const AppointmentCard = ({
  appointmentNo,
  date,
  serviceCenter,
  serviceType,
  additionalNotes,
  fee,
}: AppointmentCardProps) => {
  return (
    <div className="w-[500px] h-[500px] bg-neutral-100 rounded-xl shadow p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Appointment No:{" "}
          <span className="font-bold text-black">{appointmentNo}</span>
        </p>
      </div>

      <div className="flex justify-start mb-6">
        <Image
          src="/images/appointment.jpg"
          alt="Appointment Image"
          width={120}
          height={120}
          className="rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoRow label="Date:" value={date} bold />
        <InfoRow label="Service Center:" value={serviceCenter} bold />
        <InfoRow
          label="Service Type:"
          value={serviceType.length > 0 ? serviceType.join("\n") : "-"}
          bold
        />
        <InfoRow
          label="Additional Notes:"
          value={additionalNotes || "-"}
        />
        <InfoRow label="Booking Fee:" value={`Rs. ${fee}`} bold />
      </div>
    </div>
  )
}