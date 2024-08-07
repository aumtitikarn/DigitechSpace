'use client';
import React from 'react';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Service() {
    const [showtext, setShowtext] = useState(false);
    const [showtext1, setShowtext1] = useState(false);
    const [showtext2, setShowtext2] = useState(false);
    const [showtext3, setShowtext3] = useState(false);
  
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const handleClick = () => {
        setShowtext(prevShowMessage => !prevShowMessage);
    };

    const handleClick1 = () => {
        setShowtext1(prevShowMessage => !prevShowMessage);
    };

    const handleClick2 = () => {
        setShowtext2(prevShowMessage => !prevShowMessage);
    };

    const handleClick3 = () => {
        setShowtext3(prevShowMessage => !prevShowMessage);
    };

    const handleSubmit = () => {
        alert(`Input 1: ${input1}, Input 2: ${input2}`);
        setInput1('');
        setInput2('');
      };
  
    return (
      <main className='flex flex-row justify-center'>
        <div className='flex flex-col ml-20'>
          <div style={{ justifyContent: 'center', width: '800px' }} className='flex flex-col justify-center'>
            <h1 className='font-bold text-lg'>FAQ</h1>
          </div>
          <button onClick={handleClick} className='mt-4 bg-white-500 border border-gray-300 rounded flex flex-row justify-between'>
            <div className='justify-center m-4 flex flex-col' style={{width: "auto", height: "40px"}}>
            <h1>How can I contact the seller?</h1>
            </div>
            <div style={{backgroundColor:"#ffff", width: "auto", height: "40px",}} className='justify-center m-4 flex flex-col'>
            {showtext ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </button>
          {showtext && (
            <div className='mt-4 p-2 border border-gray-300 rounded' style={{ justifyContent: 'center', width: '800px' }}>
              This is just a dummy text that has been inserted as a placeholder for future content. While it may seem insignificant at first glance, the use of dummy text is a common practice in the design and publishing industry, as it allows designers and developers to visualize the layout and overall aesthetic of a project without being distracted by the actual content.
            </div>
          )}
          <button onClick={handleClick1} className='mt-4 bg-white-500 border border-gray-300 rounded flex flex-row justify-between'>
            <div className='justify-center m-4 flex flex-col' style={{width: "auto", height: "40px"}}>
            <h1>How can I contact the seller?</h1>
            </div>
            <div style={{backgroundColor:"#ffff", width: "auto", height: "40px",}} className='justify-center m-4 flex flex-col'>
            {showtext1 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </button>
          {showtext1 && (
            <div className='mt-4 p-2 border border-gray-300 rounded' style={{ justifyContent: 'center', width: '800px' }}>
              This is just a dummy text that has been inserted as a placeholder for future content. While it may seem insignificant at first glance, the use of dummy text is a common practice in the design and publishing industry, as it allows designers and developers to visualize the layout and overall aesthetic of a project without being distracted by the actual content.
            </div>
          )}
            <button onClick={handleClick2} className='mt-4 bg-white-500 border border-gray-300 rounded flex flex-row justify-between'>
            <div className='justify-center m-4 flex flex-col' style={{width: "auto", height: "40px"}}>
            <h1>How can I contact the seller?</h1>
            </div>
            <div style={{backgroundColor:"#ffff", width: "auto", height: "40px",}} className='justify-center m-4 flex flex-col'>
            {showtext2 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </button>
          {showtext2 && (
            <div className='mt-4 p-2 border border-gray-300 rounded' style={{ justifyContent: 'center', width: '800px' }}>
              This is just a dummy text that has been inserted as a placeholder for future content. While it may seem insignificant at first glance, the use of dummy text is a common practice in the design and publishing industry, as it allows designers and developers to visualize the layout and overall aesthetic of a project without being distracted by the actual content.
            </div>
          )}
            <button onClick={handleClick3} className='mt-4 bg-white-500 border border-gray-300 rounded flex flex-row justify-between'>
            <div className='justify-center m-4 flex flex-col' style={{width: "auto", height: "40px"}}>
            <h1>How can I contact the seller?</h1>
            </div>
            <div style={{backgroundColor:"#ffff", width: "auto", height: "40px",}} className='justify-center m-4 flex flex-col'>
            {showtext3 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </button>
          {showtext3 && (
            <div className='mt-4 p-2 border border-gray-300 rounded' style={{ justifyContent: 'center', width: '800px' }}>
              This is just a dummy text that has been inserted as a placeholder for future content. While it may seem insignificant at first glance, the use of dummy text is a common practice in the design and publishing industry, as it allows designers and developers to visualize the layout and overall aesthetic of a project without being distracted by the actual content.
            </div>
          )}

        <div style={{ justifyContent: 'center', width: '800px' }} className='flex flex-col justify-center mt-6'>
            <h1 className='font-bold text-lg'>Service</h1>
            <p className='text-l mt-2'>Please contact us. If you have any problems using this website.</p>

            <div className='mt-4'>
            <input 
              type='text' 
              value={input1} 
              onChange={(e) => setInput1(e.target.value)} 
              placeholder='Problem' 
              className='p-2 border border-gray-300 rounded mb-2 w-full'
            />
            <input 
              type='text' 
              value={input2} 
              onChange={(e) => setInput2(e.target.value)} 
              placeholder='Email' 
              className='p-2 border border-gray-300 rounded mb-2 w-full'
            />
            <button 
              onClick={handleSubmit} 
              className='p-2 bg-blue-500 text-white rounded w-full'
            >
              Send Messages
            </button>
          </div>
        </div>
        </div>
      </main>
    );
  }
  
  export default Service;
