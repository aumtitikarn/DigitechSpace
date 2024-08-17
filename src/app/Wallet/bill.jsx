import React from "react";
import { Checkmark } from 'react-checkmark'

const Bill = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-[400px]">
        <div className="mb-5">
      <Checkmark />
      </div>
        <h2 className="text-xl font-bold mb-5 text-center">การถอนเงิน</h2>
        <div className="flex flex-col">
          <div className="flex justify-between odd:bg-[#D9D9D9] even:bg-[#FFF] p-2 ">
            <span className="font-semibold flex-1 text-center">ชื่อ-สกุล</span>
            <span className="flex-1 text-center">{data.name}</span>
          </div>
          <div className="flex justify-between border-t border-b border-gray-500 odd:bg-[#D9D9D9] even:bg-[#FFF] p-2">
            <span className="font-semibold flex-1 text-center">
              วันที่ทำรายการ
            </span>
            <span className="flex-1 text-center">{data.date}</span>
          </div>
          <div className="flex justify-between odd:bg-[#D9D9D9] even:bg-[#FFF] p-2">
            <span className="font-semibold flex-1 text-center">ถอนเงิน</span>
            <span className="flex-1 text-center">{data.amount}</span>
          </div>
          <div className="flex justify-between border-t border-b border-gray-500 odd:bg-[#D9D9D9] even:bg-[#FFF] p-2 ">
            <span className="font-semibold flex-1 text-center">
              ยอดเงินคงเหลือ
            </span>
            <span className="flex-1 text-center">{data.balance}</span>
          </div>
          <button
            type="submit"
            className="w-full mt-5 flex justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClose}
          >
            Success
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;