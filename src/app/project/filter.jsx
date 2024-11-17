"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { star } from "react-icons-kit/fa";
import Icon from "react-icons-kit";
import { MdAccountCircle } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import Image from "next/image";
import { OrbitProgress } from "react-loading-indicators";

const Items_Filter = ({ initialCategory, isProjectPage }) => {
  const { t, i18n } = useTranslation("translation");
  const [projects, setProjects] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedRating, setSelectedRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Move categories to useMemo to maintain reference
  const categories = useMemo(() => [
    { id: 1, category: t("nav.project.all"), categoryEN: "All" },
    { id: 2, category: t("nav.project.document"), categoryEN: "Document" },
    { id: 3, category: t("nav.project.model"), categoryEN: "Model" },
    { id: 4, category: t("nav.project.website"), categoryEN: "Website" },
    { id: 5, category: t("nav.project.mobileapp"), categoryEN: "MobileApp" },
    { id: 6, category: t("nav.project.ai"), categoryEN: "Ai" },
    { id: 7, category: t("nav.project.datasets"), categoryEN: "Datasets" },
    { id: 8, category: t("nav.project.iot"), categoryEN: "IOT" },
    { id: 9, category: t("nav.project.program"), categoryEN: "Program" },
    { id: 10, category: t("nav.project.photo"), categoryEN: "Photo" },
    { id: 11, category: t("nav.project.other"), categoryEN: "Other" },
  ], [t]);

  const calculateRatingCounts = useCallback((projects) => {
    const counts = {
      total: projects.length,
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
      0: 0,
    };
  
    projects.forEach((project) => {
      const rating = Math.floor(parseFloat(project.rathing) || 0);
      if (rating >= 0 && rating <= 5) {
        counts[rating]++;
      }
    });
  
    return counts;
  }, []);
  
  // Then add calculateRatingCounts to filterProjects dependencies
  const filterProjects = useCallback((projectsToFilter, term, rating) => {
    let filtered = projectsToFilter.filter((project) =>
      project.projectname.toLowerCase().includes(term.toLowerCase())
    );
  
    if (rating !== null) {
      filtered = filtered.filter((project) => {
        const projectRating = parseFloat(project.rathing) || 0;
        return projectRating >= rating && projectRating < rating + 1;
      });
    }
  
    setFilteredProjects(filtered);
    return calculateRatingCounts(filtered);
  }, [calculateRatingCounts]);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }

    if (initialCategory) {
      const categoryItem = categories.find(
        (c) => c.categoryEN.toLowerCase() === initialCategory.toLowerCase()
      );
      if (categoryItem) {
        setSelectedCategory(categoryItem.categoryEN);
      } else {
        setSelectedCategory(undefined);
      }
    } else if (isProjectPage) {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(undefined);
    }
  }, [initialCategory, isProjectPage, searchParams, categories]);

  const debouncedSearch = useCallback(
    (term) => {
      filterProjects(projects, term, selectedRating);
      router.push(`/project?search=${encodeURIComponent(term)}`, {
        scroll: false,
      });
    },
    [projects, selectedRating, router, filterProjects]
  );

  const handleSearchChange = useCallback((e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  }, [debouncedSearch]);

  const fetchProjects = useCallback(async (categoryEN) => {
    setIsLoading(true);
    try {
      const normalizedCategory = categoryEN.toLowerCase();
      const response = await fetch(
        `/api/project/getProjects${
          normalizedCategory !== "all"
            ? `?category=${encodeURIComponent(normalizedCategory)}`
            : ""
        }`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedProjects = await fetchProjects(selectedCategory);
      setProjects(fetchedProjects);
      filterProjects(fetchedProjects, searchTerm, selectedRating);
      setIsLoading(false);
    };
    fetchData();
  }, [selectedCategory, selectedRating, fetchProjects, filterProjects, searchTerm]);


  const handleCategoryChange = (e) => {
    const selectedTranslatedCategory = e.target.value;
    const categoryItem = categories.find(
      (c) => c.category === selectedTranslatedCategory
    );
    if (categoryItem) {
      setSelectedCategory(categoryItem.categoryEN);
    }
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  // Updated Rating component to show actual counts
  const Rating = () => {
    const ratingCounts = calculateRatingCounts(projects);
    const items = [];
    
    for (let index = 5; index >= 0; index--) {
      items.push(
        <li className="flex items-center mb-2" key={index}>
          <input
            id={`cat-radio-${index}`}
            type="radio"
            name="rbt-radio"
            className="mr-2 accent-[#33539B]"
            checked={selectedRating === index}
            onChange={() => handleRatingChange(index)}
          />
          <label
            htmlFor={`cat-radio-${index}`}
            className="flex items-center space-x-2"
          >
            <span className="flex">{getStarIcons(index)}</span>
            <p className="text-gray-400">({ratingCounts[index]})</p>
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

  // Rest of the component remains the same...
  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Filter Section */}
      <div className="md:w-[300px] flex-shrink-0 mb-4 md:mb-0 md:mr-8">
        <div className="sticky top-4 p-4 border border-gray-300 rounded-lg shadow-sm">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={t("nav.home.search")}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xl font-semibold">
                {t("nav.project.catagory")}
              </h4>
              <div className="border-t border-gray-300 my-2"></div>
              <ul className="space-y-2">
                {categories
                  .slice(0, showMore ? categories.length : 5)
                  .map((c) => (
                    <li className="flex items-center" key={c.id}>
                      <input
                        id={`cat-list-${c.id}`}
                        type="checkbox"
                        name="cat-list"
                        className="mr-2 accent-[#33539B]"
                        value={c.category}
                        onChange={handleCategoryChange}
                        checked={selectedCategory === c.categoryEN}
                      />
                      <label htmlFor={`cat-list-${c.id}`}>{c.category}</label>
                    </li>
                  ))}
              </ul>
              <button
                className={`mt-2 text-[#33529B] cursor-pointer ${
                  showMore ? "font-bold" : ""
                }`}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore
                  ? t("nav.project.showless")
                  : t("nav.project.showmore")}
              </button>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-xl font-semibold mb-2">
                {t("nav.project.rating")}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <input
                    id="cat-radio-All"
                    type="radio"
                    name="rbt-radio"
                    className="mr-2 accent-[#33539B]"
                    checked={selectedRating === null}
                    onChange={() => handleRatingChange(null)}
                  />
                  <label
                    htmlFor="cat-radio-All"
                    className="flex items-center space-x-2"
                  >
                    <span>{t("nav.project.all")}</span>
                    <p className="text-gray-400">
                      ({calculateRatingCounts(projects).total})
                    </p>
                  </label>
                </li>
                {Rating()}
              </ul>
            </div>
          </div>
        </div>
      </div>

     {/* Projects Display Section with Loading State */}
     <div className="flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-[10px] gap-y-[20px] lg:gap-x-[30px] md:gap-x-[40px] md:gap-y-[40px]">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center min-h-[200px]">
              <OrbitProgress
                variant="track-disc"
                dense
                color="#33539B"
                size="medium"
                text=""
                textColor=""
              />
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <Link key={index} href={`/project/projectdetail/${project._id}`}>
                <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4 w-auto h-auto">
                <div className="relative w-full h-[150px] mb-4">
                    <Image
                      src={`/api/project/images/${project.imageUrl[0]}`}
                      alt="Project Image"
                      fill
                      className="rounded-md object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-lg font-semibold mb-2 truncate">
                      {project.projectname}
                    </p>
                    <div className="flex items-center mb-2">
                      {project.profileImage ? (
                        <Image
                          src={project.profileImage}
                          alt="Author Profile"
                          width={20}
                          height={20}
                          className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 mr-2 text-2xl">
                          <MdAccountCircle />
                        </span>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {project.authorName}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">
                        <IoIosStar />
                      </span>
                      <span className="lg:text-sm text-gray-600 text-[12px] truncate">
                        {project.rathing || "N/A"} ({project.review}) |{" "}
                        {t("nav.project.projectdetail.sold")} {project.sold}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#33529B]">
                      {project.price} THB
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <p className="mt-2 text-gray-500 text-sm lg:text-base whitespace-nowrap">
                {t("nav.project.noresult")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Items_Filter;