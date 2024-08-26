import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { MdGTranslate, MdAccountCircle } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaBoxOpen, FaStar } from "react-icons/fa";
import { BiSolidExit } from "react-icons/bi";
import { FaWallet, FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import i18n from "./../i18n";
import { useSession } from "next-auth/react";

function CustomNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountBoxVisible, setAccountBoxVisible] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountBox = () => {
    setAccountBoxVisible(!isAccountBoxVisible);
  };

  const accountBoxMarginTop =
    session?.user?.role === "StudentUser" ? "mt-[451px]" : "mt-[390px]";

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="bg-[#0B1E48] shadow-md p-5 relative z-50">
      <div className="flex items-center justify-between lg:mx-[50px]">
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
       {/* Account Button for Mobile */}
       <div className="relative flex-none flex items-center lg:hidden">
          {session ? (
            <>
              <button onClick={toggleAccountBox} className="text-white focus:outline-none">
                <MdAccountCircle className="text-white text-4xl mt-3" />
              </button>
              {isAccountBoxVisible && (
                <div className={`px-3 py-3 absolute right-0 ${accountBoxMarginTop} border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg z-2000`}>
                  {/* Account Box Content */}
                  <div className="">
                    <div className="flex items-center ">
                      <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                      <span>
                        <p className="text-[20px] mt-3 text-semibold">{session?.user?.name}</p>
                        <b>
                          <u className="text-[#0E6FFF]">
                            <Link href="/Profile">
                              <p className="text-[14px] ml-1 text-[#0E6FFF] ">{t("nav.viewprofile")}</p>
                            </Link>
                          </u>
                        </b>
                      </span>
                    </div>
                    <div className="text-left ml-5">
                      <ul className="list-none mt-3">
                        {session?.user?.role !== "NormalUser" && (
                          <>
                            <Link href="/Wallet">
                              <li className="flex items-center ">
                                <FaWallet className="mr-5 text-2xl text-gray-600" />
                                <span className="text-[18px]">{t("nav.wallet.title")}</span>
                              </li>
                            </Link>
                            <Link href="/Sell">
                              <li className="flex items-center mt-2">
                                <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                                <span className="text-[18px]">{t("nav.sell.title")}</span>
                              </li>
                            </Link>
                          </>
                        )}
                        <Link href="/favorite">
                          <li className="flex items-center mt-2">
                            <FaHeart className="mr-5 text-2xl text-gray-600" />
                            <span className="text-[18px]">{t("nav.favorite")}</span>
                          </li>
                        </Link>
                        <Link href="/notification">
                          <li className="flex items-center mt-2">
                            <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                            <span className="text-[18px]">{t("nav.notification")}</span>
                          </li>
                        </Link>
                        <Link href="/myproject">
                          <li className="flex items-center mt-2">
                            <FaBoxOpen className="mr-5 text-2xl text-gray-600 sm:mt-3" />
                            <span className="text-[18px]">{t("nav.myproject.title")}</span>
                          </li>
                        </Link>
                        <Link href="/review">
                          <li className="flex items-center mt-2 ">
                            <FaStar className="mr-5 text-2xl text-gray-600" />
                            <span className="text-[18px]">{t("nav.review.title")}</span>
                          </li>
                        </Link>
                      </ul>
                      <button onClick={() => signOut()} className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0 mt-3">
                        <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                        <span className="text-[18px] mt-2">{t("nav.logout")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>


        

        {/* โลโก้, เมนู, และปุ่มบัญชีสำหรับเดสทอป */}
        <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
          {/* โลโก้สำหรับเดสทอป */}
          <div className="flex-none">
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
          <div className="flex flex-1 items-center">
            <ul className="flex  items-center">
              <li>
                <Link href="/">
                  <p className="font-semibold text-[20px] text-white px-8">
                    {t("nav.home.title")}
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/project">
                  <p className="font-semibold text-[20px] text-white px-8">
                    {t("nav.project.title")}
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/listblog">
                  <p className="font-semibold text-[20px] text-white px-8">
                    {t("nav.blog.title")}
                  </p>
                </Link>
              </li>
            </ul>
          </div>

          {/* ปุ่มบัญชีสำหรับเดสทอป */}
          <div className="flex-none flex items-center">
            {session ? (
              <>
              {/* ปุ่มเปลี่ยนภาษา */}
              <div className="space-x-5">
              <button
                  onClick={toggleLanguage}
                  className="ml-8 text-white text-xl hover:text-blue-300 focus:outline-none"
                >
                  <MdGTranslate className="text-3xl" />
                </button>
                <button
                  onClick={toggleAccountBox}
                  className="text-white focus:outline-none"
                >
                  <MdAccountCircle className="text-white text-4xl" />
                </button>
                </div>
                {isAccountBoxVisible && (
                  <div
                    className={`absolute right-0 ${accountBoxMarginTop} border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg z-2000`}
                  >
                    {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
                    <div className="px-3 py-3">
                      <div className="flex items-center">
                        <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                        <span>
                          <p className="text-[20px] mt-3 text-semibold">
                            {session?.user?.name}
                          </p>
                          <b>
                            <u className="text-[#0E6FFF]">
                              <Link href="/Profile">
                                <p className="text-[14px] ml-1 text-[#0E6FFF] ">
                                  {t("nav.viewprofile")}
                                </p>
                              </Link>
                            </u>
                          </b>
                        </span>
                      </div>
                      <div className="text-left ml-5">
                        <ul className="list-none mt-3 ">
                          {session?.user?.role !== "NormalUser" && (
                            <>
                              <Link href="/Wallet">
                                <li className="flex items-center">
                                  <FaWallet className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.wallet.title")}
                                  </span>
                                </li>
                              </Link>
                              <Link href="/Sell">
                                <li className="flex items-center mt-2">
                                  <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.sell.title")}
                                  </span>
                                </li>
                              </Link>
                            </>
                          )}
                          <Link href="/favorite">
                            <li className="flex items-center mt-2">
                              <FaHeart className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.favorite")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/notification">
                            <li className="flex items-center mt-2">
                              <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.notification")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/myproject">
                            <li className="flex items-center mt-2">
                              <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.myproject.title")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/review">
                            <li className="flex items-center mt-2">
                              <FaStar className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.review.title")}
                              </span>
                            </li>
                          </Link>
                        </ul>
                        <div className="border-t border-gray-300 mt-3"></div>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0"
                        >
                          <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                          <span className="text-[18px] mt-2">
                            {t("nav.logout")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex space-x-8">
                {/* ปุ่มเปลี่ยนภาษา */}
                <button
                  onClick={toggleLanguage}
                  className="ml-8 text-white text-xl hover:text-blue-300 focus:outline-none"
                >
                  <MdGTranslate className="text-3xl" />
                </button>
                <Link href="/auth/signup">
                  <button className="text-white text-[18px] font-bold rounded-full border-[#FFFFFF] border-2 py-2 px-8">
                    {t("authen.signup.title")}
                  </button>
                </Link>
                <Link href="/auth/signin">
                  <button className="text-[#FFC92B] text-[18px] font-bold rounded-full border-[#FFC92B] border-2 py-2 px-8">
                    {t("authen.signin.title")}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* เมนูมือถือ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1E48] w-full h-screen z-50 fixed top-0 left-0 flex flex-col">
          <div className="flex justify-between items-center px-5 py-5">
            <Link href="/">
              <img
                src="https://m1r.ai/bdebq.png"
                alt="Digitech Space logo"
                width={100}
                height={100}
              />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-white text-2xl focus:outline-none"
            >
              <svg
                className="w-6 h-6"
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
          </div>
          {session ? (
            <>
          <ul className="flex-1 px-5 space-y-5 mt-10">
            <li className="border-t border-gray-300 pt-2">
              <Link href="/">
                <p className="font-semibold text-[20px] text-white">
                  {t("nav.home.title")}
                </p>
              </Link>
            </li>
            <li className="border-t border-gray-300 pt-2">
              <Link href="/project">
                <p className="font-semibold text-[20px] text-white">
                  {t("nav.project.title")}
                </p>
              </Link>
            </li>
            <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
              <Link href="/listblog" className="flex-1">
                <p className="font-semibold text-[20px] text-white">
                  {t("nav.blog.title")}
                </p>
              </Link>
            </li>
            <li className="flex justify-center border-t border-gray-300 pt-5 ">
              <MdGTranslate
                className="text-white text-4xl"
                onClick={toggleLanguage}
              />
            </li>
          </ul>
          </>
          ) : (
            <>
  <ul className="flex-1 px-5 space-y-5 mt-10">
    <li className="border-t border-gray-300 pt-2">
      <Link href="/">
        <p className="font-semibold text-[20px] text-white">
          {t("nav.home.title")}
        </p>
      </Link>
    </li>
    <li className="border-t border-gray-300 pt-2">
      <Link href="/project">
        <p className="font-semibold text-[20px] text-white">
          {t("nav.project.title")}
        </p>
      </Link>
    </li>
    <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
      <Link href="/listblog" className="flex-1">
        <p className="font-semibold text-[20px] text-white">
          {t("nav.blog.title")}
        </p>
      </Link>
    </li>
    <li className="flex justify-center border-t border-gray-300 pt-5">
      <MdGTranslate
        className="text-white text-4xl"
        onClick={toggleLanguage}
      />
    </li>
    <li className="flex flex-col items-center space-y-4">
      {/* auth Button */}
      <Link href="/auth/signin">
        <button className="text-[#FFC92B] text-[18px] font-bold rounded-full border-[#FFC92B] border-2 py-2 px-8">
          {t("authen.signin.title")}
        </button>
      </Link>
      <Link href="/auth/signup">
        <button className="text-white text-[18px] font-bold rounded-full border-[#FFFFFF] border-2 py-2 px-8">
          {t("authen.signup.title")}
        </button>
      </Link>
    </li>
  </ul>
</>


          )}
        </div>
      )}
    </nav>
  );
}

export default CustomNavbar;
