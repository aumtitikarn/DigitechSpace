'use client';

import React, { useEffect, useRef } from 'react';
import { FaSearch, FaFire } from 'react-icons/fa';

function Trend({ session }) {

  return (
    <main className='flex flex-col items-center justify-center p-4 w-full'>
      <div className='flex flex-col justify-center w-full'>
        <div className="relative mt-4">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className='flex items-center space-x-2 mt-10'>
          <p className='text-lg font-bold text-[24px]'>Trend</p>
          <FaFire className='text-red-500 text-2xl' />
        </div>
        <div className='mt-4 overflow-x-auto ' >
          <div className='flex space-x-4'>
            {['เว็บไซต์', 'แอพขายของ', 'เว็บโซเชียล', 'NFT', 'Blockchain', 'แอพขายของ', 'NFT', 'Blockchain', 'แอพขายของ', 'เว็บไซต์', 'แอพขายของ', 'เว็บโซเชียล', 'NFT', 'Blockchain', 'แอพขายของ', 'NFT', 'Blockchain', 'แอพขายของ'].map((label, index) => (
              <button 
                key={index} 
                className='w-[112px] h-[35px] flex-shrink-0 rounded-full bg-[#FFC107] text-black font-semibold'
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Trend;
