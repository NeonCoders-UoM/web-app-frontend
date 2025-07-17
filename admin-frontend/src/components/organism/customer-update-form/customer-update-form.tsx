"use client";

import type React from "react";
import { useState } from "react";
import InputField from "@/components/atoms/input-fields/input-fields";
// import UploadPhoto from "@/components/atoms/upload-photo/upload-photo";
import Button from "@/components/atoms/button/button";
import colors from "@/styles/colors";

interface CustomerUpdateFormProps {
  onSubmit?: (data: {
    customerName: string;
    email: string;
    nicNumber: string;
    telephoneNumber: string;
    address: string;
    photo: File | null;
  }) => void;
  initialData?: {
    customerName: string;
    email: string;
    nicNumber: string;
    telephoneNumber: string;
    address: string;
    photo: File | null;
  };
}

export default function CustomerUpdateForm({
  onSubmit,
  initialData,
}: CustomerUpdateFormProps) {
  // Split the customer name into first and last name for display
  const splitName = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

  const { firstName: initialFirstName, lastName: initialLastName } = splitName(
    initialData?.customerName || ""
  );

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: initialData?.email || "",
    nicNumber: initialData?.nicNumber || "",
    telephoneNumber: initialData?.telephoneNumber || "",
    address: initialData?.address || "",
  });

  // const [photo, setPhoto] = useState<File | null>(initialData?.photo || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePhotoChange = (file: File | null) => {
  //   setPhoto(file);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerName = `${formData.firstName} ${formData.lastName}`.trim();
    if (onSubmit) {
      onSubmit({
        customerName,
        email: formData.email,
        nicNumber: formData.nicNumber,
        telephoneNumber: formData.telephoneNumber,
        address: formData.address,
        photo: null,
      });
    } else {
      console.log("Form submitted:", {
        customerName,
        email: formData.email,
        nicNumber: formData.nicNumber,
        telephoneNumber: formData.telephoneNumber,
        address: formData.address,
        photo: null,
      });
    }
  };

  return (
    <div
      style={{
        width: "1077px",
        height: "432px",
        display: "flex",
        gap: "16px",
        fontFamily: "var(--font-family-text)",
      }}
    >
      {/* <div
        style={{
          width: "320px",
          height: "370px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="text-center">
          <h3
            style={{
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-medium)",
              color: colors.neutral[600],
              marginBottom: "20px",
            }}
          >
            Upload a Photo
          </h3>

          <div className="flex justify-center">
            <UploadPhoto onChange={handlePhotoChange} />
          </div>
        </div>

        <p
          style={{
            color: "#cc0000",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            marginTop: "10px",
          }}
        >
          Not Required
        </p>
      </div> */}

      <div
        style={{
          width: "720px",
          height: "370px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                First Name
              </label>
              <InputField
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Last Name
              </label>
              <InputField
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Email
              </label>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="nicNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                NIC Number
              </label>
              <InputField
                id="nicNumber"
                name="nicNumber"
                placeholder="NIC Number"
                value={formData.nicNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="telephoneNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Telephone Number
              </label>
              <InputField
                id="telephoneNumber"
                name="telephoneNumber"
                placeholder="Telephone Number"
                value={formData.telephoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label
                htmlFor="address"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Address
              </label>
              <InputField
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" variant="primary" size="medium">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
