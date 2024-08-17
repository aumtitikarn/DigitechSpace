import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { star } from "react-icons-kit/fa";
import Icon from "react-icons-kit";
import { MdAccountCircle } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Items_Filter = () => {
  const { t, i18n } = useTranslation("translation");

  const categories = [
    { id: 1, category: t("nav.project.all") },
    { id: 2, category: t("nav.project.document") },
    { id: 3, category: t("nav.project.model") },
    { id: 4, category: t("nav.project.website") },
    { id: 5, category: t("nav.project.mobileapp") },
    { id: 6, category: t("nav.project.ai") },
    { id: 7, category: t("nav.project.datasets") },
    { id: 8, category: t("nav.project.iot") },
    { id: 9, category: t("nav.project.program") },
    { id: 10, category: t("nav.project.photo") },
    { id: 11, category: t("nav.project.other") },
  ];

  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([t("nav.project.all")]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const category = JSON.parse(value).label.split(", ")[1];

    if (category === "All") {
      if (checked) {
        setSelectedCategory(["All"]);
      } else {
        setSelectedCategory([]);
      }
    } else {
      const updatedList = checked
        ? [...selectedCategory.filter((item) => item !== "All"), category]
        : selectedCategory.filter((item) => item !== category);

      if (updatedList.length === 0) {
        setSelectedCategory(["All"]);
      } else {
        setSelectedCategory(updatedList);
      }
    }
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const products = [
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
  ];

  const Rating = () => {
    const items = [];
    for (let index = 5; index >= 0; index--) {
      items.push(
        <li className="flex items-center mb-2 " key={index + 1}>
          <input
            id={`cat-radio-${index}`}
            type="radio"
            name="rbt-radio"
            className={`mr-2 accent-[#33539B]`}
            checked={selectedRating === index}
            onChange={() => {
              handleRatingChange(index);
            }}
          />
          <label
            htmlFor={`cat-radio-${index}`}
            className="flex items-center space-x-2"
          >
            <span className="flex">{getStarIcons(index)}</span>
            <p className="text-gray-400">(20)</p>
          </label>
        </li>
      );
    }
    return items;
  };

  const getStarIcons = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    const starIcons = [];
    for (let i = 0; i < filledStars; i++) {
      starIcons.push(<Icon key={i} icon={star} className="text-yellow-500" />);
    }

    if (halfStar) {
      starIcons.push(
        <Icon key="half" icon={star} className="text-yellow-500" />
      );
    }

    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starIcons.push(
        <Icon key={`empty-${i}`} icon={star} className="text-gray-300" />
      );
    }

    return starIcons;
  };

  return (
    <>
      <div className=" flex flex-col md:flex-row gap-5 ">
        <div className="md:w-[300px] mb-4 ">
          <div className="p-4  flex border border-gray-300 rounded-lg shadow-sm lg:w-[300px] ">
            <div className="space-y-0">
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder={t("nav.home.search")}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className={`p-4 ${showMore ? "bg-gray-50" : ""}`}>
                <h4 className="text-xl font-semibold mt-5">{t("nav.project.catagory")}</h4>
                <div className="border-t border-gray-300 my-4"></div>
                <ul className="space-y-2">
                  {categories
                    .slice(0, showMore ? categories.length : 5)
                    .map((c) => (
                      <li className="flex items-center" key={c.id}>
                        <input
                          id={`cat-list-${c.id}`}
                          type="checkbox"
                          name="cat-list"
                          className={`mr-2 accent-[#33539B]`}
                          value={`{"value":${c.id},"label":"${c.category_th}, ${c.category}"}`}
                          onChange={(e) => handleCategoryChange(e)}
                          checked={
                            c.category === "All"
                              ? selectedCategory.includes("All")
                              : selectedCategory.includes(c.category)
                          }
                        />
                        <label htmlFor={`cat-list-${c.id}`}>{c.category}</label>
                      </li>
                    ))}
                </ul>
                <div
                  className={`mt-4 text-[#33529B] cursor-pointer ${showMore ? "font-bold" : ""}`}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </div>
                <div className="border-t border-gray-300 mt-4"></div>
              </div>

              <div className="p-4">
                <h4 className="text-xl font-semibold mb-4">{t("nav.project.rating")}</h4>
                <ul className="space-y-2 ">
                  <li className="flex items-center">
                    <input
                      id="cat-radio-All"
                      type="radio"
                      name="rbt-radio"
                      className={`mr-2 accent-[#33539B]`}
                      checked={selectedRating === null}
                      onChange={() => {
                        handleRatingChange(null);
                      }}
                    />
                    <label
                      htmlFor="cat-radio-All"
                      className="flex items-center space-x-2"
                    >
                      <span>{t("nav.project.all")}</span>
                      <p className="text-gray-400">(20)</p>
                    </label>
                  </li>
                  {Rating()}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Link href="/project/projectdetail">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[5px]">
            {products.map((product, index) => (
              <div
                key={index}
                className="lg:w-[203px] lg:h-[275px] w-[163px] h-[233px] md:w-[193px] md:h-[263px] rounded-[10px] border border-[#BEBEBE] bg-white p-4 mb-5"
              >
                <div className="w-full h-full flex flex-col">
                  <img
                    src={product.image}
                    alt="Product Image"
                    className="w-full h-[150px] rounded-md object-cover mb-4"
                  />
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-lg font-semibold mb-2 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2 text-2xl">
                        <MdAccountCircle />
                      </span>
                      <p className="text-sm text-gray-600 truncate">
                        {product.author}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">
                        <IoIosStar />
                      </span>
                      <span className="lg:text-sm text-gray-600 text-[12px]">
                        {product.rating} ({product.reviews}) | Sold{" "}
                        {product.sold}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#33529B]">
                      {product.price} THB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </>
  );
};

export default Items_Filter;
