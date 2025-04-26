// src/app/service-centers/[id]/view/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

const ServiceCenterView: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    // Redirect to the Details tab by default
    router.replace(`/service-centers/${id}/view/details`);
  }, [id, router]);

  return null; // This page doesn't render anything; it just redirects
};

export default ServiceCenterView;