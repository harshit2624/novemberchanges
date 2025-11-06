import React, { useState, useEffect, useRef } from "react";
import { connect, styled } from "frontity";
import Link from "./link";
import { getCart, removeCartItem, removeFromCart, getWishlist, getWpBaseUrl } from "../utils";
import axios from "axios";
import Sidebar from "./sidebar";

const Header = ({ state, actions }) => {
  const { headerBg } = state.theme.colors;
  const [cartItems, setCartItems] = useState([]);
  // const [cartData, setcartData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [subtotal, setSubtotal] = useState("₹0.00");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [token, setToken] = useState(null);
  const [Mobile, setMobile] = useState(false);
  const [isProductPage, setisProductPage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { link } = state.router;

  // Refs for click outside detection
  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const sidebarRef = useRef(null);

  const closeSearch = () => {
    setShowSearchResults(false);
    setQuery("");
    setResults([]);
    setMatchedCategories([]);
    setSearchPerformed(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (window?.innerWidth <= 767 && link?.includes('product')) {
      setMobile(true);
      setisProductPage(true);
    } else {
      setMobile(false);
      setisProductPage(false);
    }
  }, [link]);

  useEffect(() => {
    const loadCart = async () => {
      const storedToken = localStorage.getItem("jwt_token");
      setToken(storedToken);

      if (storedToken && storedToken.split(".").length === 3) {
        // ✅ Logged-in user cart
        const cartData = await getCart();
        if (cartData && cartData.items) {
          setCartItems(cartData.items);
          setCartCount(cartData.count);
          setSubtotal(cartData.cart_total);
        }
      } else {
        // ✅ Guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        setCartItems(guestCart);

        // Count items and subtotal manually
        const guestCount = guestCart.reduce((acc, item) => acc + item.quantity, 0);
        const guestSubtotal = guestCart.reduce((acc, item) => {
          const priceNum = parseFloat(
            (item.price || "0").toString().replace(/[^0-9.]/g, "")
          );
          return acc + priceNum * item.quantity;
        }, 0);

        setCartCount(guestCount);
        setSubtotal(guestSubtotal.toFixed(2));
      }
    };

    // Call on mount
    loadCart();

    // Listen for cart changes
    window.addEventListener("userLoggedIn", loadCart);
    window.addEventListener("userLoggedOut", loadCart);
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("userLoggedIn", loadCart);
      window.removeEventListener("userLoggedOut", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  // Header data fetch (separate useEffect)
  useEffect(() => {
    fetch("https://www.croscrow.com/a/wp-json/theme/v1/header")
      .then((res) => res.json())
      .then((data) => {
        setHeaderData(data);
        localStorage.setItem('headerData', JSON.stringify(data));
      })
      .catch((e) => console.error("Header fetch error:", e));

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://www.croscrow.com/a/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5&consumer_secret=cs_14996e7e8eed396bced4ac30a0acfd9fea836214");
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }

      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    const handleScroll = () => {
      setShowCart(false);
      closeSearch();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSidebarOpen]);

  const handleCartClick = () => {
    setShowCart(!showCart)
  }

  const handleRemove = async (cartItemKey) => {
    const success = await removeCartItem(state, cartItemKey);
    if (success) {
      const updatedCart = await getCart();
      setCartItems(updatedCart.items);
      setCartCount(updatedCart.count);
      setSubtotal(updatedCart.subtotal);
    }
  };

  const parsePrice = (html) => {
    if (!html) return "";
  
    const div = document.createElement("div");
    div.innerHTML = html;
  
    const oldPrice = div.querySelector("del");
    const newPrice = div.querySelector("ins");
    const normalPrice = div.querySelector(".woocommerce-Price-amount");
  
    if (oldPrice && newPrice) {
      // Discounted case
      return {
        oldPrice: oldPrice.textContent.trim(),
        newPrice: newPrice.textContent.trim(),
      };
    } else if (normalPrice) {
      // No discount case
      return {
        oldPrice: null,
        newPrice: normalPrice.textContent.trim(),
      };
    }
  
    return { oldPrice: null, newPrice: "" };
  };  

  const stripHTML = (priceHtml) => {
    const { oldPrice, newPrice } = parsePrice(priceHtml);
  
    return (
      <div>
        {oldPrice ? (
          <>
            <span style={{ textDecoration: "line-through", marginRight: "8px" }}>
              {oldPrice}
            </span>
            <span>{newPrice}</span>
          </>
        ) : (
          <span>{newPrice}</span>
        )}
      </div>
    );
  };
  
  // ───── Wishlist ─────
  useEffect(() => {
    const loadWish = () => setWishlist(getWishlist());
    loadWish();
    window.addEventListener("wishlistUpdated", loadWish);
    return () => window.removeEventListener("wishlistUpdated", loadWish);
  }, []);

  const trackSearch = (searchQuery, clickedItemId = null, itemType = null) => {
    axios.post(`${getWpBaseUrl(state)}/wp-json/search-tracker/v1/track`, {
      search_query: searchQuery,
      clicked_item_id: clickedItemId,
      item_type: itemType,
    }).catch(error => {
      console.error("Error tracking search:", error);
    });
  };

  // ───── Search Logic ─────
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchPerformed(false);
      setIsSearching(false);
      setShowSearchResults(false);
      setMatchedCategories([]);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    trackSearch(searchQuery);

    // Find matching categories
    const matches = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    setMatchedCategories(matches);

    try {
      const res = await fetch(
        `https://www.croscrow.com/a/wp-json/wc/v3/products?search=${encodeURIComponent(
          searchQuery
        )}&consumer_key=ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5&consumer_secret=cs_14996e7e8eed396bced4ac30a0acfd9fea836214`
      );
      const data = await res.json();
      setResults(data);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setSearchPerformed(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    await performSearch(query);
  };

  // Debounced search on input change
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, 300); // 300ms delay
  };

  // Handle search input click
  const handleSearchInputClick = () => {
    setShowSearchResults(true);
    // If there's already a query and results, show them
    if (query.trim() && (results.length > 0 || searchPerformed)) {
      // Results are already available, just show them
      return;
    }
    // If there's a query but no search has been performed yet, perform search
    if (query.trim() && !searchPerformed) {
      performSearch(query);
    }
  };
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ───── UI ─────
  return (
    <>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      </div>
      <PageHeader bg={headerBg} id="site-header">
        <HeaderInner>
          {headerData && (
            <HeaderTop>
              <Link link="/">
                <Logo src={headerData.logo} alt={headerData.site_title} />
              </Link>
            </HeaderTop>
          )}

          <HeaderNavigationWrapper ref={searchRef}>
            {!Mobile && !isProductPage && <SearchForm onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <SearchInput
                value={query}
                onChange={handleQueryChange}
                onClick={handleSearchInputClick}
                placeholder="FIND YOUR DRIP"
              />
              <SearchButton type="submit" disabled={isSearching}>
                {isSearching ? (
                  <LoadingSpinner />
                ) : (
                  <svg fill="#fff" height="20px" width="20px" version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488.4 488.4"
                    stroke="#fff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                )}
              </SearchButton>
            </SearchForm>}

            {(showSearchResults && (searchPerformed || isSearching)) && (
              <ResultList>
                {matchedCategories.map((category) => (
                  <CategoryTile key={category.id} onClick={() => trackSearch(query, category.id, 'category')}>
                    <Link link={`/product-category/${category.slug}/`} onClick={closeSearch}>
                      <img src={headerData.logo} alt="logo" />
                      <span>View all {category.name}</span>
                      <span>&rarr;</span>
                    </Link>
                  </CategoryTile>
                ))}
                <div className="searchGrid">
                  {isSearching ? (
                    <LoadingContainer>
                      <LoadingSpinner />
                      <p>Searching...</p>
                    </LoadingContainer>
                  ) : results.length > 0 ? (
                    results.map((product) => (
                      <li key={product.id} onClick={() => trackSearch(query, product.id, 'product')}>
                        <Link link={`/product/${product.slug}`} onClick={closeSearch}>
                          <img src={product.images[0]?.src} alt={product.name} width="40" />
                          {product.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <p className="no-results" style={{ marginTop: "1rem", color: "#777" }}>
                      No result found.
                    </p>
                  )}
                </div>
              </ResultList>
            )}
          </HeaderNavigationWrapper>

          {/* CART + WISHLIST ICONS */}
          <div className="accountIcon" style={{ display: "flex", alignItems: "center" }}>
            <WishlistWrapper>
              <Link link="/wishlist">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="30"
                  height="30"
                  fill="none"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-.06.06a5.5 5.5 0 0 0-7.78 7.78l.06.06L12 21.8l7.78-7.78.06-.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
                {wishlist.length > 0 && <WishlistCount>{wishlist.length}</WishlistCount>}
              </Link>
            </WishlistWrapper>

            <CartWrapper ref={cartRef} onClick={() => handleCartClick()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3h2l2.5 10.5h11.5l2-6H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>

              {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
              {showCart && (
                <CartDropdown>
                  <div className="cartItems">
                    {cartItems.length === 0 && <EmptyCart>Cart is empty</EmptyCart>}
                    {cartItems.map((it) => (
                      <CartItem key={it.cart_item_key}>
                        {it.image && <CartImage src={it.image} alt={it.name} />}
                        <div>
                          <Link
                            link={
                              it.permalink
                                ? new URL(it.permalink, window.location.origin).pathname
                                : "#"
                            }
                          >
                            <strong>{it.name}</strong>
                          </Link>

                          <div className="cartItemPrice" style={{ marginTop: 4 }}>
                            {stripHTML(it.price)} × {it.quantity} &nbsp;=&nbsp; {stripHTML(it.total)}
                          </div>
                        </div>
                        <RemoveButton onClick={() => handleRemove(it.cart_item_key)}>×</RemoveButton>
                      </CartItem>
                    ))}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="SubtotalDetails">
                      <Subtotal>
                        <strong>Subtotal:</strong><br />
                        {stripHTML(subtotal)}
                      </Subtotal>
                      <CheckoutNote>
                        Shipping, taxes, and discounts calculated at checkout.
                      </CheckoutNote>
                      <StyledLink link="/cart">View Cart</StyledLink>
                    </div>
                  )}
                </CartDropdown>
              )}
            </CartWrapper>
            <SidebarButton onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </SidebarButton>
          </div>
        </HeaderInner>
      </PageHeader>
    </>
  );
};

export default connect(Header);

// ─── Styled Components ───
const PageHeader = styled.header`position: relative; background: ${(p) => p.bg}; z-index: 1;`;
const HeaderTop = styled.div`display: flex; align-items: center; gap: 1rem; padding: 1rem 2rem;`;
const Logo = styled.img`height: 50px; width: auto;`;
const HeaderInner = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 2.8rem 0; max-width: 168rem; margin: 0 auto;
  @media (min-width: 700px) { width: calc(100% - 8rem); }
`;
const HeaderNavigationWrapper = styled.div`
  display: none;
  position: relative;
  @media (min-width: 1000px) { display: flex; align-items: center; }
`;
const CartWrapper = styled.div`position: relative; margin-left: 1rem; cursor: pointer;`;
const CartCount = styled.span`
  background: red; color: #fff; border-radius: 50%;
  font-size: 0.75rem; width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  position: absolute; top: -6px; right: -10px;
`;
const CartDropdown = styled.div`
  position: absolute; top: 36px; right: 0; background: #fff; border: 1px solid #ddd;
  padding: 1rem; width: 280px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 1000;
`;
const CartItem = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;
`;
const CartImage = styled.img`
  width: 48px; height: 48px; object-fit: cover; border-radius: 4px; margin-right: 0.75rem;
`;
const RemoveButton = styled.button`
  background: none; border: none; color: #f00; cursor: pointer; font-size: 1.3rem; margin-left: 0.5rem;
`;
const Subtotal = styled.div`border-top: 1px solid #ddd; margin-top: 0.5rem; padding-top: 0.5rem;`;
const CheckoutNote = styled.div`font-size: 0.75rem; color: #777; margin-top: 0.3rem 0 0.8rem;`;
const StyledLink = styled(Link)`
  display: block; text-align: center; background: #000; color: #fff; padding: 0.5rem; text-decoration: none;
  &:hover { background: #333; }
`;
const WishlistWrapper = styled.div`position: relative; margin-left: 1rem; cursor: pointer;`;
const WishlistCount = styled.span`
  background: #ff4081; color: #fff; border-radius: 50%; font-size: 0.75rem;
  width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  position: absolute; top: -6px; right: -10px;
`;
const EmptyCart = styled.div`padding: 1rem; text-align: center; color: #777;`;

const SearchInput = styled.input`
  width: 70%; padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem; margin-left: 1rem; background: #000; color: white; border: none; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  margin: 0;
  padding: 1rem;
  list-style: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  li { 
    margin-bottom: 0.75rem; 
    display: flex; 
    align-items: center; 
    gap: 1rem;
    &:last-child { margin-bottom: 0; }
  }
`;

const CategoryTile = styled.div`
  background: #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    text-decoration: none;
    font-weight: bold;
  }
  img {
    height: 30px;
    width: auto;
    margin-right: 1rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #777;
  
  p {
    margin: 0;
  }
`;

const SidebarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
`;