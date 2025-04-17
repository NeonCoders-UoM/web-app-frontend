"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, User, ShieldCheck, Building2, CreditCard, Database } from "lucide-react"
import ProfilePicture from "@/components/atoms/profile-picture/profile-picture"
import colors from "@/styles/colors"

// Define the user roles as a type
type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator"

interface UserProfileCardProps {
  pictureSrc?: string
  pictureAlt?: string
  name?: string
  role?: UserRole
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

const UserProfileCard = ({
  pictureSrc = "/profile-picture.jpg",
  pictureAlt = "User Profile",
  name = "Moni Roy",
  role = "admin",
  onLogout,
  onProfileClick,
  onSettingsClick,
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

  // Get role icon based on user role
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <User size={16} style={{ color: colors.neutral[300] }} />
      case "super-admin":
        return <ShieldCheck size={16} style={{ color: colors.neutral[300] }} />
      case "service-center-admin":
        return <Building2 size={16} style={{ color: colors.neutral[300] }} />
      case "cashier":
        return <CreditCard size={16} style={{ color: colors.neutral[300] }} />
      case "data-operator":
        return <Database size={16} style={{ color: colors.neutral[300] }} />
      default:
        return <User size={16} style={{ color: colors.neutral[300] }} />
    }
  }

  const displayRole = formatRole(role)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Card - Fixed width and height as specified */}
      <button onClick={toggleDropdown} className="flex items-center gap-3" style={{ width: "151px", height: "44px" }}>
        {/* Profile Picture */}
        <ProfilePicture src={pictureSrc} alt={pictureAlt} />

        {/* Name and Role */}
        <div className="flex flex-col items-start">
          <span className="font-semibold text-sm" style={{ color: colors.neutral[600] }}>
            {name}
          </span>
          <span className="text-xsm" style={{ color: colors.neutral[300] }}>
            {displayRole}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
          style={{ border: `1px solid ${colors.neutral[100]}` }}
        >
          <div className="p-4" style={{ borderBottom: `1px solid ${colors.neutral[100]}` }}>
            <div className="flex items-center gap-3">
              <ProfilePicture src={pictureSrc} alt={pictureAlt} />
              <div>
                <p className="font-semibold" style={{ color: colors.neutral[600] }}>
                  {name}
                </p>
                <div className="flex items-center gap-1">
                  {getRoleIcon(role)}
                  <p className="text-sm" style={{ color: colors.neutral[300] }}>
                    {displayRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                onProfileClick?.()
                setIsOpen(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
              style={{ color: colors.neutral[400] }}
            >
              
              
            </button>

            {/* Only show settings for admin roles */}
            {(role === "admin" || role === "super-admin" || role === "service-center-admin") && (
              <button
                onClick={() => {
                  onSettingsClick?.()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                style={{ color: colors.neutral[400] }}
              >
                
              </button>
            )}

            <div className="my-1" style={{ borderTop: `1px solid ${colors.neutral[100]}` }}></div>

            <button
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm transition-colors"
              style={{ color: colors.states.error }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileCard
