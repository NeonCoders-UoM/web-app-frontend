"use client";

import React from "react";

const KebabMenu: React.FC = () => {
  return (
    <button
      className="p-2 rounded-full hover:bg-neutral-200 focus:outline-none"
      aria-label="Menu"
    >
      ⋮
    </button>
  );
};

export default KebabMenu;