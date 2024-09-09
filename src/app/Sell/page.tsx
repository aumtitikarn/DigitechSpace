"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { VscEdit } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

// Define the Product type
type Product = {
  _id: string;
  imageUrl: string;
  projectname: string;
  author: string;
  rathing: string;
  review: number;
  sold: number;
  price: string;
  status: 'submitted' | 'pending' | 'reviewing' | 'approved' | 'rejected';
};

// Modal Component for confirmation
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const { t, i18n } = useTranslation("translation");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[300px]">
        <p className="mt-4 text-center font-bold">{t("nav.sell.want")}</p>
        <div className="mt-6 flex justify-center space-x-3">
          <button
            className="bg-gray-200 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            {t("nav.sell.no")}
          </button>
          <button
            className="bg-[#9B3933] text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            {t("nav.sell.yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ProductList Component
const ProductList: React.FC = () => {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t, i18n } = useTranslation("translation");
  const [pendingProjects, setPendingProjects] = useState<Product[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<Product[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (project: Product) => {
    setProjectToDelete(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      console.log("Attempting to delete project:", projectToDelete._id);
      try {
        const response = await fetch(
          `/api/project/delete/${projectToDelete._id}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();

        if (response.ok) {
          console.log(data.message);
          setPublishedProjects((prevProjects) =>
            prevProjects.filter(
              (project) => project._id !== projectToDelete._id
            )
          );
        } else {
          console.error("Failed to delete project:", data.message);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
      setIsModalOpen(false);
      setProjectToDelete(null);
    } else {
      console.error("No project selected for deletion");
    }
  };

  async function checkSellInfo() {
    try {
      const response = await fetch('/api/Seller/check');
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.hasSellInfo) {
        router.push('/Sell/AddProject');
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'User does not have Seller Information',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the add project page
            window.location.href = '/Sell/AddProject';
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error checking SellInfo`,
      });
    }
  }
  

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
  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        const response = await fetch("/api/project/getProjects/notpermission");
        if (!response.ok) {
          throw new Error("Failed to fetch pending projects");
        }
        const data = await response.json();
        setPendingProjects(data);
      } catch (error) {
        console.error("Error fetching pending projects:", error);
      }
    };

    fetchPendingProjects();
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session) {
        try {
          // Fetch published projects
          const publishedResponse = await fetch(
            "/api/project/getProjects/user",
            {
              method: "GET",
            }
          );
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            console.log("Published Data:", publishedData); // Debug log
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [status, session]);
  return (
    <div className="flex-grow">
      <Navbar />
      <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
        <h1 className="text-[24px] font-bold">{t("nav.sell.title")}</h1>
        <div>
          <div className="mt-5">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={checkSellInfo} disabled={isLoading}
              >
                <p className="text-[18px]">{t("nav.sell.buttAdd")}</p>
              </button>
            <Link href="/Sell/SellerInfo">
              <button
                type="submit"
                className="mt-5 flex w-full justify-center rounded-md bg-[#38B6FF] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <p className="text-[18px]">{t("nav.sell.buttSell")}</p>
              </button>
            </Link>
          </div>
          <h1 className="text-[24px] font-bold mt-10">{t("nav.sell.wait")}</h1>
          {pendingProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {pendingProjects.map((project, index) => (
                <Link
                  key={index}
                  href={`/project/projectdetail/${project._id}`}
                  passHref
                >
                  <div className="relative mt-5">
                    <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                      <div className="w-auto h-auto flex flex-col">
                        <img
                          src={`/api/project/images/${project.imageUrl[0]}`}
                          alt="Product Image"
                          className="w-full h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col h-full">
                          <p className="text-lg font-semibold mb-2 truncate">
                            {project.projectname}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-sm text-gray-600 truncate">
                              {project.author}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2 text-lg">
                              <IoIosStar />
                            </span>
                            <span className="text-gray-600 text-xs lg:text-sm">
                              {project.rathing || "N/A"} ({project.review}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
                              {project.sold}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[#33529B]">
                            {project.price} THB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-5">
              {t("nav.sell.noproject")}
            </p>
          )}

          <h1 className="text-[24px] font-bold mt-10">
            {t("nav.sell.publish")}
          </h1>
          {publishedProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {publishedProjects.map((project) => (
                <div key={project._id} className="relative mt-5">
                  <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                    <Link
                      href={`/project/projectdetail/${project._id}`}
                      passHref
                    >
                      <div className="w-auto h-auto flex flex-col cursor-pointer">
                        <img
                          src={`/api/project/images/${project.imageUrl[0]}`}
                          alt="Project Image"
                          className="w-full h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col h-full">
                          <p className="text-lg font-semibold mb-2 truncate">
                            {project.projectname}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-sm text-gray-600 truncate">
                              {project.author}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2 text-lg">
                              <IoIosStar />
                            </span>
                            <span className="text-gray-600 text-xs lg:text-sm truncate">
                              {project.rathing || "N/A"} ({project.review}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
                              {project.sold}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[#33529B]">
                            {project.price} THB
                          </p>
                        </div>
                      </div>
                    </Link>
                    {/* Icons */}
                    <div className="reletive flex justify-between lg:px-10 md:px-[50px] px-5 my-2">
                      <Link href={`/Sell/Edit?edit=${project._id}`}>
                        <VscEdit
                          size={20}
                          className="text-gray-500 hover:text-[#33539B]"
                        />
                      </Link>
                      <MdDeleteOutline
                        size={20}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(project)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-5">
              {t("nav.sell.noproject")}
            </p>
          )}
        </div>
      </div>
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <ProductList />
      </main>
      <Footer />
    </div>
  );
};

export default App;
