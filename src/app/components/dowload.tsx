'use client';

import React from 'react';
import { GoX } from "react-icons/go";
import { LuRefreshCw } from "react-icons/lu";
import Link from 'next/link';
interface ReviewProject {
  project: string;
}

const Report: React.FC<ReviewProject> = ({ project }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-4 py-8 lg:px-10 bg-gray-100">
        <div className="relative mx-auto mt-1">
        <Link href="/">
          <GoX className="absolute ml-10 text-black-600 text-4xl cursor-pointer" />
          </Link>
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center ">
          <LuRefreshCw className="text-8xl mb-10 text-blue-500 animate-slow-spin " />
            <h3>หากค้างอยู่ที่หน้านี้นานโปรดตรวจสอบแถบ</h3>
            <h3>Downloadของ browserของท่าน</h3>
            <h3>โดยในSafari จะอยู่ด้านขวาของ url bar</h3>
            <h3>เป็นลูกศรชี้ลงส่วนใน Chrome Mobile</h3>
            <h3>จะเด้งขึ้นมาด้านล่าง</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;