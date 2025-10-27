import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { menuData, categories } from "../data/menuData"; // Ensure menuData.js uses the final categories
import { motion, AnimatePresence } from "framer-motion";
import { VegIcon, NonVegIcon } from "../data/Icons"; // Ensure Icons.jsx exists
import { Link as ScrollLink } from "react-scroll";
import { scroller } from "react-scroll";


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
} from "../data/svgs"; // Make sure index.js exports PNG URLs

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

// --- Checkmark Icon Component ---
const CheckmarkIcon = () => (
    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// --- Category Icon Wrapper Component (Checkmark top-left) ---
const CategoryIcon = ({ iconURL, altText, isActive }) => (
    <div className={`relative w-[65px] h-[60px] mx-auto mb-1 rounded-lg overflow-hidden transition-all duration-300
                    ${isActive ? 'border-2 border-green-600 shadow-active-category' : 'border-2 border-transparent'}`}>
        <img src={iconURL} alt={altText} className="w-full h-full object-cover rounded-lg" />
        {isActive && (
            <div className="absolute top-[-8px] left-[-8px] bg-white rounded-full p-[2px] shadow-md border border-green-600 category-icon-checkmark">
                <CheckmarkIcon />
            </div>
        )}
    </div>
);

// --- iconMap updated to use CategoryIcon ---
const iconMap = {
  Beverages: (isActive) => <CategoryIcon iconURL={BeveragesIconURL} altText="Beverages" isActive={isActive} />,
  Breakfast: (isActive) => <CategoryIcon iconURL={BreakfastIconURL} altText="Breakfast" isActive={isActive} />,
  Eggs: (isActive) => <CategoryIcon iconURL={EggsIconURL} altText="Eggs" isActive={isActive} />,
  "Salad / Papad": (isActive) => <CategoryIcon iconURL={SaladPapadIconURL} altText="Salad / Papad" isActive={isActive} />,
  "Soup(veg)": (isActive) => <CategoryIcon iconURL={SoupVegIconURL} altText="Soup(veg)" isActive={isActive} />,
  "Soup(nonveg)": (isActive) => <CategoryIcon iconURL={SoupNonVegIconURL} altText="Soup(nonveg)" isActive={isActive} />,
  "Indian starters(Veg)": (isActive) => <CategoryIcon iconURL={IndianStartersVegIconURL} altText="Indian starters(Veg)" isActive={isActive} />,
  "Indian Starters(nonveg)": (isActive) => <CategoryIcon iconURL={IndianStartersNonVegIconURL} altText="Indian Starters(nonveg)" isActive={isActive} />,
  "Starters(Veg)": (isActive) => <CategoryIcon iconURL={StartersVegIconURL} altText="Starters(Veg)" isActive={isActive} />,
  "Starters(nonveg)": (isActive) => <CategoryIcon iconURL={StartersNonVegIconURL} altText="Starters(nonveg)" isActive={isActive} />,
  "Indian Main Course(Veg)": (isActive) => <CategoryIcon iconURL={IndianMainCourseVegIconURL} altText="Indian Main Course(Veg)" isActive={isActive} />,
  "Indian Main Course(nonveg)": (isActive) => <CategoryIcon iconURL={IndianMainCourseNonVegIconURL} altText="Indian Main Course(nonveg)" isActive={isActive} />,
  "Chef’s special Main course(veg)": (isActive) => <CategoryIcon iconURL={ChefsSpecialMainCourseVegIconURL} altText="Chef’s special Main course(veg)" isActive={isActive} />,
  "Chef’s special Main course(Nonveg)": (isActive) => <CategoryIcon iconURL={ChefsSpecialMainCourseNonVegIconURL} altText="Chef’s special Main course(Nonveg)" isActive={isActive} />,
  "Rajasthani Main Course": (isActive) => <CategoryIcon iconURL={RajasthaniMainCourseIconURL} altText="Rajasthani Main Course" isActive={isActive} />,
  Raita: (isActive) => <CategoryIcon iconURL={RaitaIconURL} altText="Raita" isActive={isActive} />,
  "Indian Breads": (isActive) => <CategoryIcon iconURL={IndianBreadsIconURL} altText="Indian Breads" isActive={isActive} />,
  "Rice(veg)": (isActive) => <CategoryIcon iconURL={RiceVegIconURL} altText="Rice(veg)" isActive={isActive} />,
  "Rice(nonveg)": (isActive) => <CategoryIcon iconURL={RiceNonVegIconURL} altText="Rice(nonveg)" isActive={isActive} />,
  Desserts: (isActive) => <CategoryIcon iconURL={DessertsIconURL} altText="Desserts" isActive={isActive} />,
};

function Menu() {
  const [filters, setFilters] = useState({
    all: true,
    veg: true,
    nonVeg: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(window.innerWidth >= 840);

  // State to track the active category link
  const [activeCategoryName, setActiveCategoryName] = useState(categories[0] || "");
  // Ref for the entire sticky container (toggle + category bar)
  const stickyContainerRef = useRef(null);
  // State to store the calculated scroll offset
  const [scrollOffset, setScrollOffset] = useState(-200); // Initial estimate

  useEffect(() => {
    const handleResize = () => {
        setShowArrows(window.innerWidth >= 840);
        // Recalculate offset on resize
        const navbarHeight = 64; // Adjust if your navbar height changes
        const stickyElementHeight = stickyContainerRef.current?.offsetHeight || 0;
        setScrollOffset(-(navbarHeight + stickyElementHeight));
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation
    // Timeout to recalculate after initial render potentially settles heights
    const timer = setTimeout(handleResize, 100);
    return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timer);
    };
  }, []); // Run on mount and when showArrows logic might change

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
      // We already handle resize for arrows in the other useEffect
      // window.addEventListener("resize", checkScrollArrows);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", checkScrollArrows);
        // window.removeEventListener("resize", checkScrollArrows);
      };
    }
  }, [checkScrollArrows]);

  const handleArrowScroll = (scrollAmount) => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const toggleFilter = (type) => {
    setFilters((prev) => ({
      ...prev, // Keep the previous state of other buttons
      [type]: !prev[type] // Flip the state of the clicked button ('all', 'veg', or 'nonVeg')
    }));
  };

  const handleSetActive = (to) => {
      const categoryName = to.replace('category-', '');
      setActiveCategoryName(categoryName); // Set state for icon styling

      const activeLinkElement = scrollContainerRef.current?.querySelector(`[data-to="${to}"]`);
      if (activeLinkElement && scrollContainerRef.current) {
          activeLinkElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
          });
      }
  };

  const handleSearchScroll = () => {
    // Calculate the necessary offset dynamically
    const navbarHeight = 64; // Adjust if your navbar height changes (h-16)
    const stickyElementHeight = stickyContainerRef.current?.offsetHeight || 0;
    const totalOffset = -(navbarHeight + stickyElementHeight + 20); // Add a small buffer (20px)

    scroller.scrollTo('menu-content-area', { // Target the ID of the menu content div
        duration: 800, // Speed of the scroll (milliseconds)
        delay: 0,      // Delay before starting scroll
        smooth: 'easeInOutQuart', // Type of easing for the scroll animation
        offset: totalOffset       // How far above the target element to stop scrolling
    });
};

