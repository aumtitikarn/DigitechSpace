"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


function Service() {
  const [showtext, setShowtext] = useState(false);
  const [showtext1, setShowtext1] = useState(false);
  const [showtext2, setShowtext2] = useState(false);
  const [showtext3, setShowtext3] = useState(false);

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleClick = () => {
    setShowtext((prevShowMessage) => !prevShowMessage);
  };

  const handleClick1 = () => {
    setShowtext1((prevShowMessage) => !prevShowMessage);
  };

  const handleClick2 = () => {
    setShowtext2((prevShowMessage) => !prevShowMessage);
  };

  const handleClick3 = () => {
    setShowtext3((prevShowMessage) => !prevShowMessage);
  };

  const handleSubmit = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  return (
    <main className="flex flex-col md:flex-row w-full justify-center p-4">
      <div className="flex flex-col w-full max-w-auto">
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold" style={{fontSize:"24px"}}>FAQ</h1>
        </div>

        <button
          onClick={handleClick}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="flex flex-col justify-center w-auto h-10">
            {"How can I contact the seller?"}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            This is just a dummy text that has been inserted as a placeholder
            for future content. While it may seem insignificant at first glance,
            the use of dummy text is a common practice in the design and
            publishing industry, as it allows designers and developers to
            visualize the layout and overall aesthetic of a project without
            being distracted by the actual content.
          </div>
        )}

        <button
          onClick={handleClick1}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="flex flex-col justify-center w-auto h-10">
            {"How can I contact the seller?"}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext1 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext1 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            This is just a dummy text that has been inserted as a placeholder
            for future content. While it may seem insignificant at first glance,
            the use of dummy text is a common practice in the design and
            publishing industry, as it allows designers and developers to
            visualize the layout and overall aesthetic of a project without
            being distracted by the actual content.
          </div>
        )}

        <button
          onClick={handleClick2}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="flex flex-col justify-center w-auto h-10">
            {"How can I contact the seller?"}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext2 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext2 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            This is just a dummy text that has been inserted as a placeholder
            for future content. While it may seem insignificant at first glance,
            the use of dummy text is a common practice in the design and
            publishing industry, as it allows designers and developers to
            visualize the layout and overall aesthetic of a project without
            being distracted by the actual content.
          </div>
        )}

        <button
          onClick={handleClick3}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="flex flex-col justify-center w-auto h-10">
            {"How can I contact the seller?"}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext3 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext3 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            This is just a dummy text that has been inserted as a placeholder
            for future content. While it may seem insignificant at first glance,
            the use of dummy text is a common practice in the design and
            publishing industry, as it allows designers and developers to
            visualize the layout and overall aesthetic of a project without
            being distracted by the actual content.
          </div>
        )}

        <div className="flex flex-col justify-center w-full mt-6">
          <h1 className="text-lg font-bold" style={{fontSize:"24px"}}>Service</h1>
          <p className="mt-2 text-lg">
            Please contact us. If you have any problems using this website.
          </p>

          <div className="mt-4">
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Enter first message"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="Enter second message"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSubmit}
              className="w-full p-2 text-white rounded"
              style={{backgroundColor:"#0B1E48"}}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Service;
