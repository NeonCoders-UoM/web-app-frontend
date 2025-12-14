"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchServiceCenterById } from "@/utils/api";
import { ServiceCenter } from "@/types";
import axiosInstance from "@/utils/axios";
import { deleteAllAuthCookies } from "@/utils/cookies";

const roleMap: { [key: string]: number } = {
  Cashier: 4,
  "Data Operator": 5,
};

const AddServiceCenterUser = () => {
  const params = useParams();
  const router = useRouter();
  const serviceCenterId = params.id as string;

  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userRole: "Cashier",
  });

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userStationId = localStorage.getItem("station_id");

    if (userRole !== "ServiceCenterAdmin") {
      router.push(`/service-center-dashboard/${serviceCenterId}`);
      return;
    }

    if (userStationId && userStationId !== serviceCenterId) {
      router.push(`/service-center-dashboard/${userStationId}`);
      return;
    }

    fetchServiceCenter();
  }, [serviceCenterId]);

  const fetchServiceCenter = async () => {
    try {
      const data = await fetchServiceCenterById(serviceCenterId);
      setServiceCenter(data);
    } catch (error) {
      console.error("Error fetching service center:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) {
      alert("Please enter first name");
      return;
    }
    if (!formData.lastName.trim()) {
      alert("Please enter last name");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    const userRoleId = roleMap[formData.userRole];

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/Admin/user-register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userRoleId,
        Station_id: serviceCenterId,
      });

      alert("User created successfully!");
      router.push(`/service-center-dashboard/${serviceCenterId}/users`);
    } catch (error: any) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data || "Failed to create user. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/users`)}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Users</span>
        </button>
        
        <div className="absolute left-[800px] transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Add New User</h1>
          <p className="text-gray-600 text-center">
            {serviceCenter?.serviceCenterName || "Service Center"}
          </p>
        </div>

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

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            
            <div>
              <h2 className="text-xl font-bold text-blue-600">User Information</h2>
              <p className="text-sm text-gray-500">Fill in the details below to create a new staff member</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name 
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name 
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter last name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address 
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="user@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password 
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Minimum 8 characters"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* User Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Role 
              </label>
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="Cashier">Cashier</option>
                <option value="Data Operator">Data Operator</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the role for this user within your service center
              </p>
            </div>

            {/* Service Center Info */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Service Center Assignment</p>
              <p className="text-sm text-blue-700">
                This user will be assigned to: <span className="font-semibold">{serviceCenter?.serviceCenterName || serviceCenterId}</span>
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/users`)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceCenterUser;
