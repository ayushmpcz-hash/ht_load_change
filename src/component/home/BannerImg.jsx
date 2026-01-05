import React from 'react';
import banner from '../../assets/image/banner.png';
export default function BannerImg() {
  return (
    <>
      <div className="bg-white">
        <div class="container mx-auto px-4 h-full">
          <img alt="" src={banner} className="w-[90%] mx-auto" />
        </div>
      </div>
    </>
  );
}
