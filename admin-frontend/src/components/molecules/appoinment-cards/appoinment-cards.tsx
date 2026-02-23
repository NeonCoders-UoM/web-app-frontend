"use client";

import React, { useState } from "react";
import {
  Calendar,
  Car,
  User,
  FileText,
  DollarSign,
  Wrench,
  X,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Pencil,
  Ban,
  ChevronDown,
  ChevronUp,
  Bell,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

type ServiceWithPrice = { name: string; price: number };

const statusConfig: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ReactNode; label: string }
> = {
  Pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-300",
    icon: <Clock size={13} />,
    label: "Pending",
  },
  Payment_Pending: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-300",
    icon: <AlertCircle size={13} />,
    label: "Payment Pending",
  },
  Confirmed: {
    bg: "bg-[#EBF0FF]",
    text: "text-[#275FEB]",
    border: "border-[#93AAFF]",
    icon: <CheckCircle2 size={13} />,
    label: "Confirmed",
  },
  Completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-300",
    icon: <CheckCircle2 size={13} />,
    label: "Completed",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-300",
    icon: <XCircle size={13} />,
    label: "Cancelled",
  },
  Accepted: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-300",
    icon: <CheckCircle2 size={13} />,
    label: "Accepted",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-300",
    icon: <XCircle size={13} />,
    label: "Rejected",
  },
};

interface AppointmentProps {
  appointmentId: string;
  owner: string;
  licensePlate: string;
  date: string;
  vehicle: string;
  services?: string[];
  servicesWithPrices?: ServiceWithPrice[];
  appointmentPrice?: number;
  status?: string;
  description?: string;
  customerId?: number;
  vehicleId?: number;
  serviceCenterName?: string;
  customerLoyaltyPoints?: number;
  customerEmail?: string;
  customerPhone?: string;
  onUpdate?: (data: { appointmentDate?: string; description?: string; status?: string }) => void;
  onCancel?: () => void;
  onClose?: () => void;
  isUpdating?: boolean;
  isCancelling?: boolean;
}

