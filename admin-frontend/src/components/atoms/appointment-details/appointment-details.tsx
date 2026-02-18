"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Wrench,
  FileText,
  DollarSign,
  Trash2,
  Pencil,
  X,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Status badge color mapping
const statusConfig: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode; label: string }
> = {
  Pending: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: <Clock size={14} />,
    label: "Pending",
  },
  Payment_Pending: {
    bg: "bg-orange-50 border-orange-200",
    text: "text-orange-700",
    icon: <AlertCircle size={14} />,
    label: "Payment Pending",
  },
  Confirmed: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: <CheckCircle2 size={14} />,
    label: "Confirmed",
  },
  Completed: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-700",
    icon: <CheckCircle2 size={14} />,
    label: "Completed",
  },
  Cancelled: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: <X size={14} />,
    label: "Cancelled",
  },
};

type AppointmentCardProps = {
  appointmentId: number;
  appointmentDate: string;
  serviceCenterName: string;
  services: { serviceName: string; estimatedCost: number }[];
  totalCost: number;
  status?: string;
  description?: string;
  vehicleRegistration?: string;
  loyaltyPoints?: number;
  onDelete?: (appointmentId: number) => void;
  onUpdate?: (
    appointmentId: number,
    data: { appointmentDate?: string; description?: string }
  ) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
};

export const AppointmentCard = ({
  appointmentId,
  appointmentDate,
  serviceCenterName,
  services,
  totalCost,
  status = "Pending",
  description,
  vehicleRegistration,
  loyaltyPoints,
  onDelete,
  onUpdate,
  isDeleting = false,
  isUpdating = false,
}: AppointmentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editDate, setEditDate] = useState(
    appointmentDate ? new Date(appointmentDate).toISOString().slice(0, 16) : ""
  );
  const [editDescription, setEditDescription] = useState(description || "");
  const [expanded, setExpanded] = useState(false);

  const statusInfo = statusConfig[status] || statusConfig["Pending"];
  const isCompleted = status === "Completed";
  const isCancelled = status === "Cancelled";
  const canModify = !isCompleted && !isCancelled;

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(appointmentId, {
        appointmentDate: editDate
          ? new Date(editDate).toISOString()
          : undefined,
        description: editDescription,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(appointmentId);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${
          status === "Completed"
            ? "bg-green-500"
            : status === "Confirmed"
            ? "bg-blue-500"
            : status === "Payment_Pending"
            ? "bg-orange-500"
            : status === "Cancelled"
            ? "bg-red-500"
            : "bg-amber-500"
        }`}
      />

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wide">
              Appointment
            </span>
            <span className="text-lg font-bold text-neutral-800">
              #{appointmentId}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>

          {/* Action buttons */}
          {canModify && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setShowDeleteConfirm(false);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit appointment"
                disabled={isUpdating}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(!showDeleteConfirm);
                  setIsEditing(false);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete appointment"
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mx-5 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium mb-2">
            Are you sure you want to delete this appointment?
          </p>
          <p className="text-xs text-red-500 mb-3">
            This will notify the customer about the cancellation.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Trash2 size={12} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-600 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {isEditing && (
        <div className="mx-5 mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-3">
            Edit Appointment
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Notes / Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                placeholder="Add notes or description..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Check size={12} />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-600 text-xs font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="px-5 pb-4">
        {/* Key info grid */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          {/* Date */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-50">
              <Calendar size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Date & Time
              </p>
              <p className="text-sm font-semibold text-neutral-800">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Service Center */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-50">
              <MapPin size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Service Center
              </p>
              <p className="text-sm font-semibold text-neutral-800">
                {serviceCenterName || "N/A"}
              </p>
            </div>
          </div>

          {/* Vehicle */}
          {vehicleRegistration && (
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1.5 rounded-lg bg-purple-50">
                <FileText size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Vehicle
                </p>
                <p className="text-sm font-semibold text-neutral-800">
                  {vehicleRegistration}
                </p>
              </div>
            </div>
          )}

          {/* Total Cost */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-lg bg-amber-50">
              <DollarSign size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Total Cost
              </p>
              <p className="text-sm font-bold text-neutral-800">
                Rs. {totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Services section */}
        <div className="border-t border-neutral-100 pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-50">
                <Wrench size={14} className="text-sky-600" />
              </div>
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Services ({services.length})
              </span>
            </div>
            {expanded ? (
              <ChevronUp size={16} className="text-neutral-400" />
            ) : (
              <ChevronDown size={16} className="text-neutral-400" />
            )}
          </button>

          {expanded && (
            <div className="mt-2 space-y-1.5">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 px-3 bg-neutral-50 rounded-lg"
                >
                  <span className="text-sm text-neutral-700">
                    {service.serviceName}
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    Rs.{" "}
                    {service.estimatedCost.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="border-t border-neutral-100 pt-3 mt-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1.5 rounded-lg bg-neutral-100">
                <FileText size={14} className="text-neutral-500" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Notes
                </p>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty points */}
        {loyaltyPoints !== undefined && loyaltyPoints > 0 && (
          <div className="border-t border-neutral-100 pt-3 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
              <span className="text-amber-500 text-lg">★</span>
              <span className="text-xs font-medium text-amber-700">
                Earn {loyaltyPoints} loyalty points
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for appointment card
export const AppointmentCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-1 w-full bg-neutral-200" />
    <div className="px-5 pt-4 pb-3 flex items-center justify-between">
      <div>
        <div className="h-3 w-16 bg-neutral-200 rounded mb-1" />
        <div className="h-5 w-12 bg-neutral-200 rounded" />
      </div>
      <div className="h-6 w-24 bg-neutral-200 rounded-full" />
    </div>
    <div className="px-5 pb-4">
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
            <div>
              <div className="h-3 w-16 bg-neutral-200 rounded mb-1" />
              <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);