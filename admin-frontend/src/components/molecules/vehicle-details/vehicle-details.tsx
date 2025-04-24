"use client"

import type React from "react"
import Button from "@/components/atoms/button/button"

interface VehicleDetailsProps {
  vehicleType: string
  vehicleBrand: string
  vin: string
  vehicleModel: string
  year: string
  fuelType: string
  licensePlate: string
  transmission: string
  onEditDetails: () => void
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicleType,
  vehicleBrand,
  vin,
  vehicleModel,
  year,
  fuelType,
  licensePlate,
  transmission,
  onEditDetails,
}) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-600">Vehicle Details</h3>
        <Button variant="primary" size="small" onClick={onEditDetails}>
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-neutral-300 mb-1">Vehicle Type:</p>
          <p className="text-sm font-medium text-neutral-600">{vehicleType}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">Vehicle Brand:</p>
          <p className="text-sm font-medium text-neutral-600">{vehicleBrand}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">VIN:</p>
          <p className="text-sm font-medium text-neutral-600">{vin}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">Vehicle Model:</p>
          <p className="text-sm font-medium text-neutral-600">{vehicleModel}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">Year:</p>
          <p className="text-sm font-medium text-neutral-600">{year}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">Fuel Type:</p>
          <p className="text-sm font-medium text-neutral-600">{fuelType}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">License Plate Number:</p>
          <p className="text-sm font-medium text-neutral-600">{licensePlate}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-300 mb-1">Transmission:</p>
          <p className="text-sm font-medium text-neutral-600">{transmission}</p>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetails
