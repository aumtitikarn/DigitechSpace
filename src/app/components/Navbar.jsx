import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { MdGTranslate, MdAccountCircle } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaBoxOpen, FaStar } from "react-icons/fa";
import { BiSolidExit } from "react-icons/bi";
import { FaWallet, FaMoneyBillTrendUp } from "react-icons/fa6";

function CustomNavbar({ session }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountBoxVisible, setAccountBoxVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountBox = () => {
    setAccountBoxVisible(!isAccountBoxVisible);
  };

  const accountBoxMarginTop = session?.user?.role === "StudentUser" ? "mt-[451px]" : "mt-[390px]";

  return (
    <nav className="bg-[#0B1E48] shadow-md p-5 relative">
      <div className="flex items-center justify-between lg:mx-60">
        {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
        <div className="block lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6 mt-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        {/* โลโก้สำหรับมือถือ */}
        <div className="flex-1 flex justify-center lg:hidden">
          <Link href="/">
            <img
              src="https://m1r.ai/bdebq.png"
              alt="Digitech Space logo"
              width={100}
              height={100}
              className="ml-[19px]"
            />
          </Link>
        </div>
        {/* ปุ่มบัญชีสำหรับมือถือ */}
        <div className="relative flex-none flex items-center lg:hidden">
          <button
            onClick={toggleAccountBox}
            className="text-white focus:outline-none"
          >
            <MdAccountCircle className="text-white text-4xl mt-3" />
          </button>
          {isAccountBoxVisible && (
            <div className={`px-3 py-3 absolute right-0 ${accountBoxMarginTop} border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg`}>
              {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
              <div className="">
                <div className="flex items-center ">
                  <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                  <span>
                    <p className="text-[20px] mt-3 text-semibold">
                      {session?.user?.name}
                    </p>
                    <b>
                      <u className="text-[#0E6FFF]">
                        <p className="text-[14px] ml-1 text-[#0E6FFF] ">
                          View Profile
                        </p>
                      </u>
                    </b>
                  </span>
                </div>
                <div className="text-left ml-5">
                  <ul className="list-none mt-3 space-y-2">
                    {session?.user?.role !== "NormalUser" && (
                      <>
                        <li className="flex items-center">
                          <FaWallet className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Wallet</span>
                        </li>
                        <li className="flex items-center">
                          <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Sell</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-center">
                      <FaHeart className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">Favorite</span>
                    </li>
                    <li className="flex items-center">
                      <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">Notification</span>
                    </li>
                    <li className="flex items-center">
                      <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">My Project</span>
                    </li>
                    <li className="flex items-center">
                      <FaStar className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">Review</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0 mt-3"
                  >
                    <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                    <span className="text-[18px] mt-2">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* โลโก้, เมนู, และปุ่มบัญชีสำหรับเดสทอป */}
        <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
          {/* โลโก้สำหรับเดสทอป */}
          <div className="flex-none" style={{ marginRight: "50px" }}>
            <Link href="/">
              <img
                src="https://m1r.ai/bdebq.png"
                alt="Digitech Space logo"
                width={120}
                height={120}
              />
            </Link>
          </div>

          {/* เมนูเดสทอป */}
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link href="/home">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Home
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/project">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Project
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Blog
                  </p>
                </Link>
              </li>
            </ul>
          </div>

          {/* ปุ่มบัญชีและแปลภาษาสำหรับเดสทอป */}
          <div
            className="flex-none flex items-center"
            style={{ marginLeft: "50px" }}
          >
            <MdGTranslate className="text-white text-4xl" />
            <button className="relative" onClick={toggleAccountBox}>
              <MdAccountCircle className="text-white text-4xl ml-5" />
              {isAccountBoxVisible && (
                <div className="px-3 py-3 absolute right-0 mt-[35px] border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg">
                  {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
                  <div>
                    <div className="flex items-center">
                      <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                      <span>
                        <p className="text-[20px] mt-3 text-semibold">
                          {session?.user?.name}
                        </p>
                        <b>
                          <u className="text-[#0E6FFF]">
                            <p className="text-[14px] text-left text-[#0E6FFF]">
                              View Profile
                            </p>
                          </u>
                        </b>
                      </span>
                    </div>
                    <div className="text-left ml-5">
                      <ul className="list-none mt-3 space-y-2">
                        {session?.user?.role !== "NormalUser" && (
                          <>
                            <li className="flex items-center">
                              <FaWallet className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">Wallet</span>
                            </li>
                            <li className="flex items-center">
                              <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">Sell</span>
                            </li>
                          </>
                        )}
                        <li className="flex items-center">
                          <FaHeart className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Favorite</span>
                        </li>
                        <li className="flex items-center">
                          <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Notification</span>
                        </li>
                        <li className="flex items-center">
                          <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">My Project</span>
                        </li>
                        <li className="flex items-center">
                          <FaStar className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Review</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0 mt-3"
                      >
                        <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                        <span className="text-[18px] mt-2">Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* เมนูสำหรับมือถือ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0B1E48] bg-opacity-100 flex flex-col items-start justify-start p-10">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6 mb-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <Link href="/">
            <img
              src="https://m1r.ai/bdebq.png"
              alt="Digitech Space logo"
              width={120}
              height={120}
              className="mb-5"
            />
          </Link>
          <ul className="space-y-5">
            <li>
              <Link href="/home">
                <p className="font-semibold text-[20px] text-white">Home</p>
              </Link>
            </li>
            <li>
              <Link href="/project">
                <p className="font-semibold text-[20px] text-white">Project</p>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <p className="font-semibold text-[20px] text-white">Blog</p>
              </Link>
            </li>
          </ul>
          <MdGTranslate className="text-white text-4xl mt-5" />
        </div>
      )}
    </nav>
  );
}

export default CustomNavbar;
