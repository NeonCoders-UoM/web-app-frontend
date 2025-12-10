"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { Loader2, Building2 } from "lucide-react";
import MapPicker from "@/components/organism/map-picker/mappicker";
import {
  CreateServiceCenterWithServicesDTO,
  ServiceCenterServiceSelection,
  Package,
  SystemService,
} from "@/types";
import { fetchPackages, fetchSystemServices } from "@/utils/api";

const libraries: Libraries = ["places"];

interface EnhancedServiceCenterFormProps {
  initialData?: CreateServiceCenterWithServicesDTO;
  onSubmit: (data: CreateServiceCenterWithServicesDTO) => void;
}

export default function EnhancedServiceCenterForm({
  initialData,
  onSubmit,
}: EnhancedServiceCenterFormProps) {
  const router = useRouter();
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    defaultDailyAppointmentLimit: initialData?.defaultDailyAppointmentLimit || 20,
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
            systemBasePrice: service.basePrice || 0,
            customPrice: service.basePrice || 0,
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

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;
      
      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address || "",
        lat,
        lng,
      }));
      
      setErrors((prev) => ({ ...prev, address: undefined, lat: undefined, lng: undefined }));
    }
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
          ? { ...service, customPrice: price }
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
        (service) => service.customPrice <= 0
      );
      if (invalidServices.length > 0) {
        newErrors.services =
          "All selected services must have a valid custom price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-blue-600">Basic Information</h2>
              <p className="text-sm text-gray-500">Enter the service center's basic details</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { id: "station_name", label: "Service Center Name", type: "text" },
              { id: "ownerName", label: "Owner Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "telephone", label: "Telephone", type: "text" },
              { id: "vatNumber", label: "VAT Number", type: "text" },
              { id: "registerationNumber", label: "Registration Number", type: "text" },
              { id: "defaultDailyAppointmentLimit", label: "Daily Appointment Limit", type: "number" },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
                  {label} 
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={
                    formData[id as keyof CreateServiceCenterWithServicesDTO] as string
                  }
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {errors[id as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[id as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
            
            {/* Address field with Google Maps Autocomplete */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Address 
              </label>
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter address or search location"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </StandaloneSearchBox>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
          
          {/* MapPicker for Location Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Select Location on Map 
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <MapPicker
                selectedLocation={{ lat: formData.lat, lng: formData.lng }}
                onLocationSelect={(location) => {
                  console.log("Location selected:", location);
                  setFormData((prev) => {
                    const newState = {
                      ...prev,
                      lat: location.lat,
                      lng: location.lng,
                    };
                    console.log("Updated formData:", newState);
                    return newState;
                  });
                }}
              />
            </div>
            {(errors.lat || errors.lng) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lat || errors.lng}
              </p>
            )}
            {/* Display selected coordinates */}
            {formData.lat !== 0 || formData.lng !== 0 ? (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </p>
            ) : null}
          </div>
        </div>

        {/* Package Selection */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-blue-600">Package Selection</h2>
              <p className="text-sm text-gray-500">Choose a loyalty package for this service center</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="packageId" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Package 
            </label>
            <select
              id="packageId"
              name="packageId"
              value={formData.packageId}
              onChange={handlePackageChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value={0}>Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.packageId} value={pkg.packageId}>
                  {pkg.packageName} - {pkg.percentage}% Loyalty
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the loyalty package that best fits this service center
            </p>
            {errors.packageId && (
              <p className="text-red-500 text-sm mt-1">{errors.packageId}</p>
            )}
          </div>
        </div>

        {/* Services Selection */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-blue-600">Services & Pricing</h2>
              <p className="text-sm text-gray-500">Select services and set custom pricing if needed</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Services 
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {formData.services.map((service) => (
                  <div
                    key={service.serviceId}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
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
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`service-${service.serviceId}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer block"
                        >
                          {service.serviceName}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Base Price: ${service.systemBasePrice.toFixed(2)}
                        </p>
                        {service.isSelected && (
                          <div className="mt-3">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Custom Price (optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Enter custom price"
                              value={service.customPrice}
                              onChange={(e) =>
                                updateServicePrice(
                                  service.serviceId,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Leave at base price or set a custom price
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Services Summary */}
            {formData.services.filter((s) => s.isSelected).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Selected Services Summary
                </h3>
                <p className="text-xs text-blue-700 mb-3">
                  {formData.services.filter((s) => s.isSelected).length} service(s) selected
                </p>
                <div className="space-y-2">
                  {formData.services
                    .filter((s) => s.isSelected)
                    .map((service) => (
                      <div
                        key={service.serviceId}
                        className="flex items-center justify-between py-2 border-b border-blue-100 last:border-0"
                      >
                        <span className="text-sm font-medium text-blue-900">
                          {service.serviceName}
                        </span>
                        <span className="text-sm font-semibold text-blue-700">
                          ${service.customPrice > 0 ? service.customPrice.toFixed(2) : service.systemBasePrice.toFixed(2)}
                        </span>
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5" />
                Create Service Center
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}