const filteredMenu = useMemo(() => {
  let menu = menuData;

  // Filter based on Veg/NonVeg toggles ONLY IF 'All' is OFF
  if (!filters.all) {
      // If BOTH are ON, show everything (same as 'All' being ON, effectively)
      // If NEITHER is ON, show nothing
      if (!filters.veg && !filters.nonVeg) {
          menu = []; // Show no items if neither Veg nor NonVeg is selected and All is off
      }
      // If only ONE is ON, filter by that type
      else if (filters.veg && !filters.nonVeg) {
          menu = menu.filter(item => item.type === "Veg");
      } else if (!filters.veg && filters.nonVeg) {
          menu = menu.filter(item => item.type === "Non-Veg");
      }
      // If both filters.veg and filters.nonVeg are true (and filters.all is false),
      // it means show both, so no additional filtering needed here beyond the initial menuData.
  }
  // If filters.all is TRUE, ignore veg/nonVeg toggles and show everything initially.

  // Apply Search filter (this part remains the same)
  if (searchQuery.trim() !== "") {
    const lowerCaseQuery = searchQuery.toLowerCase();
    // Make sure to filter from the potentially type-filtered list 'menu'
    menu = menu.filter((item) => item.name.toLowerCase().includes(lowerCaseQuery));
  }
  return menu;
}, [filters, searchQuery]);

  // --- Styles ---
  const baseCategoryStyle =
    "h-[7.4rem] px-2 py-2 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative box-border";
  // Only contains general active styles now, border/glow handled by CategoryIcon
  const activeCategoryStyle = "shadow-xl category-active";
  const inactiveCategoryStyle = "bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent";


  return (
    <div className="container mx-auto p-4 sm:p-8 mt-1">

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 px-4 flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a dish..."
          className="w-[70%] p-2 rounded-lg border-4 border-gray-400 text-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button  className=" ml-2 w-[30%] p-2 rounded-lg border-4 border-gray-400 text-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleSearchScroll}>Search</button>
      </motion.div>

      {/* ===== PARENT Sticky Container for Both Bars ===== */}
      {/* Added ref={stickyContainerRef} */}
      <div ref={stickyContainerRef} className="sticky top-0 z-40 bg-white"> {/* Sticks below h-16 (64px) navbar */}

        {/* --- Independent Toggle Buttons --- */}
        {/* ===== Sticky Independent Toggle Buttons ===== */}
      {/* ===== Sticky Independent Toggle Buttons ===== */}
      <div ref={stickyContainerRef} className="z-40 bg-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white pt-2 pb-2 flex justify-center mx-auto w-fit px-3"
        >
          {/* --- Button Group Container --- */}
          <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-full shadow-inner">

            {/* --- ALL Button --- */}
            <button
              // Added: relative overflow-hidden group
              className={`relative overflow-hidden group px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.all
                  ? "bg-white text-blue-600 border-blue-300 shadow-md" // Removed scale-105 for simplicity
                  : "bg-transparent text-gray-600 border-transparent hover:bg-gray-200"
              }`}
              onClick={() => toggleFilter("all")}
            >
              <span className="relative z-10">All</span> {/* Text needs higher z-index */}
              {/* Sliding Border Span */}
              <span className={`
                absolute bottom-0 left-0 h-full w-full rounded-full bg-blue-100 -z-0 // Background element
                transition-transform duration-300 ease-out transform
                ${filters.all ? 'translate-y-0' : 'translate-y-full'} // Slide up when active
              `}></span>
               {/* Underline Span (Optional - can use this or border effect) */}
               <span className={`
                 absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-blue-600 rounded-full
                 transition-all duration-300 ease-out
                 ${filters.all ? 'w-3/4' : 'w-0'} // Expand width when active
               `}></span>
            </button>

            {/* --- VEG Button --- */}
            <button
              // Added: relative overflow-hidden group
              className={`relative overflow-hidden group flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.veg
                  ? "bg-white text-green-600 border-green-300 shadow-md"
                  : "bg-transparent text-gray-600 border-transparent hover:bg-gray-200"
              }`}
              onClick={() => toggleFilter("veg")}
            >
              <span className="relative z-10 flex items-center gap-1"><VegIcon size={18} /> Veg</span> {/* Text/Icon need higher z-index */}
              {/* Sliding Border Span */}
              <span className={`
                absolute bottom-0 left-0 h-full w-full rounded-full bg-green-100 -z-0
                transition-transform duration-300 ease-out transform
                ${filters.veg ? 'translate-y-0' : 'translate-y-full'}
              `}></span>
               {/* Underline Span */}
               <span className={`
                 absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-green-600 rounded-full
                 transition-all duration-300 ease-out
                 ${filters.veg ? 'w-3/4' : 'w-0'}
               `}></span>
            </button>

            {/* --- NON-VEG Button --- */}
            <button
              // Added: relative overflow-hidden group
              className={`relative overflow-hidden group flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                filters.nonVeg
                  ? "bg-white text-red-600 border-red-300 shadow-md"
                  : "bg-transparent text-gray-600 border-transparent hover:bg-gray-200"
              }`}
              onClick={() => toggleFilter("nonVeg")}
            >
              <span className="relative z-10 flex items-center gap-1"><NonVegIcon size={18} /> Non-Veg</span> {/* Text/Icon need higher z-index */}
              {/* Sliding Border Span */}
              <span className={`
                absolute bottom-0 left-0 h-full w-full rounded-full bg-red-100 -z-0
                transition-transform duration-300 ease-out transform
                ${filters.nonVeg ? 'translate-y-0' : 'translate-y-full'}
              `}></span>
               {/* Underline Span */}
               <span className={`
                 absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-red-600 rounded-full
                 transition-all duration-300 ease-out
                 ${filters.nonVeg ? 'w-3/4' : 'w-0'}
               `}></span>
            </button>
          </div>
        </motion.div>
      </div>
      {/* ===== End Toggle Buttons ===== */}
      {/* ===== End Toggle Buttons ===== */}
        {/* --- End Toggle Buttons --- */}

        {/* ===== Category Bar Wrapper (Not Sticky Anymore) ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          // Removed sticky, top-*, mb-12. Added py-2
          className="z-30 bg-white rounded-lg relative h-[8rem] py-2"
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
            {categories.map((category) => {
              const isActive = activeCategoryName === category;
              return (
                <ScrollLink
                  key={category}
                  to={`category-${category}`}
                  data-to={`category-${category}`}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={scrollOffset} // Use calculated offset
                  // Apply activeCategoryStyle conditionally based on state
                  className={`${baseCategoryStyle} ${inactiveCategoryStyle} flex-shrink-0 ${isActive ? activeCategoryStyle : ''}`}
                  // REMOVED activeClass prop
                  onSetActive={handleSetActive}
                >
                  <div className="flex flex-col items-center justify-center text-center gap-0 m-0 p-0">
                    {iconMap[category] ? iconMap[category](isActive) : <div className="w-[65px] h-[60px] mb-1"></div>}
                    <span className="text-xs leading-tight">
                      {category
                        .replace("(veg)", "(V)")
                        .replace("(nonveg)", "(NV)")
                        .replace("(Veg)", "(V)")
                        .replace("(Nonveg)", "(NV)")}
                    </span>
                  </div>
                  {/* Keep the underline, it's styled based on parent class */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[4px] bg-green-600 rounded-full transition-all duration-300 ease-out underline-indicator"></span>
                </ScrollLink>
              );
            })}
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
        {/* ===== END Category Bar ===== */}

      </div> {/* ===== END PARENT Sticky Container ===== */}


      {/* No Results */}
      {filteredMenu.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
          <p className="text-xl font-semibold text-gray-700">No items found</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </motion.div>
      )}

      {/* Menu Items */}
      {filteredMenu.length > 0 && (
        // Add padding-top to account for the height of the entire sticky container
        <div id="menu-content-area" className="space-y-12 pt-4"> {/* Added pt-4, adjust as needed */}
          {categories.map((category) => {
            const itemsInCategory = filteredMenu.filter((item) => item.category === category);
            if (itemsInCategory.length === 0) return null;
            return (
              <motion.section
                key={category}
                id={`category-${category}`}
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