"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2 } from "lucide-react"
import Dropdown from "@/components/atoms/dropdown/dropdown"
import axiosInstance from "@/utils/axios"
import { fetchServiceCenters } from "@/utils/api"
import { ServiceCenter } from "@/types"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  userRole: string
  stationId?: string
}

interface RegistrationFormProps {
  isEditMode?: boolean
  user?: UserData
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  newPassword: string
  userRole: string
  stationId: string
}

const roleMap: { [key: string]: number } = {
  "Super Admin": 1,
  "Admin": 2,
  "Service Center Admin": 3,
  "Cashier": 4,
  "Data Operator": 5,
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, isEditMode = false }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: isEditMode ? (user?.firstName || "") : "",
    lastName: isEditMode ? (user?.lastName || "") : "",
    email: isEditMode ? (user?.email || "") : "",
    newPassword: "",
    userRole: isEditMode ? (user?.userRole || "") : "",
    stationId: isEditMode ? (user?.stationId || "") : "",
  })
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([])
  const [isLoadingServiceCenters, setIsLoadingServiceCenters] = useState(false)

  // Fetch service centers on component mount
  useEffect(() => {
    const loadServiceCenters = async () => {
      setIsLoadingServiceCenters(true)
      try {
        const centers = await fetchServiceCenters()
        setServiceCenters(centers)
      } catch (error) {
        console.error("Error fetching service centers:", error)
      } finally {
        setIsLoadingServiceCenters(false)
      }
    }
    loadServiceCenters()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, userRole: option, stationId: "" }))
  }

  const handleStationSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, stationId: option }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userRoleId = roleMap[formData.userRole]
    if (!userRoleId) {
      alert("Please select a valid user role.")
      return
    }

    // Check if station ID is required but not provided
    const requiresStationId = ["Service Center Admin", "Cashier", "Data Operator"].includes(formData.userRole)
    if (requiresStationId && !formData.stationId) {
      alert("Please select a service center for this role.")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && user?.id) {
        // ✅ UPDATE user (PUT)
        await axiosInstance.put(`/Admin/${user.id}`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          userRoleId: userRoleId,
          password: formData.newPassword || undefined,
          Station_id: formData.stationId || undefined
        })

        alert("User updated successfully!")
      } else {
        // ✅ CREATE user (POST)
        await axiosInstance.post("/Admin/user-register", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userRoleId,
          password: formData.newPassword,
          Station_id: formData.stationId || undefined
        })

        alert("User created successfully!")
      }

      router.push("/user-managment")
    } catch (error: any) {
      console.error("Error submitting form:", error)
      if (error.response?.data) {
        alert(`Request failed: ${error.response.data}`)
      } else {
        alert("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const userRoleOptions = (() => {
    const currentUserRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    
    // If current user is Admin, exclude Super Admin from options
    if (currentUserRole === 'Admin') {
      return ["Admin", "Service Center Admin", "Cashier", "Data Operator"];
    }
    
    // For Super Admin, show all options
    return ["Super Admin", "Admin", "Service Center Admin", "Cashier", "Data Operator"];
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-blue-600">User Information</h2>
          <p className="text-sm text-gray-500">
            {isEditMode ? "Update user account details" : "Fill in the details below to create a new user"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              disabled={isEditMode}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Password {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isEditMode}
              required={!isEditMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            User Role <span className="text-red-500">*</span>
          </label>
          <Dropdown
            options={userRoleOptions}
            placeholder="Select the User Role"
            onSelect={handleRoleSelect}
            className="w-full"
            selectedOption={formData.userRole}
          />
        </div>

        {["Service Center Admin", "Cashier", "Data Operator"].includes(formData.userRole) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Center <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={serviceCenters.map(center => center.serviceCenterName)}
              placeholder={isLoadingServiceCenters ? "Loading service centers..." : "Select a Service Center"}
              onSelect={(centerName) => {
                const center = serviceCenters.find(c => c.serviceCenterName === centerName)
                handleStationSelect(center?.id || "")
              }}
              className="w-full"
              selectedOption={serviceCenters.find(c => c.id === formData.stationId)?.serviceCenterName || ""}
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the service center this user will be assigned to
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/user-managment")}
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                {isEditMode ? "Save Changes" : "Create User"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm
