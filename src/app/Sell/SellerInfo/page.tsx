"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from 'next/navigation';

const SellInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("translation");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);
  
  const [formData, setFormData] = useState({
    fullname: "",
    phonenumber: "",
    nationalid: "",
    namebank: "",
    numberbankacc: "",
    housenum: "",
    subdistrict: "",
    district: "",
    province: "",
    postalnumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!session?.user?.id) return;
  
    const res = await fetch(`/api/Seller/update/${session.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  
    if (res.ok) {
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        showConfirmButton: false,
        timer: 3000,
      });
  
      router.push('/Sell');
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };
  

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!session?.user?.id) return; // ใช้ session เพื่อดึง id ของผู้ใช้
  
      try {
        const response = await fetch(`/api/Seller/${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Set formData from the fetched data
        setFormData({
          fullname: data.SellInfo.fullname || "",
          phonenumber: data.SellInfo.phonenumber || data.phonenumber || "",
          nationalid: data.SellInfo.nationalid || "",
          namebank: data.SellInfo.namebank || "",
          numberbankacc: data.SellInfo.numberbankacc || "",
          housenum: data.SellInfo.housenum || "",
          subdistrict: data.SellInfo.subdistrict || "",
          district: data.SellInfo.district || "",
          province: data.SellInfo.province || "",
          postalnumber: data.SellInfo.postalnumber || "",
        });
      } catch (error) {

      }
    };
  
    fetchExistingData();
  }, [session?.user?.id]);

  if (status === "loading") {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="container mt-3 ">
            <h1 className="text-[24px] font-bold">{t("nav.sell.sellinfo.title")}</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-3">
              <input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="fullname"
                value={formData.fullname}
                placeholder={formData.fullname || t("nav.sell.sellinfo.fullname")}
                required
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="phonenumber"
                name="phonenumber"
                type="text"
                autoComplete="phonenumber"
                value={formData.phonenumber}
                placeholder={formData.phonenumber || t("nav.sell.sellinfo.phonenum")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="nationalid"
                name="nationalid"
                type="text"
                autoComplete="nationalid"
                value={formData.nationalid}
                placeholder={formData.nationalid || t("nav.sell.sellinfo.id")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="namebank"
                name="namebank"
                type="text"
                autoComplete="namebank"
                value={formData.namebank}
                placeholder={formData.namebank || t("nav.sell.sellinfo.namebank")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="numberbankacc"
                name="numberbankacc"
                type="text"
                autoComplete="numberbankacc"
                value={formData.numberbankacc}
                placeholder={formData.numberbankacc || t("nav.sell.sellinfo.numbankacc")}
                required
                onChange={handleChange}
                className="mt-3 mb-10 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <div className="border-t border-gray-300 mb-5"></div>
            <div className="container mt-3 ">
              <h1 className="text-[24px] font-bold">
                {t("nav.sell.sellinfo.address")}
              </h1>
            </div>
            <div className="mt-3">
              <input
                id="housenum"
                name="housenum"
                type="text"
                autoComplete="housenum"
                value={formData.housenum}
                placeholder={formData.housenum || t("nav.sell.sellinfo.housenum")}
                required
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="subdistrict"
                name="subdistrict"
                type="text"
                autoComplete="subdistrict"
                value={formData.subdistrict}
                placeholder={formData.subdistrict || t("nav.sell.sellinfo.subdistrict")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="district"
                name="district"
                type="text"
                autoComplete="district"
                value={formData.district}
                placeholder={formData.district || t("nav.sell.sellinfo.district")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="province"
                name="province"
                type="text"
                autoComplete="province"
                value={formData.province}
                placeholder={formData.province || t("nav.sell.sellinfo.province")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
              <input
                id="postalnumber"
                name="postalnumber"
                type="text"
                autoComplete="postalnumber"
                value={formData.postalnumber}
                placeholder={formData.postalnumber || t("nav.sell.sellinfo.postalnumber")}
                required
                onChange={handleChange}
                className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <button
              type="submit"
              className="mt-3 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("nav.sell.sellinfo.save")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellInfo;
