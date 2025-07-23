"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, User, ShieldCheck, Building2, CreditCard, Database } from "lucide-react"
import ProfilePicture from "@/components/atoms/profile-picture/profile-picture"

// Define the user roles as a type
type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator"

interface UserProfileCardProps {
  pictureSrc?: string
  pictureAlt?: string
  name?: string
  role?: UserRole
  onLogout?: () => void
}

const UserProfileCard = ({
  pictureSrc = "/profile-picture.jpg",
  pictureAlt = "User Profile",
  name = "Moni Roy",
  role = "admin",
  onLogout,
}: UserProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Format role for display
  const formatRole = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "Admin"
      case "super-admin":
        return "Super Admin"
      case "service-center-admin":
        return "Service Center Admin"
      case "cashier":
        return "Cashier"
      case "data-operator":
        return "Data Operator"
      default:
        return role
    }
  }

  // Get role icon based on user role with modern colors
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <User size={16} className="text-blue-600" />
      case "super-admin":
        return <ShieldCheck size={16} className="text-purple-600" />
      case "service-center-admin":
        return <Building2 size={16} className="text-indigo-600" />
      case "cashier":
        return <CreditCard size={16} className="text-green-600" />
      case "data-operator":
        return <Database size={16} className="text-orange-600" />
      default:
        return <User size={16} className="text-gray-600" />
    }
  }

  const displayRole = formatRole(role)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Card - Modern design with gradient background */}
      <button 
        onClick={toggleDropdown} 
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02]" 
        style={{ width: "180px", height: "56px" }}
      >
        {/* Profile Picture with enhanced styling */}
        <div className="relative">
          <ProfilePicture src={pictureSrc} alt={pictureAlt} />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        {/* Name and Role with better typography */}
        <div className="flex flex-col items-start flex-1">
          <span className="font-semibold text-sm text-gray-800 leading-tight">
            {name}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {displayRole}
          </span>
        </div>

        {/* Chevron indicator */}
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu - Modern glass-morphism design */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header section with gradient background */}
          <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100/80">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProfilePicture src={pictureSrc} alt={pictureAlt} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm">
                  <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg leading-tight">
                  {name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="p-1 bg-white/60 rounded-lg">
                    {getRoleIcon(role)}
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {displayRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-3">
            {/* Logout button with enhanced styling */}
            <button
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
              }}
              className="flex items-center gap-4 w-full px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 group"
            >
              <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors">
                <LogOut size={16} />
              </div>
              <div>
                <span className="font-medium">Sign Out</span>
                <p className="text-xs text-red-400">End your current session</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileCard
