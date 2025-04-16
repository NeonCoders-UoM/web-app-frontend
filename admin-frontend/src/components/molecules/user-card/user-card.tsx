"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import Image from "next/image"

interface UserProfileCardProps {
  pictureSrc?: string
  name?: string
  role?: string
}

const UserProfileCard = ({
  pictureSrc = "/profile-picture.jpg",
  name = "Moni Roy",
  role = "Admin",
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 py-2 px-3 rounded-full bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
          {pictureSrc ? (
            <Image src={pictureSrc || "/placeholder.svg"} alt={name} width={32} height={32} className="object-cover" />
          ) : (
            <span className="text-white font-medium">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-neutral-700">{name}</span>
          <span className="text-xs text-neutral-400">{role}</span>
        </div>
        <ChevronDown size={16} className="text-neutral-400 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-neutral-100 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                {pictureSrc ? (
                  <Image
                    src={pictureSrc || "/placeholder.svg"}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-lg">{name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-neutral-800">{name}</p>
                <p className="text-sm text-neutral-500">{role}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors">
              <User size={16} className="text-neutral-500" />
              <span>My Profile</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors">
              <Settings size={16} className="text-neutral-500" />
              <span>Settings</span>
            </button>
            <div className="my-1 border-t border-neutral-100"></div>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors">
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
