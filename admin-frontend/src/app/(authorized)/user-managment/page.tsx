"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { fetchUsers } from "@/utils/api";
import { User } from "@/types";
import axiosInstance from "@/utils/axios";

const UsersPage = () => {
  const router = useRouter();
  const [userFilter, setUserFilter] = useState("Admin/all-users");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await fetchUsers();
        console.log("Fetched users:", users);
        setUsersData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableHeaders = [
    { title: "ID", sortable: true },
    { title: "First Name", sortable: true },
    { title: "Last Name", sortable: true },
    { title: "Email", sortable: true },
    { title: "User Role", sortable: true },
  ];

  const handleActionSelect = async (action: string, userId: string) => {
    if (action === "Edit") {
      router.push(`/user-managment/edit/${userId}`);
    } else if (action === "Delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;

      try {
        await axiosInstance.delete(`/Admin/${userId}`);
        alert("User deleted successfully!");
        setUsersData((prev) =>
          prev.filter((u) => u.userId !== parseInt(userId, 10))
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleCreateUser = () => {
    router.push("/user-managment/add-user");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-full mx-auto w-full">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold text-neutral-600">User List</h1>
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

        {/* User Filter and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-neutral-150 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="All Users">All Users</option>
              <option value="Admin">Admin</option>
              <option value="Service Staff">Service Staff</option>
              <option value="Data Operator">Data Operator</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <Button
            variant="primary"
            size="medium"
            onClick={handleCreateUser}
            icon="PlusIcon"
            iconPosition="left"
          >
            Create User
          </Button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-x-auto">
          {/* User Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ClientTable
              headers={tableHeaders}
              data={usersData.map((u) => ({
                id: u.userId.toString(),
                firstname: u.firstName,
                lastname: u.lastName,
                email: u.email,
                userrole: u.role,
              }))}
              actions={["edit", "delete"]}
              showSearchBar={true}
              showClientCell={true}
              onActionSelect={handleActionSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
