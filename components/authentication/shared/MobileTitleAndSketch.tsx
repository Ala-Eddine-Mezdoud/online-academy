'use client';

import Image from 'next/image';

interface MobileTitleAndSketchProps {
  sketchImage: string;
  sketchAlt: string;
}

export default function MobileTitleAndSketch({ sketchImage, sketchAlt }: MobileTitleAndSketchProps) {
  return (
    <div className="lg:hidden mb-0 mt-15">
      <h1 
        className="text-4xl font-bold text-[#19B7FF] text-center mb-5" 
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        EduConnect
      </h1>
      <div className="w-30 h-30 mx-auto relative">
        <Image
          src={sketchImage}
          alt={sketchAlt}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

