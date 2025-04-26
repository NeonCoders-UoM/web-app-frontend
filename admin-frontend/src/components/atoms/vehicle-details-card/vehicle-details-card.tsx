// src/components/atoms/vehicle-details-card/vehicle-details-card.tsx
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

export type Vehicle = {
  id: string
  client: string
  pictureSrc: string
  licenseplate: string
  owner?: string
  transmission?: string
  vin?: string
  color?: string
  fuelType?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
}

const VehicleDetailsModal = ({ isOpen, onClose, vehicle }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) setShow(true)
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  if (!vehicle || (!isOpen && !show)) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl border border-blue-100 transform transition-all duration-300 ${
          isOpen ? 'animate-modal-in' : 'animate-modal-out'
        }`}
      >
        <h2 className="text-blue-600 text-xl font-medium mb-6">Vehicle Details</h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">License Plate Number :</p>
              <p className="font-medium">{vehicle.licenseplate}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">VIC :</p>
              <p className="font-medium">{vehicle.vin || "N/A"}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">Fuel Type :</p>
              <p className="font-medium">{vehicle.fuelType || "N/A"}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Owner :</p>
              <p className="font-medium">{vehicle.owner || vehicle.client}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">Transmission :</p>
              <p className="font-medium">{vehicle.transmission || "N/A"}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">Color :</p>
              <p className="font-medium">{vehicle.color || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Image
            src="/images/vehicle.jpg"
            alt="Vehicle mechanics"
            width={200}
            height={120}
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailsModal