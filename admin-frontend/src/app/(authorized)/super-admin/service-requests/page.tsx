"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Sidebar from "@/components/molecules/side-bar/side-bar";
import { fetchPendingServiceRequests, approveServiceRequest, rejectServiceRequest } from "@/utils/api";
import { ServiceRequest, ApproveServiceRequestDTO, RejectServiceRequestDTO } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";
import { getAuthUser } from "@/utils/auth";

export const dynamic = "force-dynamic";

const ServiceRequestsPage: React.FC = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Verify user is admin or super admin
    const user = getAuthUser();
    if (!user || (user.userRole !== "Admin" && user.userRole !== "SuperAdmin")) {
      alert("Unauthorized access. Only Admins and Super Admins can review service requests.");
      router.push("/login");
      return;
    }

    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPendingServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      // Don't show alert, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = (request: ServiceRequest, action: "approved" | "rejected") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setShowReviewModal(true);
    setBasePrice(0);
  };

  const handleReviewSubmit = async () => {
    if (!selectedRequest || !reviewAction) return;

    if (reviewAction === "approved" && basePrice <= 0) {
      alert("Please provide a valid base price for the service.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (reviewAction === "approved") {
        const approveData: ApproveServiceRequestDTO = {
          basePrice: basePrice,
        };
        await approveServiceRequest(selectedRequest.serviceRequestId, approveData);
      } else {
        const rejectData: RejectServiceRequestDTO = {
          rejectionReason: "Rejected by admin",
        };
        await rejectServiceRequest(selectedRequest.serviceRequestId, rejectData);
      }
      
      alert(`Service request ${reviewAction} successfully!`);
      
      // Close modal and reload requests
      setShowReviewModal(false);
      setSelectedRequest(null);
      setReviewAction(null);
      setBasePrice(0);
      loadRequests();
    } catch (error) {
      console.error("Error reviewing service request:", error);
      alert("Failed to review service request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <Sidebar role="super-admin" activeRoute="/services" />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back</span>
          </button>

          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              deleteAllAuthCookies();
              router.push("/login");
            }}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            {/* Title */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-600">Pending Service Requests</h2>
              <p className="text-sm text-gray-500">
                Review and approve service requests from service centers
              </p>
            </div>

            {/* Requests List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No pending service requests at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.serviceRequestId}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{request.serviceName}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-100 text-yellow-700">
                            {request.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm text-gray-500 font-medium">Description:</span>
                          <p className="text-gray-700 mt-1">{request.description || 'No description provided'}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Requested by:</span>
                            <p className="font-medium text-gray-800">{request.serviceCenterName || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <p className="font-medium text-gray-800">{request.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Requested:</span>
                            <p className="font-medium text-gray-800">
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReviewClick(request, "approved")}
                            className="px-4 py-2 bg-blue-600 text-gray-100 rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewClick(request, "rejected")}
                            className="px-4 py-2 bg-red-600 text-gray-100 rounded-md hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {reviewAction === "approved" ? "Approve" : "Reject"} Service Request
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>Service:</strong> {selectedRequest.serviceName}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Requested by:</strong> {selectedRequest.serviceCenterName || 'N/A'}
              </p>
              {reviewAction === "approved" ? (
                <div>
                  <label htmlFor="basePrice" className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    placeholder="Enter base price for the service"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                  />
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      This service will be added to the system with the specified base price and will be available for all service centers.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    Are you sure you want to reject this service request? This action cannot be undone.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedRequest(null);
                  setReviewAction(null);
                  setBasePrice(0);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-gray-100 rounded-md transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 text-sm ${
                  reviewAction === "approved"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  reviewAction === "approved" ? "Approve" : "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsPage;
