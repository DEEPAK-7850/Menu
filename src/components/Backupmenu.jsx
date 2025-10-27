import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { menuData, categories } from "../data/menuData";
import { motion, AnimatePresence } from "framer-motion";
import { VegIcon, NonVegIcon } from "../data/Icons";
import { Link as ScrollLink } from "react-scroll";

// --- Import icon URLs ---
import {
  BeveragesIconURL,
  BreakfastIconURL,
  EggsIconURL,
  SaladPapadIconURL,
  SoupVegIconURL,
  SoupNonVegIconURL,
  IndianStartersVegIconURL,
  IndianStartersNonVegIconURL,
  StartersVegIconURL,
  StartersNonVegIconURL,
  IndianMainCourseVegIconURL,
  IndianMainCourseNonVegIconURL,
  ChefsSpecialMainCourseVegIconURL,
  ChefsSpecialMainCourseNonVegIconURL,
  RajasthaniMainCourseIconURL,
  RaitaIconURL,
  IndianBreadsIconURL,
  RiceVegIconURL,
  RiceNonVegIconURL,
  DessertsIconURL,
} from "../data/svgs";

// --- Helper Arrow Icons ---
const ArrowLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// --- iconMap ---
const iconMap = {
  Beverages: <img src={BeveragesIconURL} alt="Beverages" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  Breakfast: <img src={BreakfastIconURL} alt="Breakfast" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  Eggs: <img src={EggsIconURL} alt="Eggs" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Salad / Papad": <img src={SaladPapadIconURL} alt="Salad / Papad" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Soup(veg)": <img src={SoupVegIconURL} alt="Soup(veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Soup(nonveg)": <img src={SoupNonVegIconURL} alt="Soup(nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Indian starters(Veg)": <img src={IndianStartersVegIconURL} alt="Indian starters(Veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Indian Starters(nonveg)": <img src={IndianStartersNonVegIconURL} alt="Indian Starters(nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Starters(Veg)": <img src={StartersVegIconURL} alt="Starters(Veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Starters(nonveg)": <img src={StartersNonVegIconURL} alt="Starters(nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Indian Main Course(Veg)": <img src={IndianMainCourseVegIconURL} alt="Indian Main Course(Veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Indian Main Course(nonveg)": <img src={IndianMainCourseNonVegIconURL} alt="Indian Main Course(nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Chef’s special Main course(veg)": <img src={ChefsSpecialMainCourseVegIconURL} alt="Chef’s special Main course(veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Chef’s special Main course(Nonveg)": <img src={ChefsSpecialMainCourseNonVegIconURL} alt="Chef’s special Main course(Nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Rajasthani Main Course": <img src={RajasthaniMainCourseIconURL} alt="Rajasthani Main Course" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  Raita: <img src={RaitaIconURL} alt="Raita" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Indian Breads": <img src={IndianBreadsIconURL} alt="Indian Breads" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Rice(veg)": <img src={RiceVegIconURL} alt="Rice(veg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  "Rice(nonveg)": <img src={RiceNonVegIconURL} alt="Rice(nonveg)" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
  Desserts: <img src={DessertsIconURL} alt="Desserts" className="w-[65px] h-[60px] mx-auto mb-1 object-cover rounded-lg" />,
};

