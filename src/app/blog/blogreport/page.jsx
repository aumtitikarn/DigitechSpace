"use client";

import React, { useState } from "react";

function page() {

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleSubmit = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const handleSubmit1 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const handleSubmit2 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  return (
    <main className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4">
      <div className="flex flex-col md:flex-col w-full max-w-auto justify-center">
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold mt-5 mb-5" style={{fontSize:"36px"}}>รายงานบล็อก แนะนำ Study with me</h1>
        </div>
        <p className="mt-2 text-lg">
        โดย คุณสมใจ ใจดี
        </p>
        <div className="flex flex-col md:flex-coljustify-center w-full mt-6">
          <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>คำร้อง</h1>
          <p className="mt-2 text-lg">
          มีคำไม่สุภาพ หรือ คำหยาบคาย
          </p>

          <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>ข้อความเพิ่มเติม</h1>
          <p className="mt-2 text-lg">
          เป็นแบบอย่างที่ไม่ดี
          </p>

          <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>วันที่/เวลา</h1>
          <p className="mt-2 text-lg">
          10/12/2567 10:00:00
          </p>

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full p-2 text-white rounded mt-6"
              style={{backgroundColor:"#33539B"}}
            >
              ลบคำร้อง
            </button>
            <button
              onClick={handleSubmit1}
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#1976D2"}}
            >
              ติดต่อเจ้าของโครงงาน/บล็อก
            </button>
            <button
              onClick={handleSubmit2}
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#9B3933"}}
            >
              ลบโครงงาน/บล็อก
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default page;
