import React, { useEffect, useState } from "react";
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
import Image from "next/image";

function CustomNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountBoxVisible, setAccountBoxVisible] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const { data: session } = useSession();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountBox = () => {
    setAccountBoxVisible(!isAccountBoxVisible);
  };

  // const accountBoxMarginTop =
  //   session?.user?.role === "StudentUser" ? "mt-[451px]" : "mt-[390px]";

  
  useEffect(() => {
    if (session?.user?.imageUrl) {
      setProfileImage(session.user.imageUrl); // Set the initial image from session data
    }
  }, [session]);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const getPostById = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const post = data.post;
      setPostData(post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById();
  }, []);

  const getPostByIdS = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const posts = data.posts;
      setPostDataS(posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostByIdS();
  }, []);
  const getImageSource = () => {
    const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;
  
    
    const isValidHttpUrl = (string) => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      const imageUrl = postData.imageUrl[0];
      if (isValidHttpUrl(imageUrl)) {
        return useProxy(imageUrl);
      } else {
        return `/api/editprofile/images/${imageUrl}`;
      }
    }
    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return useProxy(session.user.image);
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <nav className="bg-[#0B1E48] shadow-md p-5 relative z-50 sticky top-0">
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
              src="https://m1r.ai/W8p5i.png"
              alt="Digitech Space logo"
              width={100}
              height={100}
              className="ml-[19px]"
            />
          </Link>
        </div>
        {/* Account Button for Mobile */}
        <div className="flex items-center lg:hidden">
          {session ? (
            <>
              <button
                onClick={toggleAccountBox}
                className="text-white focus:outline-none"
              >
                {imageSource ? (
                  <Image
                    width={35}
                    height={35}
                    src={imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <MdAccountCircle
                    className="rounded-full "
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  />
                )}
              </button>
              {isAccountBoxVisible && (
                <div className="">
                  <div className="p-4 absolute right-0 top-full mr-5 border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] shadow-lg z-50">
                    {/* Account Box Content */}
                    <div className="">
                      <div className="flex items-center ">
                        {imageSource ? (
                          <Image
                            width={55}
                            height={55}
                            src={imageSource}
                            alt="Profile Image"
                            unoptimized={true}
                            onError={(e) => {
                              e.target.onerror = null;
                            }}
                            style={{
                              objectFit: "cover",
                              borderRadius: "50%",
                              margin: "10px"
        
                            }}
                          />
                        ) : (
                          <MdAccountCircle
                            className="rounded-full text-gray-600"
                            style={{
                              width: "55px",
                              height: "55px",
                            }}
                          />
                        )}

                        <span>
                          <p className="text-[20px] mt-3 text-semibold">
                            {session?.user?.name || "Unknown"}
                          </p>
                          <b>
                            <u className="text-[#0E6FFF]">
                            {session?.user?.role !== "NormalUser" && (
                              <Link href="/Profile">
                                <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ">
                                  {t("nav.viewprofile")}
                                </p>
                              </Link>
                              )}
                              {session?.user?.role == "NormalUser" && (
                              <Link href={`/Profile/EditProfile/${session?.user?.id}`}>
                                <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300">
                                  {t("nav.viewprofile")}
                                </p>
                              </Link>
                              )}
                            </u>
                          </b>
                        </span>
                      </div>
                      <div className="text-left ml-5">
                        <ul className="list-none mt-3">
                          {session?.user?.role !== "NormalUser" && (
                            <>
                              <Link href="/Wallet">
                                <li className="flex items-center hover:text-gray-300">
                                  <FaWallet className="mr-5 text-2xl text-gray-600 " />
                                  <span className="text-[18px]">
                                    {t("nav.wallet.title")}
                                  </span>
                                </li>
                              </Link>
                              <Link href="/Sell">
                                <li className="flex items-center mt-2 hover:text-gray-300">
                                  <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.sell.title")}
                                  </span>
                                </li>
                              </Link>
                            </>
                          )}
                          <Link href="/favorite">
                            <li className="flex items-center mt-2 hover:text-gray-300">
                              <FaHeart className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.favorite")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/notification">
                            <li className="flex items-center mt-2 hover:text-gray-300">
                              <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.notification")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/myproject">
                            <li className="flex items-center mt-2 hover:text-gray-300">
                              <FaBoxOpen className="mr-5 text-2xl text-gray-600 sm:mt-3" />
                              <span className="text-[18px]">
                                {t("nav.myproject.title")}
                              </span>
                            </li>
                          </Link>
                          <Link href="/review">
                            <li className="flex items-center mt-2 hover:text-gray-300">
                              <FaStar className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">
                                {t("nav.review.title")}
                              </span>
                            </li>
                          </Link>
                        </ul>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0 mt-3"
                        >
                          <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                          <span className="text-[18px] mt-2 hover:text-gray-300">
                            {t("nav.logout")}
                          </span>
                        </button>
                      </div>
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
        {session ? (
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-8 mx-[180px]">
            {/* โลโก้สำหรับเดสทอป */}
            <div className="flex-none">
              <Link href="/">
                <img
                  src="https://m1r.ai/W8p5i.png"
                  alt="Digitech Space logo"
                  width={120}
                  height={120}
                />
              </Link>
            </div>

            {/* เมนูเดสทอป */}
            {session ? (
              <div className="flex flex-1 items-center justify-center">
                <ul className="flex  items-center">
                  <li>
                    <Link href="/">
                      <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/project">
                      <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/listblog">
                      <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                        {t("nav.blog.title")}
                      </p>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <div className="flex flex-1 items-center">
                  <ul className="flex  items-center">
                    <li>
                      <Link href="/">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.home.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/project">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.project.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/listblog">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.blog.title")}
                        </p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ปุ่มบัญชีสำหรับเดสทอป ของจริง */}
            <div className="flex-none flex items-center relative">
              {session ? (
                <>
                  {/* ปุ่มเปลี่ยนภาษา */}
                  <div className="space-x-5">
                    <button
                      onClick={toggleLanguage}
                      className=" text-white text-xl hover:text-[#FFC92B] focus:outline-none"
                    >
                      <MdGTranslate
                        style={{
                          width: "35px",
                          height: "35px",
                        }}
                      />
                    </button>

                    <button
                      onClick={toggleAccountBox}
                      className="text-white focus:outline-none"
                    >
                      {imageSource ? (
                        <Image
                          width={35}
                          height={35}
                          src={imageSource}
                          alt="Profile Image"
                          unoptimized={true}
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                          style={{
                            objectFit: "cover",
                            borderRadius: "50%",
                  
                          }}
                        />
                      ) : (
                        <MdAccountCircle
                          className="rounded-full "
                          style={{
                            width: "35px",
                            height: "35px",
                          }}
                        />
                      )}
                    </button>
                  </div>
                  {isAccountBoxVisible && (
                    <div
                      className={
                        "p-4 absolute right-0 top-full mt-7  border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] shadow-lg z-50"
                      }
                    >
                      <div className="">
                        <div className="flex items-center">
                          {imageSource ? (
                            <Image
                              width={55}
                              height={55}
                              src={imageSource}
                              alt="Profile Image"
                              unoptimized={true}
                              onError={(e) => {
                                e.target.onerror = null;
                              }}
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                                margin: "10px"
                              }}
                            />
                          ) : (
                            <MdAccountCircle
                              className="rounded-full text-gray-600"
                              style={{
                                width: "55px",
                                height: "55px",
                              }}
                            />
                          )}
                          <span>
                            <p className="text-[20px] mt-3 text-semibold">
                              {session?.user?.name || "Unknown"}
                            </p>
                            <b>
                              <u className="text-[#0E6FFF]">
                              {session?.user?.role !== "NormalUser" && (
                              <Link href="/Profile">
                                <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300">
                                  {t("nav.viewprofile")}
                                </p>
                              </Link>
                              )}
                              {session?.user?.role == "NormalUser" && (
                              <Link href={`/Profile/EditProfile/${session?.user?.id}`}>
                                <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300">
                                  {t("nav.viewprofile")}
                                </p>
                              </Link>
                              )}
                              </u>
                            </b>
                          </span>
                        </div>

                        <div className="text-left ml-5">
                          <ul className="list-none mt-3 ">
                            {session?.user?.role !== "NormalUser" && (
                              <>
                                <Link href="/Wallet">
                                  <li className="flex items-center hover:text-gray-300">
                                    <FaWallet className="mr-5 text-2xl text-gray-600 " />
                                    <span className="text-[18px]">
                                      {t("nav.wallet.title")}
                                    </span>
                                  </li>
                                </Link>
                                <Link href="/Sell">
                                  <li className="flex items-center mt-2 hover:text-gray-300">
                                    <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                                    <span className="text-[18px]">
                                      {t("nav.sell.title")}
                                    </span>
                                  </li>
                                </Link>
                              </>
                            )}
                            <Link href="/favorite">
                              <li className="flex items-center mt-2 hover:text-gray-300">
                                <FaHeart className="mr-5 text-2xl text-gray-600" />
                                <span className="text-[18px]">
                                  {t("nav.favorite")}
                                </span>
                              </li>
                            </Link>
                            <Link href="/notification">
                              <li className="flex items-center mt-2 hover:text-gray-300">
                                <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                                <span className="text-[18px]">
                                  {t("nav.notification")}
                                </span>
                              </li>
                            </Link>
                            <Link href="/myproject">
                              <li className="flex items-center mt-2 hover:text-gray-300">
                                <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                                <span className="text-[18px]">
                                  {t("nav.myproject.title")}
                                </span>
                              </li>
                            </Link>
                            <Link href="/review">
                              <li className="flex items-center mt-2 hover:text-gray-300">
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
                            <span className="text-[18px] mt-2 hover:text-gray-300">
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
                    <button className="text-white text-[18px] font-bold rounded-full border-[#FFFFFF] border-2 py-2 px-8 hover:bg-[#FFFFFF] hover:text-black">
                      {t("authen.signup.title")}
                    </button>
                  </Link>
                  <Link href="/auth/signin">
                    <button className="text-[#FFC92B] text-[18px] font-bold rounded-full border-[#FFC92B] border-2 py-2 px-8 hover:bg-[#FFC92B] hover:text-white">
                      {t("authen.signin.title")}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="hidden lg:flex flex-1 items-center justify-center space-x-10">
              {/* โลโก้สำหรับเดสทอป */}
              <div className="flex-none">
                <Link href="/">
                  <img
                    src="https://m1r.ai/W8p5i.png"
                    alt="Digitech Space logo"
                    width={120}
                    height={120}
                  />
                </Link>
              </div>

              {/* เมนูเดสทอป */}
              {session ? (
                <div className="flex flex-1 items-center justify-center">
                  <ul className="flex  items-center">
                    <li>
                      <Link href="/">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.home.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/project">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.project.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/listblog">
                        <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                          {t("nav.blog.title")}
                        </p>
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <div className="flex flex-1 items-center">
                    <ul className="flex  items-center">
                      <li>
                        <Link href="/">
                          <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                            {t("nav.home.title")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/project">
                          <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                            {t("nav.project.title")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/listblog">
                          <p className="font-semibold text-[20px] text-white px-8 hover:text-[#FFC92B]">
                            {t("nav.blog.title")}
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* ปุ่มบัญชีสำหรับเดสทอป */}
              <div className=" flex items-center">
                {session ? (
                  <>
                    {/* ปุ่มเปลี่ยนภาษา */}
                    <div className="space-x-5">
                      <button
                        onClick={toggleLanguage}
                        className="ml-8 text-white text-xl hover:text-[#FFC92B] focus:outline-none"
                      >
                        <MdGTranslate className="text-3xl" />
                      </button>
                      <button
                        onClick={toggleAccountBox}
                        className="text-white focus:outline-none "
                      ></button>
                    </div>
                    {isAccountBoxVisible && (
                      <div
                        className={`absolute right-0 top-[100px] border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg z-2000`}
                      >
                        {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
                        <div className="px-3 py-3">
                          <div className="flex items-center">
                            {imageSource ? (
                              <Image
                                width={60}
                                height={60}
                                src={imageSource}
                                alt="Profile Image"
                                unoptimized={true}
                                onError={(e) => {
                                  e.target.onerror = null;
                                }}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "50%",
                      
                                }}
                              />
                            ) : (
                              <MdAccountCircle
                                className="rounded-full "
                                style={{
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            )}
                            <span>
                              <p className="text-[20px] mt-3 text-semibold">
                              {session?.user?.name || "Unknown"}
                              </p>
                              <b>
                                <u className="text-[#0E6FFF]">
                                  <Link href="/Profile">
                                    <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300">
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
                                    <li className="flex items-center hover:text-gray-300">
                                      <FaWallet className="mr-5 text-2xl text-gray-600" />
                                      <span className="text-[18px]">
                                        {t("nav.wallet.title")}
                                      </span>
                                    </li>
                                  </Link>
                                  <Link href="/Sell">
                                    <li className="flex items-center mt-2 hover:text-gray-300">
                                      <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                                      <span className="text-[18px]">
                                        {t("nav.sell.title")}
                                      </span>
                                    </li>
                                  </Link>
                                </>
                              )}
                              <Link href="/favorite">
                                <li className="flex items-center mt-2 hover:text-gray-300">
                                  <FaHeart className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.favorite")}
                                  </span>
                                </li>
                              </Link>
                              <Link href="/notification">
                                <li className="flex items-center mt-2 hover:text-gray-300">
                                  <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.notification")}
                                  </span>
                                </li>
                              </Link>
                              <Link href="/myproject">
                                <li className="flex items-center mt-2 hover:text-gray-300">
                                  <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                                  <span className="text-[18px]">
                                    {t("nav.myproject.title")}
                                  </span>
                                </li>
                              </Link>
                              <Link href="/review">
                                <li className="flex items-center mt-2 hover:text-gray-300">
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
                              <span className="text-[18px] mt-2 hover:text-gray-300">
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
                      className="ml-8 text-white text-xl hover:text-[#FFC92B] focus:outline-none"
                    >
                      <MdGTranslate className="text-3xl" />
                    </button>
                    <Link href="/auth/signup">
                      <button className="text-white text-[18px] font-bold rounded-full border-[#FFFFFF] border-2 py-2 px-8 hover:bg-[#FFFFFF] hover:text-black">
                        {t("authen.signup.title")}
                      </button>
                    </Link>
                    <Link href="/auth/signin">
                      <button className="text-[#FFC92B] text-[18px] font-bold rounded-full border-[#FFC92B] border-2 py-2 px-8 hover:bg-[#FFC92B] hover:text-white">
                        {t("authen.signin.title")}
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* เมนูมือถือ */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1E48] w-full h-screen z-50 fixed top-0 left-0 flex flex-col">
            <div className="flex justify-between items-center px-5 py-5">
              <Link href="/">
                <img
                  src="https://m1r.ai/W8p5i.png"
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
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2">
                    <Link href="/project">
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
                    <Link href="/listblog" className="flex-1">
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.blog.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="flex justify-center border-t border-gray-300 pt-5 ">
                    <MdGTranslate
                      className="text-white text-4xl hover:text-[#FFC92B]"
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
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2">
                    <Link href="/project">
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
                    <Link href="/listblog" className="flex-1">
                      <p className="font-semibold text-[20px] text-white hover:text-[#FFC92B]">
                        {t("nav.blog.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="flex justify-center border-t border-gray-300 pt-5">
                    <MdGTranslate
                      className="text-white text-4xl hover:text-[#FFC92B]"
                      onClick={toggleLanguage}
                    />
                  </li>
                  <li className="flex flex-col items-center space-y-4">
                    {/* auth Button */}
                    <Link href="/auth/signin">
                      <button className="text-[#FFC92B] text-[18px] font-bold rounded-full border-[#FFC92B] border-2 py-2 px-8 hover:bg-[#FFC92B] hover:text-white">
                        {t("authen.signin.title")}
                      </button>
                    </Link>
                    <Link href="/auth/signup">
                      <button className="text-white text-[18px] font-bold rounded-full border-[#FFFFFF] border-2 py-2 px-8 hover:bg-[#FFFFFF] hover:text-black">
                        {t("authen.signup.title")}
                      </button>
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        )}
      </div>{" "}
    </nav>
  );
}

export default CustomNavbar;