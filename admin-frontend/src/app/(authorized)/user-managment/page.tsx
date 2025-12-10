"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { fetchUsers } from "@/utils/api";
import { User } from "@/types";
import axiosInstance from "@/utils/axios";
import Sidebar from "@/components/molecules/side-bar/side-bar";

const UsersPage = () => {
  const router = useRouter();
      const [selectedTab, setSelectedTab] = useState("dashboard");

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
      <Sidebar
              role="super-admin"
              serviceCenters={[]}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
      <div className="max-w-full mx-auto ml-72">
        <div className="flex justify-end items-center mb-10">
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

        <div className="">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
                User Management
                <p className="text-sm font-light text-gray-600 mt-2">
                  Manage system users and their roles
                </p>
              </h1>
            </div>
            <Button
              variant="primary"
              size="medium"
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </div>

          <div className="">
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
    </div>
  );
};

export default UsersPage;
