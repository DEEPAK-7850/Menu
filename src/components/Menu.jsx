import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { menuData, categories } from "../data/menuData"; // Ensure menuData.js uses the final categories
import { motion, AnimatePresence } from "framer-motion";
import { VegIcon, NonVegIcon } from "../data/Icons"; // Ensure Icons.jsx exists
import { Link as ScrollLink, scroller } from "react-scroll";


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

// --- Search Icon ---
const SearchIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);
// --- Microphone Icon ---
const MicrophoneIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
       <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0A7.001 7.001 0 009 14.93V17h4v-2.07zm-2 2.07l-2 2a1 1 0 001.414 1.414L10 16.414l.586.586a1 1 0 001.414-1.414l-2-2z" clipRule="evenodd" />
    </svg>
);
// --- Clear (X) Icon ---
const XIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
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
  // Use a single state for the active filter: 'All', 'Veg', or 'Non-Veg'
  const [activeFilter, setActiveFilter] = useState("All"); // Start with 'All' active 
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(window.innerWidth >= 840);

  // State to track the active category link
  const [activeCategoryName, setActiveCategoryName] = useState(categories[0] || "");
  // Ref for the entire sticky container (toggle + category bar)
  const stickyContainerRef = useRef(null);
  // State to store the calculated scroll offset
  const [scrollOffset, setScrollOffset] = useState(-200); // Initial estimate

  const handleFilterClick = (type) => {
    setActiveFilter((prevFilter) => {
      // If clicking the button that is already active...
      if (prevFilter === type) {
        // ...then switch back to 'All'.
        return "All";
      } else {
        // Otherwise, switch to the button that was clicked.
        return type;
      }
    });
  };

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

  const handleSearchScroll = (e) => { // Accept the event object 'e'
    e.preventDefault(); // <-- Add this to prevent page reload

    // Calculate the necessary offset dynamically
    const navbarHeight = 64; // Adjust if your navbar height changes (h-16)
    const stickyElementHeight = stickyContainerRef.current?.offsetHeight || 0;
    const totalOffset = -(navbarHeight + stickyElementHeight + 20); // Add a small buffer (20px)

    scroller.scrollTo('menu-content-area', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: totalOffset
    });
};

