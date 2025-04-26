import Image from "next/image";
import "@/styles/fonts.css"

type Props = {
  name: string;
  address: string;
  owner: string;
  vat: string;
  email: string;
  phone: string;
  registration: string;
  hours: string;
};

export const ServiceCenterDetailsCard = ({
  name,
  address,
  owner,
  vat,
  email,
  phone,
  registration,
  hours,
}: Props) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 w-1/2 h-96">
      {/* Left Side */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">Service Center Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <div>
            <p className="font-medium">Service Center Name :</p>
            <p>{name}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{email}</p>
          </div>

          <div>
            <p className="font-medium">Service Center Address :</p>
            <p>{address}</p>
          </div>
          <div>
            <p className="font-medium">Telephone Number</p>
            <p>{phone}</p>
          </div>

          <div>
            <p className="font-medium">Owner’s Name</p>
            <p>{owner}</p>
          </div>
          <div>
            <p className="font-medium">Registration Number</p>
            <p>{registration}</p>
          </div>

          <div>
            <p className="font-medium">VAT Number</p>
            <p>{vat}</p>
          </div>
          <div>
            <p className="font-medium">Service Hours</p>
            <p>{hours}</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-52 h-40 relative">
        <Image 
          src="/images/vehicle.jpg" 
          alt="Service Center" 
          fill className="object-contain" 
        />
      </div>
    </div>
  );
};
