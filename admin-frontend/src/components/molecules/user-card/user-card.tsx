"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, User, ShieldCheck, Building2, CreditCard, Database } from "lucide-react"
import ProfilePicture from "@/components/atoms/profile-picture/profile-picture"
import { fetchCurrentUser } from "@/utils/api"

// Define the user roles as a type
type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator"

interface UserProfileCardProps {
  pictureSrc?: string
  pictureAlt?: string
  name?: string
  role?: UserRole
  onLogout?: () => void
  useCurrentUser?: boolean // New prop to enable dynamic user data
}

const UserProfileCard = ({
  pictureSrc,
  pictureAlt = "User Profile",
  name,
  role,
  onLogout,
  useCurrentUser = false, // Default to false for backward compatibility
}: UserProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string; email: string; role: string } | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch current user data if useCurrentUser is true
  useEffect(() => {
    if (useCurrentUser) {
      const fetchUser = async () => {
        setIsLoadingUser(true)
        try {
          const user = await fetchCurrentUser()
          console.log("Fetched user data:", user)
          if (user) {
            setCurrentUser(user)
          } else {
            // Fallback to localStorage data if API fails
            const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
            console.log("API failed, using fallback with role:", userRole)
            if (userRole) {
              setCurrentUser({
                firstName: "Admin", // Just show first name instead of "User Name"
                lastName: "",
                email: "admin@example.com",
                role: userRole
              })
            }
          }
        } catch (error) {
          console.error("Error fetching current user:", error)
          // Fallback to localStorage data if API fails
          const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null
          console.log("API error, using fallback with role:", userRole)
          if (userRole) {
            setCurrentUser({
              firstName: "Admin", // Just show first name instead of "User Name"
              lastName: "",
              email: "admin@example.com",
              role: userRole
            })
          }
        } finally {
          setIsLoadingUser(false)
        }
      }
      fetchUser()
    }
  }, [useCurrentUser])

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

  // Use dynamic user data if available, otherwise use props
  const displayName = useCurrentUser && currentUser 
    ? currentUser.lastName 
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName
    : name || "Moni Roy"
  
  const displayRole = useCurrentUser && currentUser
    ? currentUser.role
    : role || "admin"

  // Format role for display
  const formatRole = (role: string): string => {
    if (!role) return "User";
    
    switch (role.toLowerCase()) {
      case "admin":
        return "Admin"
      case "super-admin":
      case "superadmin":
        return "Super Admin"
      case "service-center-admin":
      case "servicecenteradmin":
      case "servicecenteradmin":
        return "Service Center Admin"
      case "cashier":
        return "Cashier"
      case "data-operator":
      case "dataoperator":
        return "Data Operator"
      default:
        return role
    }
  }

  // Get role icon based on user role with modern colors
  const getRoleIcon = (role: string) => {
    if (!role) return <User className="w-4 h-4" />;
    
    const roleLower = role.toLowerCase()
    switch (roleLower) {
      case "admin":
        return <User size={16} className="text-blue-600" />
      case "super-admin":
      case "superadmin":
        return <ShieldCheck size={16} className="text-purple-600" />
      case "service-center-admin":
      case "servicecenteradmin":
        return <Building2 size={16} className="text-indigo-600" />
      case "cashier":
        return <CreditCard size={16} className="text-green-600" />
      case "data-operator":
      case "dataoperator":
        return <Database size={16} className="text-orange-600" />
      default:
        return <User size={16} className="text-gray-600" />
    }
  }

  const formattedRole = formatRole(displayRole)

  // Show loading state if fetching user data
  if (useCurrentUser && isLoadingUser) {
    return (
      <div className="relative">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200/50 shadow-sm" 
             style={{ width: "180px", height: "56px" }}>
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex flex-col items-start flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-20"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Card - Modern design with gradient background */}
      <button 
        onClick={toggleDropdown} 
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02]" 
        style={{ width: "240px", height: "80px" }}
      >
        {/* Profile Picture with enhanced styling */}
        <div className="relative">
          <ProfilePicture src={pictureSrc} alt={pictureAlt} />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        {/* Name and Role with better typography */}
        <div className="flex flex-col items-start flex-1">
          <span className="font-semibold text-sm text-gray-800 leading-tight">
            {displayName}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {formattedRole}
          </span>
        </div>

        {/* Chevron */}
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
                  {displayName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="p-1 bg-white/60 rounded-lg">
                    {getRoleIcon(displayRole)}
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {formattedRole}
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
