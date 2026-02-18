"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, ChevronDown } from "lucide-react"
import ProfilePicture from "@/components/atoms/profile-picture/profile-picture"
import { fetchCurrentUser } from "@/utils/api"
import { getCookie } from "@/utils/cookies"

type UserRole = "admin" | "super-admin" | "service-center-admin" | "cashier" | "data-operator"

interface UserProfileCardProps {
  pictureSrc?: string
  pictureAlt?: string
  name?: string
  role?: UserRole
  onLogout?: () => void
  useCurrentUser?: boolean
}

const UserProfileCard = ({
  pictureSrc,
  pictureAlt = "User Profile",
  name,
  role,
  onLogout,
  useCurrentUser = false,
}: UserProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string; email: string; role: string } | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (useCurrentUser) {
      const fetchUser = async () => {
        setIsLoadingUser(true)
        try {
          const user = await fetchCurrentUser()
          if (user) {
            setCurrentUser(user)
          } else {
            const userRole = typeof window !== 'undefined' ? getCookie('userRole') : null
            if (userRole) {
              setCurrentUser({ firstName: "Admin", lastName: "", email: "", role: userRole })
            }
          }
        } catch {
          const userRole = typeof window !== 'undefined' ? getCookie('userRole') : null
          if (userRole) {
            setCurrentUser({ firstName: "Admin", lastName: "", email: "", role: userRole })
          }
        } finally {
          setIsLoadingUser(false)
        }
      }
      fetchUser()
    }
  }, [useCurrentUser])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const displayName = useCurrentUser && currentUser
    ? currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName
    : name || "User"

  const displayRole = useCurrentUser && currentUser
    ? currentUser.role
    : role || "admin"

  const formatRole = (role: string): string => {
    if (!role) return "User"
    switch (role.toLowerCase()) {
      case "admin": return "Admin"
      case "super-admin":
      case "superadmin": return "Super Admin"
      case "service-center-admin":
      case "servicecenteradmin": return "Service Center Admin"
      case "cashier": return "Cashier"
      case "data-operator":
      case "dataoperator": return "Data Operator"
      default: return role
    }
  }

  const formattedRole = formatRole(displayRole)

  if (useCurrentUser && isLoadingUser) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="h-3.5 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
      >
        <div className="relative flex-shrink-0">
          <ProfilePicture src={pictureSrc} alt={pictureAlt} />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[11px] text-gray-500 leading-tight">
            {formattedRole}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 ml-1 flex-shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{formattedRole}</p>
          </div>
          <div className="p-1.5">
            <button
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileCard
