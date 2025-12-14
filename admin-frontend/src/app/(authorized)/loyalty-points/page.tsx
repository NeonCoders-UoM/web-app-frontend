"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import InputField from "@/components/atoms/input-fields/input-fields";
import { deleteAllAuthCookies } from "@/utils/cookies";
import Button from "@/components/atoms/button/button";
import { Table } from "@/components/organism/loyalty-poinys-table/loyalty-points-table";
import colors from "@/styles/colors";

type Service = {
  label: string;
  value: number;
};

export default function AddServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    { label: "Tire Rotation", value: 2 },
    { label: "Engine Check", value: 2 },
    { label: "Oil Filter Change", value: 2 },
    { label: "Wheel Alignment", value: 2 },
    { label: "Suspension Upgrades", value: 2 },
  ]);
  const [newService, setNewService] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService && newValue) {
      const newServiceObj = { label: newService.toUpperCase(), value: parseInt(newValue) };
      setServices((prevServices) => [...prevServices, newServiceObj]);
      setNewService("");
      setNewValue("");
    }
  };

  return (
    <div className="p-[58px] min-h-screen bg-white">
      {/* Header with User Profile */}
      <div className="flex justify-end mb-[56px]">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            deleteAllAuthCookies();
            router.push("/login");
          }}
        />
      </div>

      <div className="pr-[34px]">
        {/* Page Title */}
        <h1 className="text-xl font-semibold mb-[20px]" style={{ color: colors.neutral[600] }}>
          Add Services
        </h1>

        {/* Add Service Form */}
        <div
          className="mb-[40px] rounded-[20px] w-[1044px] h-[176px] p-[48px]"
          style={{ backgroundColor: "rgba(72, 128, 255, 0.2)" }}
        >
          <form onSubmit={handleAddService} className="flex items-end">
            <div className="pr-[12px] w-[360px] h-[52px]">
              <label
                className="block mb-[8px] text-sm font-medium"
                style={{ color: colors.neutral[500] }}
              >
                Service
              </label>
              <InputField
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
            <div className="pr-[20px] w-[156px] h-[52px]">
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.neutral[500] }}
              >
                Value
              </label>
              <InputField
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
              />
            </div>
            <div className="w-[122px] h-[48px] pt-8">
              <Button type="submit" variant="primary" size="medium">
                Add
              </Button>
            </div>
          </form>
        </div>

        {/* Services Table */}
        <div className="mb-[24px]">
          <Table data={services} updateData={setServices} />
        </div>

        {/* Save Changes Button */}
        <div>
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={() => console.log("Changes saved", services)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}