const filteredMenu = useMemo(() => {
  let menu = menuData; // Start with all data

  // 1. Apply Type filter (All/Veg/Non-Veg) based on 'activeFilter' state
  if (activeFilter === 'Veg') {
    menu = menu.filter(item => item.type === 'Veg');
  } else if (activeFilter === 'Non-Veg') {
    menu = menu.filter(item => item.type === 'Non-Veg');
  }
  // If 'All', menu remains unfiltered by type

  // --- THIS IS THE SEARCH LOGIC ---
  // 2. Apply Search filter if searchQuery is not empty
  if (searchQuery.trim() !== "") { // Check if search box has non-whitespace text
    const lowerCaseQuery = searchQuery.toLowerCase(); // Convert search term to lowercase for case-insensitive matching
    // Filter the *current* list ('menu')
    menu = menu.filter((item) =>
      // Convert item name to lowercase and check if it includes the search term
      item.name.toLowerCase().includes(lowerCaseQuery)
    );
  }
  // --- END OF SEARCH LOGIC ---

  return menu; // Return the final filtered list
}, [activeFilter, searchQuery]); // Re-run this logic if filter or search query changes // Depends on the single activeFilter state now

  // --- Styles ---
  const baseCategoryStyle =
    "h-[7.4rem] px-2 py-2 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative box-border";
  // Only contains general active styles now, border/glow handled by CategoryIcon
  const activeCategoryStyle = "shadow-xl category-active";
  const inactiveCategoryStyle = "bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent";


  return (
    <div className="container mx-auto p-4 sm:p-8 mt-1">

     {/* ===== YouTube Style Search Bar ===== */}
     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 px-4">
        {/* Use onSubmit to handle search action */}
        <form onSubmit={handleSearchScroll} className="flex max-w-2xl w-full mx-auto">
          {/* Main Search Input Container */}
          <div className="relative flex-grow flex items-center border border-gray-300 dark:border-gray-700 rounded-l-full focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200 ease-in-out shadow-sm">
            <input
              ref={inputRef} // Make sure: const inputRef = useRef(null); exists in your component
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a dish..."
              className="flex-grow py-2 pl-6 pr-10 text-lg rounded-l-full focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Search"
            />
            {/* Clear button (visible when there's text) */}
            {searchQuery && (
              <button
                type="button" // Prevents form submission
                onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Clear search"
              >
                {/* Ensure XIcon component is defined/imported */}
                <XIcon />
              </button>
            )}
          </div>

          {/* Search Button (Triggers scroll via form onSubmit) */}
          <button
            type="submit" // Submits the form
            className="flex items-center justify-center w-16 px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
            aria-label="Perform search and scroll to menu"
            // Removed onClick={handleSearchScroll} - onSubmit handles it
          >
            {/* Ensure SearchIcon component is defined/imported */}
            <SearchIcon />
          </button>
        </form>
      </motion.div>
      {/* ===== END Search Bar ===== */}

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
            {/* --- Button Group Container --- */}
            {/* --- Button Group Container (Needs 'relative') --- */}
            <div className="relative flex items-center gap-3 bg-gray-200 p-1 rounded-full shadow-inner w-fit mx-auto">

              {/* --- Sliding Background Element --- */}
              <div
                className={`absolute top-1 left-1 h-[calc(100%-8px)] w-34 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out transform
  ${activeFilter === 'Veg' ? 'translate-x-[calc(100%+12px)]' : // Position for Veg (w-28 + gap-3 approx 12px)
                    activeFilter === 'Non-Veg' ? 'translate-x-[calc(200%+24px)]' : // Position for Non-Veg (2*w-28 + 2*gap)
                      'translate-x-0' // Position for All
                  }`}
              /> {/* Note: Slider div is self-closing or empty */}

              {/* --- ALL Button --- */}
              <button
                // Added relative z-10
                // Inactive state is bg-transparent
                // Active state REMOVES bg-white, uses text color
                className={`relative z-10 flex items-center justify-center gap-1 w-34 px-5 py-5 rounded-full text-lg font-bold border-4 transition-colors duration-300 focus:outline-none ${activeFilter === "All"
                    ? "text-blue-600 border-blue-400 bg-blue-200" // Active: No bg needed (slider provides), border transparent
                    : "bg-transparent text-gray-500 border-transparent hover:text-gray-700" // Inactive: Transparent bg/border
                  }`}
                onClick={() => handleFilterClick("All")}
              >
                All {/* Button text content */}
              </button>

              {/* --- VEG Button --- */}
              <button
                // Added relative z-10
                // Inactive state is bg-transparent
                className={`relative z-10 flex items-center justify-center gap-1 w-34 px-5 py-6 rounded-full text-sm font-bold border-4 transition-colors duration-300 focus:outline-none ${ // Added justify-center
                  activeFilter === "Veg"
                    ? "text-green-600 border-green-400 bg-green-100 shadow-md" // Active: Green text, green border, shadow. NO bg-white.
                    : "bg-transparent text-gray-500 border-transparent hover:text-gray-700" // Inactive: Transparent bg/border
                }`}
                onClick={() => handleFilterClick("Veg")}
              >
                <VegIcon size={18} /> Veg
              </button>

              {/* --- NON-VEG Button --- */}
              <button
                // Added relative z-10
                // Inactive state is bg-transparent
                className={`relative z-10 flex items-center justify-center gap-1 w-34 px-2 py-6 rounded-full text-sm font-bold border-4 transition-colors duration-300 focus:outline-none ${activeFilter === "Non-Veg"
                    ? "text-red-600 border-red-400 bg-red-100" // Active: No bg needed, border transparent
                    : "bg-transparent text-gray-500 border-transparent hover:text-gray-700" // Inactive: Transparent bg/border
                  }`}
                onClick={() => handleFilterClick("Non-Veg")}
              >
                <NonVegIcon size={18} /> Non-Veg
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
            className={`absolute top-0 left-0 z-40 h-full px-2 flex items-center justify-center text-gray-700 transition-opacity duration-300 ${showArrows ? "flex" : "hidden"
              } ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <span className="bg-white rounded-full p-1 shadow-md border border-gray-200">
              <ArrowLeftIcon />
            </span>
          </button>

          <div
            ref={scrollContainerRef}
            className={`flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start pt-1 category-scrollbar ${showArrows ? "px-12" : "px-4"
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
            className={`absolute top-0 right-0 z-40 h-full px-2 flex items-center justify-center transition-opacity duration-300 ${showArrows ? "flex" : "hidden"
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