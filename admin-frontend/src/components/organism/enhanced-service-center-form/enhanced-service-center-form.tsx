"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import MapPicker from "@/components/organism/map-picker/mappicker";
import colors from "@/styles/colors";
import {
  CreateServiceCenterWithServicesDTO,
  ServiceCenterServiceSelection,
  Package,
  SystemService,
} from "@/types";
import { fetchPackages, fetchSystemServices } from "@/utils/api";

interface EnhancedServiceCenterFormProps {
  initialData?: CreateServiceCenterWithServicesDTO;
  onSubmit: (data: CreateServiceCenterWithServicesDTO) => void;
}

export default function EnhancedServiceCenterForm({
  initialData,
  onSubmit,
}: EnhancedServiceCenterFormProps) {
  const [formData, setFormData] = useState<CreateServiceCenterWithServicesDTO>({
    ownerName: initialData?.ownerName || "",
    vatNumber: initialData?.vatNumber || "",
    registerationNumber: initialData?.registerationNumber || "",
    station_name: initialData?.station_name || "",
    email: initialData?.email || "",
    telephone: initialData?.telephone || "",
    address: initialData?.address || "",
    station_status: initialData?.station_status || "Active",
    packageId: initialData?.packageId || 0,
    services: initialData?.services || [],
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    defaultDailyAppointmentLimit: initialData?.defaultDailyAppointmentLimit || 20, // Default appointment limit
  });

  const [packages, setPackages] = useState<Package[]>([]);
  const [systemServices, setSystemServices] = useState<SystemService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateServiceCenterWithServicesDTO, string>>
  >({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [packagesData, servicesData] = await Promise.all([
          fetchPackages(),
          fetchSystemServices(),
        ]);

        setPackages(packagesData);
        setSystemServices(servicesData);

        const initialServices: ServiceCenterServiceSelection[] =
          servicesData.map((service) => ({
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            basePrice: 0,
            isSelected: false,
          }));

        setFormData((prev) => ({
          ...prev,
          services: initialServices,
        }));
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load packages and services.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const packageId = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      packageId,
    }));
    setErrors((prev) => ({ ...prev, packageId: undefined }));
  };

  const updateServicePrice = (serviceId: number, price: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.serviceId === serviceId
          ? { ...service, basePrice: price }
          : service
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof CreateServiceCenterWithServicesDTO, string>
    > = {};
    const {
      ownerName,
      vatNumber,
      registerationNumber,
      station_name,
      email,
      telephone,
      address,
      packageId,
      services,
      lat,
      lng,
    } = formData;

    if (!ownerName.trim()) newErrors.ownerName = "Owner Name is required";
    if (!vatNumber.trim()) newErrors.vatNumber = "VAT Number is required";
    if (!registerationNumber.trim())
      newErrors.registerationNumber = "Registration Number is required";
    if (!station_name.trim())
      newErrors.station_name = "Station Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!telephone.trim()) newErrors.telephone = "Telephone is required";
    else if (!/^\d{10}$/.test(telephone))
      newErrors.telephone = "Telephone must be 10 digits";
    if (!address.trim()) newErrors.address = "Address is required";
    if (packageId === 0) newErrors.packageId = "Please select a package";
    if (lat === 0 && lng === 0) {
      newErrors.lat = "Please select a location on the map";
    } else {
      if (lat < -90 || lat > 90)
        newErrors.lat = "Latitude must be between -90 and 90";
      if (lng < -180 || lng > 180)
        newErrors.lng = "Longitude must be between -180 and 180";
    }

    const selectedServices = services.filter((service) => service.isSelected);
    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service";
    } else {
      const invalidServices = selectedServices.filter(
        (service) => service.basePrice <= 0
      );
      if (invalidServices.length > 0) {
        newErrors.services =
          "All selected services must have a valid base price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData); // Debug log
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div style={{ width: "800px", padding: "20px" }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { id: "station_name", label: "Service Center Name" },
              { id: "ownerName", label: "Owner Name" },
              { id: "email", label: "Email", type: "email" },
              { id: "telephone", label: "Telephone" },
              { id: "address", label: "Address" },
              { id: "vatNumber", label: "VAT Number" },
              { id: "registerationNumber", label: "Registration Number" },
              { id: "defaultDailyAppointmentLimit", label: "Daily Appointment Limit", type: "number" },
            ].map(({ id, label, type = "text" }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-1"
                  style={{ color: colors.neutral[600] }}
                >
                  {label}
                </label>
                <InputField
                  id={id}
                  name={id}
                  type={type}
                  placeholder={label}
                  value={
                    formData[
                      id as keyof CreateServiceCenterWithServicesDTO
                    ] as string
                  }
                  onChange={handleChange}
                />
                {errors[id as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[id as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* MapPicker for Location Selection */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-neutral-900 mb-2">
              Select Location
            </h3>
            <MapPicker
              onLocationSelect={(location) => {
                console.log("Location selected:", location); // Debug log
                setFormData((prev) => {
                  const newState = {
                    ...prev,
                    lat: location.lat,
                    lng: location.lng,
                  };
                  console.log("Updated formData:", newState); // Debug log
                  return newState;
                });
              }}
            />
            {(errors.lat || errors.lng) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lat || errors.lng}
              </p>
            )}
            {/* Display selected coordinates */}
            {formData.lat !== 0 || formData.lng !== 0 ? (
              <p className="text-sm text-neutral-600 mt-2">
                Selected: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </p>
            ) : null}
          </div>
        </div>

        {/* Package Selection */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Package Selection
          </h2>
          <div>
            <label
              htmlFor="packageId"
              className="block mb-1"
              style={{ color: colors.neutral[600] }}
            >
              Select Package *
            </label>
            <select
              id="packageId"
              name="packageId"
              value={formData.packageId}
              onChange={handlePackageChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.packageId} value={pkg.packageId}>
                  {pkg.packageName} - {pkg.percentage}% Loyalty
                </option>
              ))}
            </select>
            {errors.packageId && (
              <p className="text-red-500 text-sm mt-1">{errors.packageId}</p>
            )}
          </div>
        </div>

        {/* Services Selection */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Services & Pricing
          </h2>
          <div className="space-y-4">
            <div>
              <label
                className="block mb-3"
                style={{ color: colors.neutral[600] }}
              >
                Select Services *
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border border-neutral-200 rounded-lg p-4">
                {formData.services.map((service) => (
                  <div
                    key={service.serviceId}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      id={`service-${service.serviceId}`}
                      checked={service.isSelected}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          services: prev.services.map((s) =>
                            s.serviceId === service.serviceId
                              ? { ...s, isSelected: !s.isSelected }
                              : s
                          ),
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
                    />
                    <label
                      htmlFor={`service-${service.serviceId}`}
                      className="text-sm font-medium text-neutral-900 cursor-pointer flex-1"
                    >
                      {service.serviceName}
                    </label>
                    {service.isSelected && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-neutral-600">
                          Base Price:
                        </label>
                        <InputField
                          type="number"
                          placeholder="0"
                          value={service.basePrice.toString()}
                          onChange={(e) =>
                            updateServicePrice(
                              service.serviceId,
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Services Details */}
            {formData.services.filter((s) => s.isSelected).length > 0 && (
              <div>
                <h3 className="text-md font-medium text-neutral-900 mb-3">
                  Selected Services Details
                </h3>
                <div className="space-y-3">
                  {formData.services
                    .filter((s) => s.isSelected)
                    .map((service) => (
                      <div
                        key={service.serviceId}
                        className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-neutral-900">
                              {service.serviceName}
                            </label>
                            <p className="text-xs text-neutral-500 mt-1">
                              {
                                systemServices.find(
                                  (s) => s.serviceId === service.serviceId
                                )?.description
                              }
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-600">
                              Base Price:
                            </span>
                            <span className="text-sm font-medium text-neutral-900">
                              ${service.basePrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {errors.services && (
              <p className="text-red-500 text-sm mt-1">{errors.services}</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          <Button type="submit" size="medium">
            Create Service Center
          </Button>
        </div>
      </form>
    </div>
  );
}