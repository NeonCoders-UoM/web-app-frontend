"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#FFFFFF]">
      <Loader2 className="animate-spin text-neutral-600" size={40} />
    </div>
  );
};

export default LoadingPage;