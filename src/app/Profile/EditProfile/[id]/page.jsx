"use client";

import React, { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

function page() {
  const { data: session, status } = useSession(); // Initialize session
  const { t } = useTranslation("translation");

  // State for the new name, profile image, and image file
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newFacebook, setNewFacebook] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Add this state to store the image file

  // Handle session updates once the session data is loaded
  useEffect(() => {
    if (session?.user?.name) {
      setNewName(session.user.name); // Set the initial name from session data
    }
    if (session?.user?.email) {
      setNewEmail(session.user.email); // Set the initial name from session data
    }
    if (session?.user?.imageUrl) {
      setProfileImage(session.user.imageUrl); // Set the initial image from session data
    }
  }, [session]);

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
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" />
      </div>
    );
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file in the imageFile state
      setProfileImage(URL.createObjectURL(file)); // Show preview of the uploaded image
    }
  };

  // Handle saving profile updates
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("line", newLine);
    formData.append("facebook", newFacebook);
    formData.append("phonenumber", newPhonenumber);

    if (imageFile) {
      formData.append("imageUrl", imageFile); // Append image file to form data
    }

    try {
      const response = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "PUT",
        body: formData, // Use FormData to handle file uploads
      });

      if (response.ok) {
        console.log("Profile saved successfully");
        // Optionally reload session data or update the UI
      } else {
        console.log("Error saving profile");
      }
    } catch (error) {
      console.error("Error during save:", error);
    }
  };

  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 my-[50px]">
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex flex-row justify-center relative">
            {profileImage ? (
              // Show uploaded image if available
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full"
                style={{ width: "95px", height: "95px", margin: "-10px", objectFit: "cover" }}
              />
            ) : (
              // Show default icon if no image is uploaded
              <MdAccountCircle
                className="rounded-full text-gray-500"
                style={{ width: "95px", height: "95px", margin: "-10px" }}
              />
            )}

            {/* Hidden file input for image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="imageUpload"
            />

            {/* Plus icon to trigger file input */}
            <label
              htmlFor="imageUpload"
              className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black cursor-pointer"
              style={{ transform: "translate(25%, 25%)" }}
            >
              <FaPlus size={18} className="text-black" />
            </label>
          </div>

          <div className="flex flex-row justify-center">
            <p
              style={{ fontSize: "24px", fontWeight: "bold" }}
              className="mt-6"
            >
              {session?.user?.name}
            </p>
          </div>
          {session?.user?.role == "NormalUser" && (
            <div className="flex flex-col items-center w-full mt-4">
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.name")}</p>
              </div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)} // Update state when input changes
                placeholder={session?.user?.name}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.email")}</p>
              </div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={session?.user?.email}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.pnum")}</p>
              </div>
              <input
                type="text"
                value={newPhonenumber}
                onChange={(e) => setNewPhonenumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.facebook")}</p>
              </div>
              <input
                type="text"
                value={newFacebook}
                onChange={(e) => setNewFacebook(e.target.value)}
                placeholder="Enter your facebook"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.line")}</p>
              </div>
              <input
                type="text"
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                placeholder="Enter your ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                style={{ backgroundColor: "#33539B" }}
              >
                {t("nav.profile.editprofile.save")}
              </button>
            </div>
          )}

          {session?.user?.role !== "NormalUser" && (
            <div className="flex flex-col items-center w-full mt-4">
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.name")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.email")}</p>
              </div>
              <div className="w-full p-2 mb-4 text-zinc-400">
                {session?.user?.email}
              </div>
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.pnum")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.facebook")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your facebook"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.line")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                style={{ backgroundColor: "#33539B" }}
              >
                {t("nav.profile.editprofile.save")}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default page;
