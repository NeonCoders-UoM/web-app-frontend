"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchMyServiceRequests } from "@/utils/api";
import { ServiceRequest } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";
import { getAuthUser } from "@/utils/auth";

export const dynamic = "force-dynamic";

const MyRequestsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceCenterId = params.id as string;
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedNotifications, setDismissedNotifications] = useState<number[]>([]);

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchMyServiceRequests(); // Backend uses JWT token
      setRequests(data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      alert("Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependency on serviceCenterId since backend uses token

  useEffect(() => {
    // Verify user is service center admin
    const user = getAuthUser();
    if (!user || user.userRole !== "ServiceCenterAdmin") {
      alert("Unauthorized access. Only Service Center Admins can view service requests.");
      router.push("/login");
      return;
    }

    // Verify the service center ID matches the user's station ID
    if (user.stationId && user.stationId !== serviceCenterId) {
      alert("You can only view requests for your own service center.");
      router.push(`/service-center-dashboard/${user.stationId}`);
      return;
    }

    loadRequests();
  }, [serviceCenterId, router, loadRequests]);

  // Separate pending and approved requests
  const pendingRequests = requests.filter(req => req.status.toLowerCase() === "pending");
  const approvedRequests = requests.filter(req => 
    req.status.toLowerCase() === "approved" && !dismissedNotifications.includes(req.serviceRequestId)
  );

  const handleDismissNotification = (requestId: number) => {
    setDismissedNotifications(prev => [...prev, requestId]);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold uppercase";
    switch (statusLower) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}`)}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Dashboard</span>
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
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Service Requests</h2>
              <p className="text-sm text-gray-500">View and track your pending service requests</p>
            </div>
            <button
              onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/request-service`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              New Request
            </button>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Approved Service Notifications */}
              {approvedRequests.length > 0 && (
                <div className="mb-6 space-y-3">
                  {approvedRequests.map((request) => (
                    <div
                      key={request.serviceRequestId}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">✓</span>
                          <p className="text-sm font-medium text-green-800">
                            Your service request &quot;{request.serviceName}&quot; has been approved!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(request.serviceRequestId)}
                        className="text-green-600 hover:text-green-800 transition-colors ml-3"
                        aria-label="Dismiss notification"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Requests */}
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No pending requests found.</p>
                  <button
                    onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/request-service`)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Submit your first request
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.serviceRequestId}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{request.serviceName}</h3>
                              <span className={getStatusBadge(request.status)}>{request.status}</span>
                            </div>
                            <p className="text-gray-600 mb-3">{request.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequestsPage;
