import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { star } from "react-icons-kit/fa";
import Icon from "react-icons-kit";
import { MdAccountCircle } from "react-icons/md";
import { IoIosStar } from "react-icons/io";

const Items_Filter = () => {
  const categories = [
    { id: 1, category_th: "หมวดหมู่ 3", category_en: "All" },
    { id: 2, category_th: "หมวดหมู่ 1", category_en: "Document" },
    { id: 3, category_th: "หมวดหมู่ 2", category_en: "Model/3D" },
    { id: 4, category_th: "หมวดหมู่ 3", category_en: "Website" },
    { id: 5, category_th: "หมวดหมู่ 1", category_en: "MobileApp" },
    { id: 6, category_th: "หมวดหมู่ 2", category_en: "Datasets" },
    { id: 7, category_th: "หมวดหมู่ 3", category_en: "AI" },
    { id: 8, category_th: "หมวดหมู่ 1", category_en: "IOT" },
    { id: 9, category_th: "หมวดหมู่ 2", category_en: "Program" },
    { id: 10, category_th: "หมวดหมู่ 3", category_en: "Photo/Art" },
    { id: 11, category_th: "หมวดหมู่ 3", category_en: "Other" },
  ];

  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const updatedList = checked
      ? [...selectedCategory, value]
      : selectedCategory.filter((item) => item !== value);

    setSelectedCategory(updatedList);
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
            className={`mr-2 appearance-none border-2 border-gray-300 rounded-full w-4 h-4 checked:bg-[#33539B]`}
            checked={selectedRating === index}
            onChange={() => {
              handleRatingChange(index);
            }}
          />
          <label htmlFor={`cat-radio-${index}`}>
            <span className="flex ">{getStarIcons(index)}</span>
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
      <div className="container flex gap-3">
        <div className="">
          <div className="p-4  flex border border-gray-300 rounded-lg shadow-sm w-[300px]">
            <div className="space-y-0">
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className={`p-4 ${showMore ? "bg-gray-50" : ""}`}>
                <h4 className="text-xl font-semibold mt-5">Category</h4>
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
                          value={`{"value":${c.id},"label":"${c.category_th}, ${c.category_en}"}`}
                          onChange={(e) => handleCategoryChange(e)}
                          checked={selectedCategory.includes(
                            `{"value":${c.id},"label":"${c.category_th}, ${c.category_en}"}`
                          )}
                        />
                        <label htmlFor={`cat-list-${c.id}`}>
                          {c.category_en}
                        </label>
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
                <h4 className="text-xl font-semibold mb-4">Ratings</h4>
                <ul className="space-y-2">
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
                    <label htmlFor="cat-radio-All">All</label>
                  </li>
                  {Rating()}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-[40px] ml-[20px] gap-y-[65px]">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white w-[210px] h-[320px] p-4"
            >
              <div className="w-full h-auto flex flex-col">
                {/* รูปภาพสินค้า */}
                <img
                  src={product.image}
                  alt="Product Image"
                  className="w-full h-[150px] rounded-md object-cover mb-4"
                />
                <div className="flex flex-col justify-between h-full">
                  <p className="text-lg font-semibold mb-2 truncate w-[150px]">
                    {product.name}
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-2 text-2xl">
                      <MdAccountCircle />
                    </span>
                    <p className="text-sm text-gray-600 truncate w-[150px]">
                      {product.author}
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-2">
                      <IoIosStar />
                    </span>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews}) | Sold {product.sold}
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
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center ml-[300px]">
        <nav aria-label="Pagination" className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
            aria-label="Previous"
          >
            &laquo;
          </button>
          <ul className="flex space-x-4">
            <li>
              <button className="px-3 py-1 bg-[#33529B] text-white rounded-md hover:bg-[#4c6fb3]">
                1
              </button>
            </li>
            <li>
              <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
                2
              </button>
            </li>
            <li>
              <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
                3
              </button>
            </li>
          </ul>
          <button
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
            aria-label="Next"
          >
            &raquo;
          </button>
        </nav>
      </div>
    </>
  );
};

export default Items_Filter;