function Menu() {
  const [filters, setFilters] = useState({
    all: true,
    veg: true, // Start true because 'all' is true
    nonVeg: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(window.innerWidth >= 840);

  useEffect(() => {
    const handleResize = () => setShowArrows(window.innerWidth >= 840);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkScrollArrows = useCallback(() => {
    if (window.innerWidth >= 840) {
      const el = scrollContainerRef.current;
      if (el) {
        const atLeft = el.scrollLeft <= 0;
        const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        setCanScrollLeft(!atLeft);
        setCanScrollRight(!atRight);
      }
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const timer = setTimeout(checkScrollArrows, 100);
      el.addEventListener("scroll", checkScrollArrows);
      window.addEventListener("resize", checkScrollArrows);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", checkScrollArrows);
        window.removeEventListener("resize", checkScrollArrows);
      };
    }
  }, [checkScrollArrows]);

  const handleArrowScroll = (scrollAmount) => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const toggleFilter = (type) => {
    setFilters((prev) => {
      let updated = { ...prev };
      if (type === "all") {
        const newAllState = !prev.all;
        updated = { all: newAllState, veg: newAllState, nonVeg: newAllState };
      } else {
        updated[type] = !prev[type];
        updated.all = updated.veg && updated.nonVeg;
      }
      if (!updated.veg && !updated.nonVeg) {
        updated = { all: true, veg: true, nonVeg: true };
      }
      return updated;
    });
  };

  // --- UPDATED: handleSetActive uses data-to selector ---
  const handleSetActive = (to) => {
    // console.log("Active Section ID:", to); // Keep for debugging if needed
    // Use the data-to attribute for a reliable selector
    const activeLinkElement = scrollContainerRef.current?.querySelector(`[data-to="${to}"]`);
    // console.log("Found Link Element:", activeLinkElement); // Keep for debugging if needed

    if (activeLinkElement && scrollContainerRef.current) {
      activeLinkElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      // setTimeout(checkScrollArrows, 350); // Optional recheck
    }
  };
  // --- END Update ---

  const filteredMenu = useMemo(() => {
    let menu = menuData;
    menu = menu.filter(item =>
        (filters.veg && item.type === "Veg") ||
        (filters.nonVeg && item.type === "Non-Veg")
    );
    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      menu = menu.filter((item) => item.name.toLowerCase().includes(lowerCaseQuery));
    }
    return menu;
  }, [filters, searchQuery]);

  // --- Styles (Ensure these match your desired look) ---
  const baseCategoryStyle =
    "h-[7.4rem] px-2 py-2 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative box-border";
  const activeCategoryStyle = "shadow-xl category-active border-2 border-green-600 p-2"; // Green border when active
  const inactiveCategoryStyle = "bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent";


  return (
    <div className="container mx-auto p-4 sm:p-8 mt-1">

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a dish..."
          className="w-full p-2 rounded-lg border-4 border-gray-400 text-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>

      {/* ===== Sticky Independent Toggle Buttons ===== */}
      <div className="sticky top-0 bg-white z-40 py-2"> {/* Wrapper is sticky */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-2 mb-6 flex justify-center shadow-md rounded-full mx-auto w-fit px-3"
        >
          <div className="flex items-center gap-3">
            <button
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.all
                  ? "text-blue-600 border-blue-600 border-2 shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
              onClick={() => toggleFilter("all")}
            >
              All
            </button>
            <button
              className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.veg
                  ? "text-green-600 border-green-600 border-2 shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
              onClick={() => toggleFilter("veg")}
            >
              <VegIcon size={18} /> Veg
            </button>
            <button
              className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.nonVeg
                  ? "text-red-600 border-red-600 border-2 shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
              onClick={() => toggleFilter("nonVeg")}
            >
              <NonVegIcon size={18} /> Non-Veg
            </button>
          </div>
        </motion.div>
      
      {/* ===== End Toggle Buttons ===== */}

      {/* ===== Category Bar Wrapper ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="z-30 bg-white mb-12 rounded-lg relative h-[7.7rem]"
      >
        <button
          onClick={() => handleArrowScroll(-250)}
          className={`absolute top-0 left-0 z-40 h-full px-2 flex items-center justify-center text-gray-700 transition-opacity duration-300 ${
            showArrows ? "flex" : "hidden"
          } ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span className="bg-white rounded-full p-1 shadow-md border border-gray-200">
            <ArrowLeftIcon />
          </span>
        </button>

        <div
          ref={scrollContainerRef}
          className={`flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start pt-1 category-scrollbar ${
            showArrows ? "px-12" : "px-4"
          }`}
        >
          {categories.map((category) => (
            <ScrollLink
              key={category}
              to={`category-${category}`}
              // --- ADDED: data-to attribute ---
              data-to={`category-${category}`}
              spy={true}
              smooth={true}
              duration={500}
              offset={-250} // ADJUSTED OFFSET: Estimate (navbar + sticky toggle bar height)
              className={`${baseCategoryStyle} ${inactiveCategoryStyle} flex-shrink-0`}
              activeClass={activeCategoryStyle}
              onSetActive={handleSetActive} // This triggers the scroll
            >
              <div className="flex flex-col items-center justify-center text-center gap-0 m-0 p-0">
                {/* --- UPDATED: Fallback div size --- */}
                {iconMap[category] || <div className="w-[65px] h-[60px] mb-1"></div>}
                <span className="text-xs leading-tight">
                  {category
                    .replace("(veg)", "(V)")
                    .replace("(nonveg)", "(NV)")
                    .replace("(Veg)", "(V)")
                    .replace("(Nonveg)", "(NV)")}
                </span>
              </div>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[4px] bg-green-600 rounded-full transition-all duration-300 ease-out underline-indicator"></span>
            </ScrollLink>
          ))}
        </div>

        <button
          onClick={() => handleArrowScroll(250)}
          className={`absolute top-0 right-0 z-40 h-full px-2 flex items-center justify-center transition-opacity duration-300 ${
            showArrows ? "flex" : "hidden"
          } ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span className="bg-white rounded-full p-1 shadow-md border border-gray-200">
            <ArrowRightIcon />
          </span>
        </button>
      </motion.div>
      </div>
      {/* ===== END Category Bar ===== */}

      {/* No Results */}
      {filteredMenu.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
          <p className="text-xl font-semibold text-gray-700">No items found</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </motion.div>
      )}

      {/* Menu Items */}
      {filteredMenu.length > 0 && (
        <div className="space-y-12">
          {categories.map((category) => {
            const itemsInCategory = filteredMenu.filter((item) => item.category === category);
            if (itemsInCategory.length === 0) return null;
            return (
              <motion.section
                key={category}
                id={`category-${category}`} // Section ID matches ScrollLink 'to'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-gray-600 pb-3 mb-6">
                  {category}
                </h2>
                <div className="space-y-2">
                  <AnimatePresence>
                    {itemsInCategory.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="menu-item py-2 border-b-2 border-gray-300"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {item.type === "Veg" ? (
                                <VegIcon size={26} className="text-green-600 mr-2 flex-shrink-0" />
                              ) : (
                                <NonVegIcon size={26} className="text-red-600 mr-2 flex-shrink-0" />
                              )}
                              <strong className="text-lg text-gray-800">{item.name}</strong>
                            </div>
                            <p className="item-price mb-0 mt-1 ml-8">
                              <span className="font-bold text-gray-600">₹{item.price.toFixed(2)}</span>
                            </p>
                          </div>
                          <div className="relative w-24 h-20 flex-shrink-0"></div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;