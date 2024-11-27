"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaUniversity } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

// Bank data with translations
const banks = [
  { th: "ธนาคารกรุงเทพ", en: "Bangkok Bank" },
  { th: "ธนาคารกสิกรไทย", en: "Kasikorn Bank" },
  { th: "ธนาคารกรุงไทย", en: "Krungthai Bank" },
  { th: "ธนาคารทหารไทย", en: "TMB Bank" },
  { th: "ธนาคารไทยพาณิชย์", en: "Siam Commercial Bank" },
  { th: "ธนาคารกรุงศรีอยุธยา", en: "Bank of Ayudhya" },
  { th: "ธนาคารเกียรตินาคิน", en: "Kiatnakin Bank" },
  { th: "ธนาคารซีไอเอ็มบีไทย", en: "CIMB Thai Bank" },
  { th: "ธนาคารทิสโก้", en: "TISCO Bank" },
  { th: "ธนาคารธนชาต", en: "Thanachart Bank" },
  { th: "ธนาคารยูโอบี", en: "UOB Bank" },
  { th: "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)", en: "Standard Chartered Bank (Thai)" },
  { th: "ธนาคารไทยเครดิตเพื่อรายย่อย", en: "Thai Credit Retail Bank" },
  { th: "ธนาคารแลนด์ แอนด์ เฮาส์", en: "Land and Houses Bank" },
  { th: "ธนาคารไอซีบีซี (ไทย)", en: "ICBC (Thai)" },
  { th: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย", en: "SME Development Bank of Thailand" },
  { th: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร", en: "Bank for Agriculture and Agricultural Cooperatives" },
  { th: "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย", en: "Export-Import Bank of Thailand" },
  { th: "ธนาคารออมสิน", en: "Government Savings Bank" },
  { th: "ธนาคารอาคารสงเคราะห์", en: "Government Housing Bank" },
  { th: "ธนาคารอิสลามแห่งประเทศไทย", en: "Islamic Bank of Thailand" },
  { th: "ธนาคารแห่งประเทศจีน", en: "Bank of China" },
  { th: "ธนาคารซูมิโตโม มิตซุย ทรัสต์ (ไทย)", en: "Sumitomo Mitsui Trust Bank (Thai)" },
  { th: "ธนาคารฮ่องกงและเซี้ยงไฮ้แบงกิ้งคอร์ปอเรชั่น", en: "HSBC Bank" }
];

const BankInput = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { i18n } = useTranslation();
  const language = i18n.language === 'th' ? 'th' : 'en';

  const filteredBanks = banks.filter(bank => {
    const searchLower = searchTerm.toLowerCase();
    return bank[language].toLowerCase().includes(searchLower) ||
           bank[language === 'th' ? 'en' : 'th'].toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectBank = (bank) => {
    onChange(bank[language]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredBanks.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      if (filteredBanks[highlightedIndex]) {
        handleSelectBank(filteredBanks[highlightedIndex]);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaUniversity className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <IoIosArrowDown
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-200">
          {filteredBanks.map((bank, index) => (
            <div
              key={bank.en}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === index ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectBank(bank)}
            >
              <div className="font-medium text-gray-700">
                {bank[language]}
              </div>
              <div className="text-sm text-gray-500">
                {bank[language === 'th' ? 'en' : 'th']}
              </div>
            </div>
          ))}
          {filteredBanks.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

// Example usage in the form:
const BankFormField = () => {
  const [bankName, setBankName] = useState('');
  const { t } = useTranslation();
  
  return (
    <BankInput
      value={bankName}
      onChange={setBankName}
      placeholder={t("nav.sell.sellinfo.namebank")}
    />
  );
};

export default BankFormField;