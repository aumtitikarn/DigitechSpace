import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-[#0B1E48] shadow-md p-5 text-white">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
        <div className="text-left">
          <p className="font-semibold text-[20px]">Contact</p>
          <ul className="list-none mt-3 space-y-2">
            <li className="flex items-center">
              <FaFacebook className="mr-2" />{" "}
              <span className="text-[16px]"> : DigitechSpace</span>
            </li>
            <li className="flex items-center">
              <FaLine className="mr-2" />{" "}
              <span className="text-[16px]"> : @DigitechSpace</span>
            </li>
            <li className="flex items-center">
              <MdEmail className="mr-2" />{" "}
              <a
                href="mailto:DigitechSpace@gmail.com"
                className="text-[16px] text-white"
              >
                : DigitechSpace@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-auto border-t border-gray-300 mt-5 lg:mt-0 lg:border-t-0"></div>
      </div>
      <div className="sm:border-t border-gray-300 mt-2 pt-2 text-center lg:mt-5 lg:pt-5">
        <p>© 2024 DigitechSpace</p>
      </div>
    </footer>
  );
}

export default Footer;
