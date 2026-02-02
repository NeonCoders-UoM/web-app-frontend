"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, ArrowLeft, Loader2, Search, Plus } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import { fetchServiceCenterById, getServiceCenterUsers, deleteUser } from "@/utils/api";
import { ServiceCenter, ServiceCenterUser } from "@/types";
import { deleteAllAuthCookies, getCookie } from "@/utils/cookies";

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
    const userRole = getCookie("userRole");
    const userStationId = getCookie("station_id");

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

  const handleAction = (action: string, row: string[]) => {
    const userId = row[0];
    const userName = row[1];

    if (action === "Edit") {
      router.push(`/service-center-dashboard/${serviceCenterId}/users/edit/${userId}`);
    } else if (action === "Delete") {
      handleDeleteUser(parseInt(userId), userName);
    }
  };

  // Transform users data for the Table component
  const tableData = filteredUsers.map((user) => [
    user.id.toString(),
    `${user.firstName} ${user.lastName}`,
    user.email,
    user.userRole === "DataOperator" ? "Data Operator" : "Cashier",
  ]);

  const tableHeaders = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: true },
    { title: "Email", sortable: true },
    { title: "Role", sortable: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}`)}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Dashboard</span>
        </button>
        
        {/* <div className="absolute left-[800px] transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-gray-800 text-center">User Management</h1>
          <p className="text-gray-600 text-center">
            {serviceCenter?.serviceCenterName || "Service Center"}
          </p>
        </div> */}

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-40 mb-10 mt-2">
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
      {/* Action Bar */}
      <div className="mb-6">
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
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
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
          <Table
            headers={tableHeaders}
            data={tableData}
            actions={["edit", "delete"]}
            showSearchBar={false}
            onAction={handleAction}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceCenterUserManagement;
