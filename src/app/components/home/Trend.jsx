'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

function Trend({session}) {
 
  return (
    <main className='flex flex-col items-center justify-center p-4 md:flex-row w-full'>
        <div className='flex flex-col justify-center w-full'>
        <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <p className='text-lg font-bold mt-10 text-[24px]'>Trend</p>
        </div>
    </main>
  );
}

export default Trend;
