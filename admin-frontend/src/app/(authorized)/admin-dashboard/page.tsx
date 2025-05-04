"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import Button from "@/components/atoms/button/button";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Image from "next/image";
import { fetchDashboardStats, fetchServiceCenters } from "@/utils/api";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({ customers: 0, vehicles: 0, serviceCenters: 0 });
  const [serviceCenters, setServiceCenters] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchDashboardStats();
        const centers = await fetchServiceCenters();
        setDashboardData(stats);
        setServiceCenters(
          centers.map((sc) => [
            sc.id,
            sc.serviceCenterName,
            sc.email,
            sc.telephoneNumber,
            sc.address,
          ])
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Name", sortable: true },
    { title: "Email", sortable: true },
    { title: "Phone No.", sortable: true },
    { title: "Address", sortable: true },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with logo and user profile */}
      <div className="flex justify-between items-center mb-[32px]">
        <div className="flex items-center">
          <Image
                    src="/images/logo1.png"
                    alt="Logo"
                    width={100}
                    height={20}
                    className="object-contain"
                  />
        </div>
        <div className="w-auto">
          <UserProfileCard />
        </div>
      </div>

      <div className="px-[182px]">
        <h1 className="text-2xl font-bold mb-[32px]">Dashboard</h1>

        {/* Status Cards */}
        <div className="flex justify-start gap-[67px] mb-[44px]">
          <StatusCard title="Customers" value={dashboardData.customers} icon="customers" />
          <StatusCard title="Vehicles" value={dashboardData.vehicles} icon="vehicles" />
          <StatusCard title="Appointments" value={dashboardData.serviceCenters} icon="serviceCenters" />
        </div>

        {/* Service Centers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-[32px]">Service Centers</h2>

          <div className="flex justify-between items-center mb-[40px]">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-neutral-150 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                defaultValue="all"
                suppressHydrationWarning
              >
                <option value="all">All Service Centers</option>
                <option value="active">Active Centers</option>
                <option value="inactive">Inactive Centers</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="primary" size="medium" icon="PlusIcon" iconPosition="left">
                <span className="flex items-center">
                  <Plus size={16} className="mr-1" />
                  Add Service Center
                </span>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-[32px]">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-300" />
              </div>
              <input
                type="text"
                placeholder="Search by name, type, brand or others..."
                className="pl-10 pr-4 py-2.5 w-full border border-neutral-150 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <button
              className="px-4 py-2 border border-neutral-150 rounded-md flex items-center gap-2 text-neutral-400"
              suppressHydrationWarning
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
            </div>
          ) : (
            <Table
              headers={tableHeaders}
              data={serviceCenters}
              actions={["view", "edit", "delete"]}
              showSearchBar={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;