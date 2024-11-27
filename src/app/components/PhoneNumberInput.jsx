// src/app/components/PhoneNumberInput.jsx

"use client";

import React from 'react';
import { FaPhone } from 'react-icons/fa';

const PhoneNumberInput = ({ value, onChange, placeholder }) => {
  const formatPhoneNumber = (value) => {
    const number = value.replace(/[^\d]/g, '');
    
    if (!number) return '';
    
    if (number.length <= 2) {
      return number;
    } else if (number.length <= 6) {
      return `${number.slice(0, 2)}-${number.slice(2)}`;
    } else {
      return `${number.slice(0, 2)}-${number.slice(2, 6)}-${number.slice(6, 10)}`;
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formattedNumber = formatPhoneNumber(input);
    
    if (formattedNumber.replace(/-/g, '').length <= 10) {
      onChange(formattedNumber);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formattedNumber = formatPhoneNumber(pastedText);
    
    if (formattedNumber.replace(/-/g, '').length <= 10) {
      onChange(formattedNumber);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaPhone className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
        maxLength={12}
      />
    </div>
  );
};

const usePhoneInput = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  
  const getRawPhoneNumber = () => phoneNumber.replace(/-/g, '');
  
  return {
    phoneNumber,
    setPhoneNumber,
    getRawPhoneNumber,
  };
};

export { PhoneNumberInput, usePhoneInput };