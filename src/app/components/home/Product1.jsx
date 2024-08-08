'use client';

import React from 'react';
import { FaSearch, FaFire } from 'react-icons/fa';
import { IoDocumentTextOutline, IoTerminalOutline } from 'react-icons/io5';
import { BsBox } from 'react-icons/bs';
import { MdWeb, MdOutlineAppShortcut, MdOutlinePhotoFilter } from 'react-icons/md';
import { GoDependabot } from 'react-icons/go';
import { AiOutlineDatabase } from 'react-icons/ai';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { RiMenuSearchLine } from "react-icons/ri";

const buttonsData = [
  { type: "Document", icon: <IoDocumentTextOutline size={24} /> },
  { type: "Model/3D", icon: <BsBox size={24} /> },
  { type: "Website", icon: <MdWeb size={24} /> },
  { type: "MobileApp", icon: <MdOutlineAppShortcut size={24} /> },
  { type: "AI", icon: <GoDependabot size={24} /> },
  { type: "Datasets", icon: <AiOutlineDatabase size={24} /> },
  { type: "IOT", icon: <IoTerminalOutline size={24} /> },
  { type: "Program", icon: <HiOutlineComputerDesktop size={24} /> },
  { type: "Photo/Art", icon: <MdOutlinePhotoFilter size={24} /> },
  { type: "Other", icon: <RiMenuSearchLine  size={24} /> }
];

function Product1() {

  return (
    <main className='flex flex-col items-center justify-center px-4 w-full '>
      <div className='flex flex-col justify-center w-full'>
        <div className='flex items-center space-x-2 mt-3'>
          <p className=' font-bold 'style={{fontSize:"24px"}}>Website</p>
        </div>
        <div className='mt-10 mt-3'>
          <div className='grid  gap-4 grid-cols-3 lg:grid-cols-4 xl:grid-cols-10'>
            {buttonsData.map((button, index) => (
              <button 
                key={index} 
                className='w-full h-[80px] flex flex-col items-center justify-center rounded-lg  text-black  p-2'
              >
                {button.icon}
                <span className='mt-2'>{button.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Product1;
