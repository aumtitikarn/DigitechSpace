"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Link from 'next/link';

function page() {

    const [requests, setRequests] = useState([]);

    const addRequest = (user, issue, email) => {
    setRequests(prevRequests => [
      ...prevRequests,
      {
        id: prevRequests.length + 1,
        user,
        issue,
        email
      }
    ]);
  };

  return (
    <Container>
        <Navbar/>
    <main className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4 mx-auto">
        <div className="flex flex-col w-full md:w-2/3 lg:w-full justify-center p-4">
            <div className="flex flex-col justify-center m-5">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-5 mb-5">
                รายงานของผู้ใช้ : บล็อก
                </h1>
            </div>
            <table className="w-full border-2 mt-10 mb-10">
            <thead>
                <tr>
                    <th className="w-1/12 border-2 text-center h-12">#</th>
                    <th className="w-3/12 border-2 text-center h-12">หัวข้อบล็อก</th>
                    <th className="w-5/12 border-2 text-center h-12">คำร้อง</th>
                    <th className="w-3/12 border-2 text-center h-12">ผู้รายงาน</th>
                </tr>
            </thead>
            <tbody>
            <tr>
                    <td className="border-2 text-center h-14">1</td>
                    <td className="border-2 text-center h-14">แนะนำ Study With Me ฉบับเด็กมทส.</td>
                    <td className="border-2 text-center h-14">มีคำไม่สุภาพ หรือ... </td>
                    <td className="border-2 text-center h-14">สมใจ ใจดี</td>
            </tr>
            <tr>
                    <td className="border-2 text-center h-14">2</td>
                    <td className="border-2 text-center h-14">แนะนำ Study With Me ฉบับเด็กมทส.</td>
                    <td className="border-2 text-center h-14">มีคำไม่สุภาพ หรือ... </td>
                    <td className="border-2 text-center h-14">สมใจ ใจดี</td>
            </tr>
            <tr>
                    <td className="border-2 text-center h-14"><Link href="/blog/blogreport">3</Link></td>
                    <td className="border-2 text-center h-14"><Link href="/blog/blogreport"><p className="truncate w-full">แนะนำ Study With Me ฉบับเด็กมทส.</p></Link></td>
                    <td className="border-2 text-center h-14"><Link href="/blog/blogreport">มีคำไม่สุภาพ หรือ... </Link></td>
                    <td className="border-2 text-center h-14"><Link href="/blog/blogreport">สมใจ ใจดี</Link></td>
            </tr>
            
                {requests.map((request, index) => (
                <tr key={index}>
                    <td className="border-2 text-center h-14">{request.id}</td>
                    <td className="border-2 text-center h-14">{request.user}</td>
                    <td className="border-2 text-center h-14">{request.issue}</td>
                    <td className="border-2 text-center h-14">{request.email}</td>
                </tr>
                ))}
            </tbody>
            </table>

        <form
            className="flex flex-col space-y-4"
            onSubmit={e => {
            e.preventDefault();
            const user = e.target.user.value;
            const issue = e.target.issue.value;
            const email = e.target.email.value;

            addRequest(user, issue, email);

            e.target.reset();
        }}
        >
        <input
            className="w-full border-2 p-2"
            name="user"
            placeholder="ผู้ส่งคำร้อง"
            required
        />
        <input
            className="w-full border-2 p-2"
            name="issue"
            placeholder="ปัญหา"
            required
        />
        <input
            className="w-full border-2 p-2"
            name="email"
            type="email"
            placeholder="อีเมล"
            required
        />
            <button className="w-full bg-blue-500 text-white p-2" type="submit">
             ส่งคำร้อง
            </button>
        </form>
        </div>
    </main>
    <Footer/>
    </Container>
  )
}

export default page
