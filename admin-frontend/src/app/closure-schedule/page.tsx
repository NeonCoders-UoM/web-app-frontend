'use client';

import React, { useState } from 'react';
import { Table } from '@/components/organism/closure-schedule-table/closure-schedule-table';
import ScheduleShopClosures from '@/components/molecules/schedule-shop-closures/schedule-shop-closures';
import ShiftCard from '@/components/atoms/shiftcard/shiftcard';

const ManageServices = () => {
  const [shiftCards, setShiftCards] = useState([
    { day: 'Today', status: 'Locked' },
    { day: '25-04-2025', status: 'Locked' },
  ]);

  const tableData = [
    { id: '1', label: 'Tire Rotation', checked: false },
    { id: '2', label: 'Engine Check', checked: true },
    { id: '3', label: 'Oil Filter Change', checked: false },
    { id: '4', label: 'Wheel Alignment', checked: true },
    { id: '5', label: 'Suspension Upgrades', checked: false },
  ];

  const handleSave = (week: string, days: string[]) => {
    if (days.length > 0) {
      const newShiftCard = {
        day: '25-04-2025', 
        status: 'Locked', 
      };
      setShiftCards([...shiftCards, newShiftCard]);
    }
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
      }}
    >
      {/* Page Heading */}
      <h1 className="h2 text-neutral-600">Manage Services</h1>

      {/* Top Section: ScheduleShopClosures (Left) and ShiftCards (Right) */}
      <div className="flex space-x-4">
        {/* Schedule Shop Closures Section (Left) */}
        <div className="flex-1">
          <ScheduleShopClosures onSave={handleSave} />
        </div>

        {/* Closure Schedule Section (Right) */}
        <div className="space-y-2">
          <div className="text-lg font-semibold text-neutral-600">Closure Schedule</div>
          <div
            className="p-4 rounded-lg space-y-2"
            style={{
              backgroundColor: '#F3F7FF',
            }}
          >
            {shiftCards.map((shift, index) => (
              <ShiftCard key={index} day={shift.day} status={shift.status} />
            ))}
          </div>
        </div>
      </div>

      {/* Services Table */}
      <Table data={tableData} />
    </div>
  );
};

export default ManageServices;