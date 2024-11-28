"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaUniversity,
  FaCreditCard,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  PhoneNumberInput,
  usePhoneInput,
} from "../../components/PhoneNumberInput";
import { useRouter } from "next/navigation";
import BankFormField from "../../components/BankFormField";

const SellInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("translation");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { phoneNumber, setPhoneNumber, getRawPhoneNumber } = usePhoneInput();

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
    const rawPhoneNumber = getRawPhoneNumber();
    if (!session?.user?.id) return;

    const res = await fetch(`/api/Seller/update/${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      Swal.fire({
        position: "center",
        icon: "success",
        title: t("status.success"),
        showConfirmButton: false,
        timer: 3000,
      });

      router.push("/Sell");
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
          throw new Error("Failed to fetch data");
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
      } catch (error) {}
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#0B1E48] to-[#1E3A8A] px-6 py-4">
              <h1 className="text-2xl font-bold text-white">
                {t("nav.sell.sellinfo.title")}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {t("nav.sell.sellinfo.des")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t("nav.sell.sellinfo.personal")}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      value={formData.fullname}
                      placeholder={
                        formData.fullname || t("nav.sell.sellinfo.fullname")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <PhoneNumberInput
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      placeholder={t("nav.sell.sellinfo.phonenum")}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      id="nationalid"
                      name="nationalid"
                      type="text"
                      value={formData.nationalid}
                      placeholder={
                        formData.nationalid || t("nav.sell.sellinfo.id")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t("nav.sell.sellinfo.bankde")}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="text-gray-400" />
                    </div>
                    <BankFormField />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCreditCard className="text-gray-400" />
                    </div>
                    <input
                      id="numberbankacc"
                      name="numberbankacc"
                      type="text"
                      value={formData.numberbankacc}
                      placeholder={
                        formData.numberbankacc ||
                        t("nav.sell.sellinfo.numbankacc")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t("nav.sell.sellinfo.address")}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHome className="text-gray-400" />
                    </div>
                    <input
                      id="housenum"
                      name="housenum"
                      type="text"
                      value={formData.housenum}
                      placeholder={
                        formData.housenum || t("nav.sell.sellinfo.housenum")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="subdistrict"
                      name="subdistrict"
                      type="text"
                      value={formData.subdistrict}
                      placeholder={
                        formData.subdistrict ||
                        t("nav.sell.sellinfo.subdistrict")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      value={formData.district}
                      placeholder={
                        formData.district || t("nav.sell.sellinfo.district")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="province"
                      name="province"
                      type="text"
                      value={formData.province}
                      placeholder={
                        formData.province || t("nav.sell.sellinfo.province")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="postalnumber"
                      name="postalnumber"
                      type="text"
                      value={formData.postalnumber}
                      placeholder={
                        formData.postalnumber ||
                        t("nav.sell.sellinfo.postalnumber")
                      }
                      required
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0B1E48] to-[#38B6FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-[0.99] active:scale-[0.97]"
              >
                {t("nav.sell.sellinfo.save")}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellInfo;