const AppointmentCard: React.FC<AppointmentProps> = ({
  appointmentId,
  owner,
  licensePlate,
  date,
  vehicle,
  services,
  servicesWithPrices,
  appointmentPrice,
  status = "Pending",
  description,
  customerId,
  serviceCenterName,
  customerLoyaltyPoints,
  customerEmail,
  customerPhone,
  onUpdate,
  onCancel,
  onClose,
  isUpdating = false,
  isCancelling = false,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "update" | "cancel">("details");
  const [editDate, setEditDate] = useState(
    date ? new Date(date).toISOString().slice(0, 10) : ""
  );
  const [editDescription, setEditDescription] = useState(description || "");
  const [editStatus, setEditStatus] = useState(status);
  const [showServicesExpanded, setShowServicesExpanded] = useState(true);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

  const statusInfo = statusConfig[status] || statusConfig["Pending"];
  const isCompleted = status === "Completed";
  const isCancelled = status === "Cancelled";
  const canModify = !isCompleted && !isCancelled;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({
        appointmentDate: editDate ? new Date(editDate).toISOString() : undefined,
        description: editDescription,
        status: editStatus !== status ? editStatus : undefined,
      });
    }
  };

  const handleCancel = () => {
    if (onCancel && cancelConfirmed) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-[640px] max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
      {/* Header - Clean light design */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#010134] flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Appointment
              </p>
              <h2 className="text-lg font-bold text-gray-900">#{appointmentId}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {canModify && (
          <div className="flex gap-1 mt-4 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "details"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText size={13} />
              Details
            </button>
            <button
              onClick={() => setActiveTab("update")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "update"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Pencil size={13} />
              Update
            </button>
            <button
              onClick={() => setActiveTab("cancel")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "cancel"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Ban size={13} />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* ===== DETAILS TAB ===== */}
        {activeTab === "details" && (
          <div className="space-y-4">
            {/* Customer & Contact Section */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
                <User size={14} className="text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Information
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-gray-800">{owner || "N/A"}</p>
                  </div>
                  {customerId && (
                    <div>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">ID</p>
                      <p className="text-sm font-semibold text-gray-800">#{customerId}</p>
                    </div>
                  )}
                </div>

                {/* Contact Details - prominent section */}
                {(customerPhone || customerEmail) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                    <div className="flex flex-wrap gap-2">
                      {customerPhone && (
                        <a
                          href={`tel:${customerPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Phone size={13} />
                          {customerPhone}
                        </a>
                      )}
                      {customerEmail && (
                        <a
                          href={`mailto:${customerEmail}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors truncate max-w-[280px]"
                        >
                          <Mail size={13} className="flex-shrink-0" />
                          {customerEmail}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {customerLoyaltyPoints !== undefined && customerLoyaltyPoints > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Shield size={13} className="text-amber-500" />
                      <span className="text-sm font-semibold text-amber-600">
                        {customerLoyaltyPoints} loyalty points
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Car size={14} className="text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Vehicle</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{vehicle || "N/A"}</p>
                    <p className="text-xs text-gray-500">{licensePlate || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Calendar size={14} className="text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{formattedDate}</p>
                  </div>
                </div>
              </div>

              {serviceCenterName && (
                <div className="rounded-lg border border-gray-200 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-gray-100">
                      <Wrench size={14} className="text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Service Center</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{serviceCenterName}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-gray-200 p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-green-50">
                    <DollarSign size={14} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="text-base font-bold text-green-700 mt-0.5">
                      LKR {(appointmentPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="rounded-lg border border-gray-200 p-3.5">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Services */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowServicesExpanded(!showServicesExpanded)}
                className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Wrench size={13} className="text-gray-500" />
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    Services ({servicesWithPrices?.length || services?.length || 0})
                  </span>
                </div>
                {showServicesExpanded ? (
                  <ChevronUp size={15} className="text-gray-400" />
                ) : (
                  <ChevronDown size={15} className="text-gray-400" />
                )}
              </button>
              {showServicesExpanded && (
                <div className="p-3">
                  {servicesWithPrices && servicesWithPrices.length > 0 ? (
                    <div className="space-y-1.5">
                      {servicesWithPrices.map((svc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                        >
                          <span className="text-sm text-gray-700">{svc.name}</span>
                          <span className="text-sm font-medium text-gray-800">
                            LKR {svc.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between py-2.5 px-3 bg-green-50 rounded-md border border-green-200 mt-1.5">
                        <span className="text-sm font-bold text-green-800">Total</span>
                        <span className="text-sm font-bold text-green-700">
                          LKR {(appointmentPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ) : services && services.length > 0 ? (
                    <div className="space-y-1.5">
                      {services.map((service, index) => (
                        <div key={index} className="py-2 px-3 bg-gray-50 rounded-md text-sm text-gray-700">
                          {service}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic py-2 px-1">No services listed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== UPDATE TAB ===== */}
        {activeTab === "update" && canModify && (
          <div className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-gray-800"
                >
                  <option value="Pending">Pending</option>
                  <option value="Payment_Pending">Payment Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all text-gray-800"
                  placeholder="Add notes..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Values</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-400">Status:</span> <span className="font-medium text-gray-700">{status}</span></div>
                  <div><span className="text-gray-400">Date:</span> <span className="font-medium text-gray-700">{formattedDate}</span></div>
                  <div className="col-span-2"><span className="text-gray-400">Owner:</span> <span className="font-medium text-gray-700">{owner}</span></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#010134] text-white rounded-lg font-medium text-sm hover:bg-[#010134]/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Check size={15} />
                )}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("details");
                  setEditDate(date ? new Date(date).toISOString().slice(0, 10) : "");
                  setEditDescription(description || "");
                  setEditStatus(status);
                }}
                className="px-4 py-2.5 bg-white text-gray-600 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ===== CANCEL TAB ===== */}
        {activeTab === "cancel" && canModify && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-3.5 border border-red-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Cancel Appointment</h3>
                  <p className="text-xs text-red-600 mt-0.5">
                    This will cancel <strong>#{appointmentId}</strong> and notify the customer. Cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3.5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Summary</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">ID:</span> <span className="font-medium text-gray-700">#{appointmentId}</span></div>
                <div><span className="text-gray-400">Owner:</span> <span className="font-medium text-gray-700">{owner}</span></div>
                <div><span className="text-gray-400">Vehicle:</span> <span className="font-medium text-gray-700">{vehicle} - {licensePlate}</span></div>
                <div><span className="text-gray-400">Date:</span> <span className="font-medium text-gray-700">{formattedDate}</span></div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={13} className="text-amber-600" />
                <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Notification Preview</p>
              </div>
              <p className="text-xs text-amber-700 bg-white p-2.5 rounded-md border border-amber-200 leading-relaxed">
                Dear <strong>{owner}</strong>, your appointment <strong>#{appointmentId}</strong> has been
                cancelled by the service center. Please contact us for assistance or to reschedule.
              </p>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={cancelConfirmed}
                onChange={(e) => setCancelConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I confirm I want to cancel this appointment. Customer will be notified.
              </span>
            </label>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleCancel}
                disabled={!cancelConfirmed || isCancelling}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Ban size={15} />
                )}
                {isCancelling ? "Cancelling..." : "Cancel & Notify"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("details");
                  setCancelConfirmed(false);
                }}
                className="px-4 py-2.5 bg-white text-gray-600 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
