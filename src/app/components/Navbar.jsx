import React, { useEffect, useState, useCallback } from "react";
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
import { usePathname } from "next/navigation";
import NotificationIcon from './NotificationIcon'; 

function CustomNavbar({ notificationCount = 0 }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountBoxVisible, setAccountBoxVisible] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const { data: session } = useSession();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountBox = () => {
    setAccountBoxVisible(!isAccountBoxVisible);
  };

  // const accountBoxMarginTop =
  //   session?.user?.role === "StudentUser" ? "mt-[451px]" : "mt-[390px]";

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/editprofile/${session.user.id}`, {
            method: "GET",
            cache: "no-store",
          });

          if (!res.ok) throw new Error("Failed to fetch data");

          const data = await res.json();
          setPostData(data.post);
          setPostDataS(data.posts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    if (session?.user?.imageUrl) {
      setProfileImage(session.user.imageUrl); // Set the initial image from session data
    }
  }, [session]);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const getPostById = useCallback(async () => {
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
  }, [session?.user?.id]); // Add dependency

  const getPostByIdS = useCallback(async () => {
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
  }, [session?.user?.id]); // Add dependency

  useEffect(() => {
    getPostById();
  }, [getPostById]); // Add dependency

  useEffect(() => {
    getPostByIdS();
  }, [getPostByIdS]);

  const getImageSource = () => {
    // Changed from useProxy to createProxyUrl to avoid Hook naming convention
    const createProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

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
        return createProxyUrl(imageUrl);
      } else {
        return `/api/editprofile/images/${imageUrl}`;
      }
    }

    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }

    if (session?.user?.image) {
      return createProxyUrl(session.user.image);
    }

    return null;
  };

  const imageSource = getImageSource();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // ปรับตัวเลขตามความเหมาะสม
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLogo = () => {
    if (isHomePage) {
      return isScrolled
        ? "https://m1r.ai/W8p5i.png"
        : "https://m1r.ai/W8p5i.png";
    }
    return "https://m1r.ai/W8p5i.png";
  };
  const commonStyles = {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyles = {
    fontSize: "35px",
  };
  return (
    <nav
      className={`
    ${
      isHomePage
        ? `fixed top-0 w-full z-50 transition-all duration-300 p-5
         ${
           isScrolled
             ? "bg-[#0B1E48]"
             : "bg-gradient-to-b from-black/65 to-transparent backdrop-blur-[1px]"
         }`
        : "bg-[#0B1E48] shadow-md p-5 relative z-50 sticky top-0"
    }
  `}
    >
      <div className="flex items-center justify-between lg:mx-20">
        {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
        <div className="block lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`
              ml-2 text-xl focus:outline-none transition-colors duration-300
              ${
                isHomePage
                  ? isScrolled
                    ? "text-white hover:text-[#b2b0d4]"
                    : "text-white hover:text-[#b2b0d4]"
                  : "text-white hover:text-[#b2b0d4]"
              }
              text-4xl
            `}
          >
            <svg
              className="w-6 h-6 mt-5 "
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
            <Image
              src={getLogo()}
              alt="Digitech Space logo"
              width={100}
              height={100}
              className="ml-[19px]"
              priority
              unoptimized
            />
          </Link>
        </div>
        {/* Account Button for Mobile */}
        <div className="flex-none flex items-center relative lg:hidden">
          {session ? (
            <>
            <div className="mr-5">
             <Link href="/notification">
                     
                      <NotificationIcon notificationCount={notificationCount} />
                    </Link>
                    </div>
              <button
                onClick={toggleAccountBox}
                className="text-white focus:outline-none"
              >
                {imageSource && !failedImages.has(imageSource._id) ? (
                  <div className="relative bg-white rounded-full p-1 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                    <Image
                      width={35}
                      height={35}
                      src={imageSource}
                      alt="Profile Image"
                      unoptimized={true}
                      onError={() => {
                        setFailedImages(
                          (prev) => new Set([...prev, imageSource._id])
                        );
                      }}
                      className="rounded-full w-[35px] h-[35px] object-cover  "
                    />
                  </div>
                ) : (
                  <MdAccountCircle
                    className={`
                     text-xl focus:outline-none transition-colors duration-300
                    ${
                      isHomePage
                        ? isScrolled
                          ? "text-white hover:text-[#5f66de]"
                          : "text-white hover:text-gray-600"
                        : "text-white hover:text-[#5f66de]"
                    }
                    w-[35px] h-[35px]
                  `}
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  />
                )}
              </button>
              {isAccountBoxVisible && (
                <div className="">
                  <div className="p-4 absolute right-0 top-full mt-7  border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] shadow-lg z-50">
                    {/* Account Box Content */}
                    <div className="">
                      <div className="flex items-center ">
                        {imageSource && !failedImages.has(imageSource._id) ? (
                          <div className="relative bg-white rounded-full p-1 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                            <Image
                              width={55}
                              height={55}
                              src={imageSource}
                              alt="Profile Image"
                              unoptimized={true}
                              onError={() => {
                                setFailedImages(
                                  (prev) => new Set([...prev, imageSource._id])
                                );
                              }}
                              className="rounded-full w-[55px] h-[55px] object-cover "
                            />
                          </div>
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
                          <p className="text-[20px] mt-3 text-semibold ml-3">
                            {postData?.name || postDataS?.name || "Unknown"}
                          </p>
                          <b>
                            <u className="text-[#0E6FFF]">
                              {session?.user?.role !== "NormalUser" && (
                                <Link href="/Profile">
                                  <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ml-3">
                                    {t("nav.viewprofile")}
                                  </p>
                                </Link>
                              )}
                              {session?.user?.role == "NormalUser" && (
                                <Link
                                  href={`/Profile/EditProfile/${session?.user?.id}`}
                                >
                                  <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ml-3">
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
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-8 ">
            {/* โลโก้สำหรับเดสทอป */}
            <div className="flex-none">
              <Link href="/">
                <Image
                  src={getLogo()}
                  alt="Digitech Space logo"
                  width={120}
                  height={120}
                  priority
                  unoptimized
                />
              </Link>
            </div>

            {/* เมนูเดสทอป */}
            {session ? (
              <div className="flex flex-1 items-center justify-center">
                <ul className="flex  items-center">
                  <li>
                    <Link href="/">
                      <p
                        className={`
                          font-semibold text-[20px] px-8 
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4]"
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/project">
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4] "
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/listblog">
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4] "
                          }
                          transition-colors duration-300
                        `}
                      >
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
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
                          {t("nav.home.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/project">
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
                          {t("nav.project.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/listblog">
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
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
                  {/* แจ้งเตือนเดสทอป */}
                  <div >
                    <Link href="/notification">
                      <NotificationIcon notificationCount={notificationCount} />
                    </Link>
                  </div>

                  {/* ปุ่มเปลี่ยนภาษา */}
                  <div style={commonStyles} className="mx-5"> 
                    <button
                      onClick={toggleLanguage}
                      className={`
                focus:outline-none transition-colors duration-300   hover:text-[#b2b0d4] hover:shadow-xl hover:scale-105
                ${
                  isHomePage
                    ? isScrolled
                      ? "text-white hover:text-[#b2b0d4]"
                      : "text-white hover:text-[#b2b0d4]"
                    : "text-white hover:text-[#b2b0d4]"
                }
              `}
                    >
                      <MdGTranslate style={iconStyles} />
                    </button>
                  </div>
                  <div style={commonStyles}>
                    <button
                      onClick={toggleAccountBox}
                      className="focus:outline-none"
                    >
                      {imageSource && !failedImages.has(imageSource._id) ? (
                        <div className="bg-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 p-1">
                          <Image
                            width={35}
                            height={35}
                            src={imageSource}
                            alt="Profile"
                            unoptimized={true}
                            onError={() => {
                              setFailedImages(
                                (prev) => new Set([...prev, imageSource._id])
                              );
                            }}
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <MdAccountCircle
                          style={iconStyles}
                          className={`
                    transition-colors duration-300
                    ${
                      isHomePage
                        ? isScrolled
                          ? "text-white hover:text-[#5f66de]"
                          : "text-white hover:text-gray-600"
                        : "text-white hover:text-[#5f66de]"
                    }
                  `}
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
                          {imageSource && !failedImages.has(imageSource._id) ? (
                            <div className="relative bg-white rounded-full p-1 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                              <Image
                                width={55}
                                height={55}
                                src={imageSource}
                                alt="Profile Image"
                                unoptimized={true}
                                onError={() => {
                                  setFailedImages(
                                    (prev) =>
                                      new Set([...prev, imageSource._id])
                                  );
                                }}
                                className="rounded-full w-[55px] h-[55px] object-cover "
                              />
                            </div>
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
                            <p className="text-[20px] mt-3 text-semibold ml-3">
                              {postData?.name || postDataS?.name || "Unknown"}
                            </p>
                            <b>
                              <u className="text-[#0E6FFF]">
                                {session?.user?.role !== "NormalUser" && (
                                  <Link href="/Profile">
                                    <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ml-3">
                                      {t("nav.viewprofile")}
                                    </p>
                                  </Link>
                                )}
                                {session?.user?.role == "NormalUser" && (
                                  <Link
                                    href={`/Profile/EditProfile/${session?.user?.id}`}
                                  >
                                    <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ml-3">
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
                    className={`
                      ml-8 text-xl focus:outline-none transition-colors duration-300
                      ${
                        isHomePage
                          ? isScrolled
                            ? "text-white hover:text-[#b2b0d4]"
                            : "text-gray-800 hover:text-[#b2b0d4]"
                          : "text-white hover:text-[#b2b0d4]"
                      }
                      w-[35px] h-[35px]
                    `}
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
                  <Image
                    src={getLogo()}
                    alt="Digitech Space logo"
                    width={120}
                    height={120}
                    priority
                    unoptimized
                  />
                </Link>
              </div>

              {/* เมนูเดสทอป */}
              {session ? (
                <div className="flex flex-1 items-center justify-center">
                  <ul className="flex  items-center">
                    <li>
                      <Link href="/">
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
                          {t("nav.home.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/project">
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
                          {t("nav.project.title")}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link href="/listblog">
                        <p
                          className={`
                            font-semibold text-[20px] px-8
                            ${
                              isHomePage
                                ? isScrolled
                                  ? "text-white hover:text-[#5f66de]"
                                  : "text-white hover:text-gray-600"
                                : "text-white hover:text-[#5f66de]"
                            }
                            transition-colors duration-300
                          `}
                        >
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
                          <p
                            className={`
                              font-semibold text-[20px] px-8
                              ${
                                isHomePage
                                  ? isScrolled
                                    ? "text-white hover:text-[#5f66de]"
                                    : "text-white hover:text-gray-600"
                                  : "text-white hover:text-[#5f66de]"
                              }
                              transition-colors duration-300
                            `}
                          >
                            {t("nav.home.title")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/project">
                          <p
                            className={`
                              font-semibold text-[20px] px-8
                              ${
                                isHomePage
                                  ? isScrolled
                                    ? "text-white hover:text-[#5f66de]"
                                    : "text-white hover:text-gray-600"
                                  : "text-white hover:text-[#5f66de]"
                              }
                              transition-colors duration-300
                            `}
                          >
                            {t("nav.project.title")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/listblog">
                          <p
                            className={`
                              font-semibold text-[20px] px-8
                              ${
                                isHomePage
                                  ? isScrolled
                                    ? "text-white hover:text-[#5f66de]"
                                    : "text-white hover:text-gray-600"
                                  : "text-white hover:text-[#5f66de]"
                              }
                              transition-colors duration-300
                            `}
                          >
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
                        className="ml-8 text-white text-xl hover:text-[#b2b0d4] focus:outline-none"
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
                              <div className="relative bg-white rounded-full p-1 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                                <Image
                                  width={60}
                                  height={60}
                                  src={imageSource}
                                  alt="Profile Image"
                                  unoptimized={true}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                  }}
                                  className="rounded-full w-[60px] h-[60px] object-cover mr-2"
                                />
                              </div>
                            ) : (
                              <MdAccountCircle
                                className={`
                                ml-8 text-xl focus:outline-none transition-colors duration-300
                                ${
                                  isHomePage
                                    ? isScrolled
                                      ? "text-white hover:text-[#5f66de]"
                                      : "text-white hover:text-gray-600"
                                    : "text-white hover:text-[#5f66de]"
                                }
                                w-[35px] h-[35px]
                              `}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            )}

                            <span>
                              <p className="text-[20px] mt-3 text-semibold ml-3">
                                {session?.user?.name || "Unknown"}
                              </p>
                              <b>
                                <u className="text-[#0E6FFF]">
                                  <Link href="/Profile">
                                    <p className="text-[14px] ml-1 text-[#0E6FFF] hover:text-gray-300 ml-3">
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
                      className="ml-8 text-white text-xl hover:text-[#b2b0d4] focus:outline-none"
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
                <Image
                  src={getLogo()}
                  alt="Digitech Space logo"
                  width={100}
                  height={100}
                  priority
                  unoptimized
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className={`
                  ml-8 text-xl focus:outline-none transition-colors duration-300
                  ${
                    isHomePage
                      ? isScrolled
                        ? "text-white hover:text-[#b2b0d4]"
                        : "text-gray-800 hover:text-[#b2b0d4]"
                      : "text-white hover:text-[#b2b0d4]"
                  }
                  w-[35px] h-[35px]
                `}
              >
                <svg
                  className="w-6 h-6 text-white"
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
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4] "
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2">
                    <Link href="/project">
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4] "
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
                    <Link href="/listblog" className="flex-1">
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#b2b0d4] "
                                : "text-white hover:text-[#b2b0d4] "
                              : "text-white hover:text-[#b2b0d4] "
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.blog.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="flex justify-center border-t border-gray-300 pt-5 ">
                    <MdGTranslate
                      className="text-white text-4xl hover:text-[#b2b0d4]"
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
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#5f66de]"
                                : "text-white hover:text-gray-600"
                              : "text-white hover:text-[#5f66de]"
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.home.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2">
                    <Link href="/project">
                      <p
                        className={`
                        font-semibold text-[20px] px-8
                        ${
                          isHomePage
                            ? isScrolled
                              ? "text-white hover:text-[#5f66de]"
                              : "text-white hover:text-gray-600"
                            : "text-white hover:text-[#5f66de]"
                        }
                        transition-colors duration-300
                      `}
                      >
                        {t("nav.project.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
                    <Link href="/listblog" className="flex-1">
                      <p
                        className={`
                          font-semibold text-[20px] px-8
                          ${
                            isHomePage
                              ? isScrolled
                                ? "text-white hover:text-[#5f66de]"
                                : "text-white hover:text-gray-600"
                              : "text-white hover:text-[#5f66de]"
                          }
                          transition-colors duration-300
                        `}
                      >
                        {t("nav.blog.title")}
                      </p>
                    </Link>
                  </li>
                  <li className="flex justify-center border-t border-gray-300 pt-5">
                    <MdGTranslate
                      className="text-white text-4xl hover:text-[#5f66de]"
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
