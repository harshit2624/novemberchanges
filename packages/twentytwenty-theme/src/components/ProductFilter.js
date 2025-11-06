// components/ProductFilter.js
import React, { useState, useEffect } from "react";
import { getWpBaseUrl, consumer_key, consumer_secret } from "../utils";
import { connect } from "frontity";

let persistentCategoryFilter = "all";

const ProductFilter = ({
    state,
    actions,
    onFilterChange,
    totalProducts,
    filteredProducts,
    allSizes,
    showCategoryFilter = true,
    currentCategoryId = null,
}) => {
    const [categoryFilter, setCategoryFilter] = useState(persistentCategoryFilter);
    const [FilterShow, setFilterShow] = useState(window.innerWidth > 992); // Changed to false by default for mobile
    const [priceFilter, setPriceFilter] = useState("default");
    const [sizeFilter, setSizeFilter] = useState("all");
    const [showSortBy, setShowSortBy] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [viewType, setViewType] = useState("grid");

    // Check if mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setFilterShow(window.innerWidth > 992);
        };

        // Run once on mount
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRes = await fetch(
                    `${getWpBaseUrl(state)}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
                );
                const categories = await categoryRes.json();
                setAvailableCategories(categories);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };

        fetchCategories();
    }, [state]);

    // Handle category change - Modified version
    const updateCategoryFilter = (value) => {
        persistentCategoryFilter = value;
        setCategoryFilter(value);
    };

    useEffect(() => {
        const currentCategory = getCurrentCategoryFromUrl();
        if (currentCategory !== categoryFilter) {
            persistentCategoryFilter = currentCategory;
            setCategoryFilter(currentCategory);
        }
    }, [state.router.link]); 

    const getCurrentCategoryFromUrl = () => {
        const currentPath = state.router.link;
        
        // Map URL paths to category names
        const urlToCategoryMap = {
            '/product-category/tshirts/': 'tshirt',
            '/product-category/shirts/': 'shirt', 
            '/product-category/cargos/': 'cargo',
            '/product-category/dress/': 'jeans', // Since jeans maps to dress page
            '/view-all/': 'all' // If you have a view-all page
        };
        
        // Check if current path matches any category URL
        for (const [url, category] of Object.entries(urlToCategoryMap)) {
            if (currentPath.includes(url)) {
                return category;
            }
        }
        
        // Default to 'all' if no match found
        return 'all';
    };

    // Modified handleCategoryChange
    const handleCategoryChange = (category) => {
        updateCategoryFilter(category);
    
        // Define category URL mappings
        const categoryUrls = {
            'tshirt': '/product-category/tshirts/',
            't-shirt': '/product-category/tshirts/',
            'shirt': '/product-category/shirts/',
            'cargo': '/product-category/cargos/',
            'jeans': '/product-category/jeans/',
            'dress': '/product-category/dress/'
        };
    
        // If a specific category is selected, redirect to its page
        if (category !== "all" && categoryUrls[category.toLowerCase()]) {
            actions.router.set(categoryUrls[category.toLowerCase()]);
            return;
        }
    
        // For "all" category, you might want to redirect to view-all page
        if (category === "all") {
            actions.router.set('/view-all/products/'); // Adjust this path as needed
            return;
        }
    
        // Fallback filter logic (if not redirecting)
        let targetCategoryId = null;
        if (category !== "all") {
            const categoryObj = availableCategories.find(
                (cat) =>
                    cat.name.toLowerCase() === category.toLowerCase() ||
                    cat.slug.toLowerCase() === category.toLowerCase()
            );
            if (categoryObj) {
                targetCategoryId = categoryObj.id;
            }
        }
    
        onFilterChange({
            type: "category",
            value: category,
            categoryId: targetCategoryId,
        });
    
        if (isMobile) {
            setFilterShow(false);
        }
    };

    // Handle price filter change
    const handlePriceChange = (price) => {
        setPriceFilter(price);
        onFilterChange({
            type: 'price',
            value: price
        });
    };

    // Handle size filter change
    const handleSizeChange = (size) => {
        setSizeFilter(size);
        onFilterChange({
            type: 'size',
            value: size
        });
    };

    const handleViewTypeChange = (type) => {
        setViewType(type);
        onFilterChange({
            type: 'viewType',
            value: type
        });
    };

    return (
        <>
            <div className="filter-bar">
                {/* Filter toggle button */}
                <button
                    className="sort-toggle-btn"
                    onClick={() => setFilterShow(!FilterShow)}
                >
                    <div className="sortIcon" style={{ display: "flex", alignItems: "center" }}>
                        <span className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <line x1="3" y1="6" x2="14" y2="6" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="12" x2="10" y2="12" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="18" x2="7" y2="18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        {isMobile && <span className="filter-text">Filter & Sort</span>}
                    </div>
                </button>
                {/* Filter Panel - Desktop inline, Mobile dropdown */}
                {showCategoryFilter && (
                    <div className={`filter-panel ${FilterShow ? "open" : ""} ${isMobile ? "mobile" : "desktop"}`}>
                        {/* Category filters */}
                        <div className="category-filters">
                            <div className="filter-section">
                                {isMobile && <h4 className="filter-title">Categories</h4>}
                                <div className="category-buttons">
                                    <button
                                        className={`category-btn ${categoryFilter === "all" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("all")}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`category-btn ${categoryFilter === "shirt" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("shirt")}
                                    >
                                        Shirt
                                    </button>
                                    <button
                                        className={`category-btn ${categoryFilter === "tshirt" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("tshirt")}
                                    >
                                        T-Shirt
                                    </button>
                                    <button
                                        className={`category-btn ${categoryFilter === "cargo" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("cargo")}
                                    >
                                        Cargo
                                    </button>
                                    <button
                                        className={`category-btn ${categoryFilter === "jeans" ? "active" : ""}`}
                                        onClick={() => handleCategoryChange("jeans")}
                                    >
                                        Jeans
                                    </button>
                                </div>
                            </div>

                            {/* Sort options */}
                            <div className="sort-section">
                                {isMobile && <h4 className="filter-title">Sort Options</h4>}
                                <div className="sort-controls">
                                    <div className="filter-dropdown">
                                        <select
                                            value={priceFilter}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                        >
                                            <option value="default">By Range</option>
                                            <option value="price-asc">Low to High</option>
                                            <option value="price-desc">High to Low</option>
                                        </select>
                                    </div>

                                    <div className="filter-dropdown">
                                        <select
                                            value={sizeFilter}
                                            onChange={(e) => handleSizeChange(e.target.value)}
                                        >
                                            <option value="all">By Sizes</option>
                                            {allSizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products count info */}
                <div className="products-info">
                    <p style={{ margin: "0", fontSize: "13px" }}>
                        Showing {filteredProducts.length} of {totalProducts}
                    </p>
                </div>
                {isMobile && (
                    <div className="view-toggle" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <button
                            className={viewType === "grid" ? "active" : ""}
                            onClick={() => handleViewTypeChange("grid")}  // CHANGED THIS LINE
                            aria-label="Grid View"
                        >
                            {/* Grid SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7" rx="1" fill={viewType === "grid" ? "#000" : "none"} stroke="#000" />
                                <rect x="14" y="3" width="7" height="7" rx="1" fill={viewType === "grid" ? "#000" : "none"} stroke="#000" />
                                <rect x="3" y="14" width="7" height="7" rx="1" fill={viewType === "grid" ? "#000" : "none"} stroke="#000" />
                                <rect x="14" y="14" width="7" height="7" rx="1" fill={viewType === "grid" ? "#000" : "none"} stroke="#000" />
                            </svg>
                        </button>
                        <button
                            className={viewType === "list" ? "active" : ""}
                            onClick={() => handleViewTypeChange("list")}
                            aria-label="List View"
                        >
                            {/* List SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <line x1="8" y1="6" x2="21" y2="6" stroke="#000" strokeWidth="2" />
                                <line x1="8" y1="12" x2="21" y2="12" stroke="#000" strokeWidth="2" />
                                <line x1="8" y1="18" x2="21" y2="18" stroke="#000" strokeWidth="2" />
                                <rect x="3" y="4" width="2" height="4" fill="#000" />
                                <rect x="3" y="10" width="2" height="4" fill="#000" />
                                <rect x="3" y="16" width="2" height="4" fill="#000" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>


            {/* Mobile overlay */}
            {isMobile && FilterShow && <div className="filter-overlay" onClick={() => setFilterShow(false)} />}

            <style jsx>{`
                .filter-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 12px;
                    min-height: 50px;
                    position: sticky;
                    top: 0;
                    background: #fff;
                    z-index: 99;
                }

                .sort-toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    color: #000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .filter-text {
                    font-size: 14px;
                }

                /* Desktop Filter Panel */
                .filter-panel.desktop {
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .filter-panel.desktop.open {
                    opacity: 1;
                    max-height: 200px;
                    transform: translateY(0);
                }

                .filter-panel.desktop .category-filters {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .filter-panel.desktop .category-buttons {
                    display: flex;
                    gap: 30px;
                }

                .filter-panel.desktop .sort-controls {
                    display: flex;
                    gap: 20px;
                }

                /* Mobile Filter Panel */
                .filter-panel.mobile {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 300px;
                    height: 100vh;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                    padding: 20px;
                }

                .filter-panel.mobile.open {
                    right: 0;
                }

                .filter-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    opacity: 0;
                    animation: fadeIn 0.3s ease forwards;
                }

                .filter-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 15px 0;
                    color: #333;
                }

                /* Mobile category buttons */
                .filter-panel.mobile .category-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .filter-panel.mobile .category-btn {
                    text-align: left;
                    padding: 8px 16px;
                    border: 1px solid #e5e5e5;
                    border-radius: 4px;
                    background: white;
                    font-size: 12px;
                    transition: all 0.2s ease;
                }

                .filter-panel.mobile .category-btn.active {
                    background: #000;
                    color: white;
                    border-color: #000;
                }

                .filter-panel.mobile .category-btn:hover {
                    border-color: #000;
                }

                /* Mobile sort controls */
                .filter-panel.mobile .sort-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .filter-panel.mobile .filter-dropdown select {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    background: white;
                    border: 1px solid #e5e5e5;
                }

                /* Desktop styles */
                .category-btn {
                    cursor: pointer;
                    transition: 0.2s ease;
                    font-size: 13px;
                    background: transparent;
                    border: none;
                    padding: 8px 0;
                }

                .filter-panel.desktop .category-btn.active {
                    border-bottom: 1px solid #000;
                    font-weight: 600;
                }

                .filter-dropdown select {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 13px;
                }

                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                    }
                    to   { 
                        opacity: 1; 
                    }
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .filter-bar {
                        margin-bottom: 16px;
                        position: unset;
                    }
                    
                    .products-info p {
                        font-size: 12px;
                    }

                    .sort-section {
                        margin-top: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .filter-panel.mobile {
                        width: 280px;
                    }
                }
            `}</style>
        </>
    );
};

export default connect(ProductFilter);