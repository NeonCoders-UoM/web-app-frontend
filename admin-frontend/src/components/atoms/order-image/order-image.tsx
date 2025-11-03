"use client";
import Image from "next/image";
import React from "react";

interface OderImageProps {
  src: string;
  alt: string;
}

const OderImage: React.FC<OderImageProps> = ({ src, alt }) => {
  return (
    <div className="w-10 h-10 rounded-md overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-cover"
        priority
      />
    </div>
  );
};

export default OderImage;
