"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from "react-icons/fa";

const BlogSearchAutocomplete = ({ 
  posts, 
  onSearch, 
  placeholder,
  isSearching 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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

  const getSuggestions = (value) => {
    const inputValue = value.toLowerCase();
    if (!inputValue) return [];

    const suggested = posts.filter(post => {
      const topic = post.topic?.toLowerCase() || "";
      const course = post.course?.toLowerCase() || "";
      const category = post.selectedCategory?.toLowerCase() || "";
      const description = post.description?.toLowerCase() || "";
      const author = post.author?.toLowerCase() || "";

      return (
        topic.includes(inputValue) ||
        course.includes(inputValue) ||
        category.includes(inputValue) ||
        description.includes(inputValue) ||
        author.includes(inputValue)
      );
    });

    // Get unique topics from suggestions
    const uniqueTopics = [...new Set(suggested.map(post => post.topic))];
    return uniqueTopics.slice(0, 5); // limit to 5 suggestions
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      const newSuggestions = getSuggestions(value);
      setSuggestions(newSuggestions);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      onSearch('');  // Reset search when input is empty
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowDropdown(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
      setShowDropdown(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isSearching}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              <div className="flex items-center">
                <FaSearch className="mr-2 text-gray-400" size={12} />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSearchAutocomplete;