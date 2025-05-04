"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { fetchUsers } from "@/utils/api";
import { User } from "@/types";

const UsersPage = () => {
  const router = useRouter();
  const [userFilter, setUserFilter] = useState("All Users");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await fetchUsers();
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

  const handleActionSelect = (action: string, userId: string) => {
    if (action === "Edit") {
      router.push(`/user-managment/edit/${userId}`);
    } else if (action === "Delete") {
      console.log(`Deleting user with ID: ${userId}`);
    }
  };

  const handleCreateUser = () => {
    router.push("/user-managment/add-user");
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-lg font-bold text-neutral-600">User List</h1>
            <div className="w-[151px] h-[44px]"></div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="w-[150px] h-[36px]"></div>
            <div className="w-[120px] h-[28px]"></div>
          </div>
          <div className="w-full h-[400px] bg-neutral-50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-600">User List</h1>
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
          </div>
        ) : (
          <ClientTable
            headers={tableHeaders}
            data={usersData as unknown as Record<string, string>[]} // Type assertion to resolve TypeScript error
            actions={["edit", "delete"]}
            showSearchBar={true}
            showClientCell={true}
            onActionSelect={handleActionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;