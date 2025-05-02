"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/styles/fonts.css";
import UserProfileCard from "@/components/molecules/user-card/user-card";

interface VehicleRegistrationFormProps {
  params?: {
    id?: string;
  };
}

export default function VehicleRegistrationForm({
  params,
}: VehicleRegistrationFormProps) {
  const router = useRouter();
  const vehicleId = params?.id;
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    serviceCenterName: "",
    email: "",
    address: "",
    telephoneNumber: "",
    ownersName: "",
    serviceHours: "",
    registrationNumber: "",
    vatNumber: "",
    selectedBrand: "",
    selectedModel: "",
    selectedFuelType: "",
    availableServices: [],
  });

  // Simulated photo data
  const [photo, setPhoto] = useState(null);
  const [registrationCopy, setRegistrationCopy] = useState(null);

  useEffect(() => {
    // Simulated data fetch
    if (vehicleId) {
      // Mock data for demonstration
      const mockData = {
        serviceCenterName: "Auto Service Plus",
        email: "info@autoserviceplus.com",
        address: "123 Service Road",
        telephoneNumber: "123-456-7890",
        ownersName: "John Doe",
        serviceHours: "9:00 AM - 5:00 PM",
        registrationNumber: "REG123456",
        vatNumber: "VAT789012",
        selectedBrand: "",
        selectedModel: "",
        selectedFuelType: "",
        availableServices: ["Oil Change", "Tire Rotation", "Brake Service"],
      };

      setFormData(mockData);
    }
    setLoading(false);
  }, [vehicleId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoUpload = (e) => {
    // Handle photo upload
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleRegistrationCopyUpload = (e) => {
    // Handle registration copy upload
    if (e.target.files && e.target.files[0]) {
      setRegistrationCopy(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("Photo:", photo);
    console.log("Registration Copy:", registrationCopy);

    // Save changes logic would go here
    alert("Changes saved successfully!");
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end items-center mb-10 p-6 bg-white shadow-md rounded-lg">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="super-admin"
          onLogout={() => console.log("Logout clicked")}
          onProfileClick={() => console.log("Profile clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
        />
      </div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Vehicle Registration
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Photo Upload Section */}
        <div className="flex-1 border border-gray-200 rounded-lg p-8 bg-white shadow-md">
          <div className="mb-8">
            <p className="text-center mb-4 text-lg font-medium text-gray-700">
              Update the Photo
            </p>
            <div className="flex justify-center">
              <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                <Image
                  src="/placeholder-image.svg"
                  alt="Upload Photo"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-sm text-center text-gray-500 mt-4">
              Allowed JPEG, PNG, JPG formats, up to 5MB
            </p>
          </div>

          <div className="mt-12">
            <p className="text-center mb-4 text-lg font-medium text-gray-700">
              Update Service Registration Copy
            </p>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>
            <p className="text-sm text-center text-gray-500 mt-4">
              Choose a file or drag & drop it here
              <br />
              JPEG, PNG, PDF, and SVG formats, up to 25MB
            </p>
            <div className="flex justify-center mt-6">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="px-6 py-3 border border-gray-300 rounded-md text-sm bg-gray-100 hover:bg-gray-200">
                  Browse File
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleRegistrationCopyUpload}
                  accept=".jpeg,.jpg,.png,.pdf,.svg"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="flex-2 border border-gray-200 rounded-lg p-8 bg-white shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Center Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Service Center Name
                </label>
                <input
                  type="text"
                  name="serviceCenterName"
                  value={formData.serviceCenterName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Service Center Name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Email"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Address"
                />
              </div>

              {/* Telephone Number */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  name="telephoneNumber"
                  value={formData.telephoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Telephone Number"
                />
              </div>

              {/* Owner's Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Owner&apos;s Name
                </label>
                <input
                  type="text"
                  name="ownersName"
                  value={formData.ownersName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Owner's Name"
                />
              </div>

              {/* Available Services */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Choose Available Services
                </label>
                <div className="relative">
                  <select
                    name="availableServices"
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose Available Services
                    </option>
                    <option value="oil_change">Oil Change</option>
                    <option value="tire_rotation">Tire Rotation</option>
                    <option value="brake_service">Brake Service</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Service Hours */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Service Hours
                </label>
                <input
                  type="text"
                  name="serviceHours"
                  value={formData.serviceHours}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Service Hours"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Registration Number"
                />
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
