import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const SkillSearchAutocomplete = ({ 
  skills, 
  selectedSkills, 
  onSkillSelect, 
  onSkillRemove, 
  placeholder,
  onSearchChange 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = skills.filter(skill => 
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedSkills.includes(skill)
      );
      setFilteredSkills(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSkills([]);
      setShowDropdown(false);
    }
  }, [inputValue, skills, selectedSkills]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  const handleSkillSelect = (skill) => {
    onSkillSelect(skill);
    setInputValue('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue && filteredSkills.length > 0) {
      handleSkillSelect(filteredSkills[0]);
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-[300px]"> {/* กำหนดความกว้างตายตัว */}
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSkills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full"
          >
            {skill}
            <button
              onClick={() => onSkillRemove(skill)}
              className="hover:text-blue-200"
            >
              <IoClose />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      {showDropdown && filteredSkills.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredSkills.map((skill, index) => (
            <button
              key={index}
              onClick={() => handleSkillSelect(skill)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillSearchAutocomplete;