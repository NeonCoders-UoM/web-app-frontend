"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, UserPlus, ArrowLeft, Loader2, Search, Edit, Trash2 } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import StatusCard from "@/components/atoms/status-cards/status-card";
import { fetchServiceCenterById, getServiceCenterUsers, deleteUser } from "@/utils/api";
import { ServiceCenter, ServiceCenterUser } from "@/types";

const ServiceCenterUserManagement = () => {
  const params = useParams();
  const router = useRouter();
  const serviceCenterId = params.id as string;

  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(null);
  const [users, setUsers] = useState<ServiceCenterUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ServiceCenterUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<"all" | "Cashier" | "DataOperator">("all");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userStationId = localStorage.getItem("station_id");

    // Only ServiceCenterAdmin can access this page
    if (userRole !== "ServiceCenterAdmin") {
      router.push(`/service-center-dashboard/${serviceCenterId}`);
      return;
    }

    // Ensure they're managing their own service center
    if (userStationId && userStationId !== serviceCenterId) {
      router.push(`/service-center-dashboard/${userStationId}`);
      return;
    }
  }, [serviceCenterId, router]);

  useEffect(() => {
    fetchData();
  }, [serviceCenterId]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterRole]);

  const fetchData = async () => {
    if (!serviceCenterId) return;

    setIsLoading(true);
    try {
      const [centerData, usersData] = await Promise.all([
        fetchServiceCenterById(serviceCenterId),
        getServiceCenterUsers(serviceCenterId),
      ]);

      setServiceCenter(centerData);
      // Filter to show only Cashiers and Data Operators
      const filteredData = usersData.filter(
        (user: ServiceCenterUser) => user.userRole === "Cashier" || user.userRole === "DataOperator"
      );
      setUsers(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.userRole === filterRole);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await deleteUser(userId.toString());
      alert("User deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}`)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">
              {serviceCenter?.serviceCenterName || "Service Center"}
            </p>
          </div>
        </div>
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        />
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter & Add Button */}
          <div className="flex gap-3 items-center">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            >
              <option value="all">All Roles</option>
              <option value="Cashier">Cashiers</option>
              <option value="DataOperator">Data Operators</option>
            </select>

            <button
              onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/users/add`)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatusCard
          title="Total Users"
          value={users.length}
          icon="customers"
        />
        <StatusCard
          title="Cashiers"
          value={users.filter((u) => u.userRole === "Cashier").length}
          icon="customers"
        />
        <StatusCard
          title="Data Operators"
          value={users.filter((u) => u.userRole === "DataOperator").length}
          icon="customers"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Members
          </h2>
          <span className="text-sm text-gray-500">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No users found</p>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add your first staff member to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.userRole === "Cashier"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-purple-100 text-purple-700 border border-purple-300"
                        }`}
                      >
                        {user.userRole === "DataOperator" ? "Data Operator" : "Cashier"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/service-center-dashboard/${serviceCenterId}/users/edit/${user.id}`
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCenterUserManagement;
