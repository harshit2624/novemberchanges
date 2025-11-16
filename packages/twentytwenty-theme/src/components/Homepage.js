import React, { useEffect, useState, useCallback } from "react";
import { connect } from "frontity";
import {
  toggleWishlist,
  getWishlist,
  getWpBaseUrl,
  isInWishlist,
  showToast,
  consumer_key,
  consumer_secret
} from "../utils";
import Loading from "./loading";
import Link from "@frontity/components/link";

const Homepage = ({ state, libraries, actions }) => {
  const data = state.source.get(state.router.link);

  const Html2React = libraries.html2react.Component;

  const [bestSellingHtml, setBestSellingHtml] = useState(""); // store API products as HTML
  const [categoryProducts, setCategoryProducts] = useState([]); // store category 146 products
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allCoupons, setAllCoupons] = useState([]);
  const [saleSettings, setSaleSettings] = useState(null);

  const parsePriceHtml = useCallback((product, html) => {
    // Use DOMParser to decode HTML entities
    const decodeHtml = (htmlString) => {
      if (!htmlString) return "";
      const parser = new DOMParser();
      const decoded = parser.parseFromString(htmlString, "text/html").documentElement?.textContent || "";

      // Remove trailing ".00" if present
      const cleaned = decoded.replace(/\.00$/, "");
      return cleaned.trim();
    };

    // For variable products: keep full price range (e.g., "₹1,499.00 – ₹1,799.00")
    if (product.type === "variable" && !product?.on_sale) {
      return {
        regularPrice: null,
        salePrice: null,
        onlyPrice: decodeHtml(html),
      };
    }

    // For simple or sale products
    const div = document.createElement("div");
    div.innerHTML = html;

    const del = div.querySelector("del");
    const ins = div.querySelector("ins");

    if ((del && ins) || product?.on_sale) {
      return {
        regularPrice: del ? decodeHtml(del.textContent) : null,
        salePrice: ins ? decodeHtml(ins.textContent) : null,
        onlyPrice: null,
      };
    }

    const priceText = decodeHtml(div.textContent);
    const priceMatches = priceText.match(/₹[\d,]+(?:\.\d+)?/g);

    if (priceMatches?.length === 2 || product?.on_sale) {
      return {
        regularPrice: priceMatches[0],
        salePrice: priceMatches[1],
        onlyPrice: null,
      };
    }

    return {
      regularPrice: null,
      salePrice: null,
      onlyPrice: priceText,
    };
  }, []);

  // Fetch all data in parallel
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setIsLoading(true);
      
      try {
        const [bestSellingRes, categoryRes, saleRes, couponsRes] = await Promise.all([
          fetch("https://www.croscrow.com/a/wp-json/wc/v3/products/?category=140&per_page=15"),
          fetch(`https://www.croscrow.com/a/wp-json/wc/v3/products/?category=146&per_page=8`),
          fetch(`${getWpBaseUrl(state)}/wp-json/scs/v1/settings`),
          fetch(`${getWpBaseUrl(state)}/wp-json/wc/v3/coupons?per_page=100&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`)
        ]);

        const [bestSellingProducts, categoryProducts, saleSettings, coupons] = await Promise.all([
          bestSellingRes.json(),
          categoryRes.json(),
          saleRes.json(),
          couponsRes.json()
        ]);

        // Process best selling products
        if (Array.isArray(bestSellingProducts)) {
          const productItems = bestSellingProducts
            .map(
              (p) => `
              <li class="wc-block-product custom-product-item">
                <a href="/product/${p.slug}" class="custom-product-link">
                  <div class="custom-product-image">
                    <img src="${p.images?.[0]?.src || ""}" alt="${p.name}" loading="lazy" />
                  </div>
                  <h3 class="custom-product-title">${p.name}</h3>
                </a>
              </li>
            `
            )
            .join("");
          setBestSellingHtml(productItems);
        }

        // Process other data
        if (Array.isArray(categoryProducts)) {
          setCategoryProducts(categoryProducts);
        }
        if (saleSettings) {
          setSaleSettings(saleSettings);
        }
        if (Array.isArray(coupons)) {
          setAllCoupons(coupons);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [state]);

  // Handle add to cart & wishlist button clicks
  useEffect(() => {
    const handleClick = (e) => {
      const cartBtn = e.target.closest(".add_to_cart_button");
      const wishBtn = e.target.closest(".wishlist_button");

      if (cartBtn) {
        e.preventDefault();
        const productId = cartBtn.getAttribute("data-product_id");

        // Find product slug from categoryProducts or fetch it
        const product = categoryProducts.find(p => p.id.toString() === productId);
        if (product) {
          // Navigate to product detail page
          actions.router.set(`/product/${product.slug}`);
        } else {
          // Fallback: navigate using product ID (you might need to adjust the URL structure)
          actions.router.set(`/product/${productId}`);
        }
      }

      if (wishBtn) {
        e.preventDefault();
        const productId = parseInt(wishBtn.getAttribute("data-product_id"));
        if (!productId) return;

        toggleWishlist(state, productId).then(() => {
          const isWishlisted = isInWishlist(productId);
          wishBtn.classList.toggle("active", isWishlisted);
          // wishBtn.textContent = isWishlisted
          //   ? "Wishlisted"
          //   : "Add to Wishlist";

          wishBtn.innerHTML = `
          <svg height="25px" width="30px" viewBox="0 0 511.982 511.982" xmlns="http://www.w3.org/2000/svg">
            <path class="heart-fill" d="M362.644,21.339c-41.78,0-79.561,17.171-106.653,44.834c-27.101-27.663-64.873-44.834-106.66-44.834 C66.857,21.339,0,88.196,0,170.662c0,170.674,255.991,319.981,255.991,319.981s255.991-149.308,255.991-319.981 C511.982,88.196,445.125,21.339,362.644,21.339z"/>
          </svg>
        `;
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [categoryProducts, actions]);

  // Optimize DOM manipulation with a single useEffect and requestAnimationFrame
  useEffect(() => {
    let rafId;
    const formatProducts = () => {
      const products = document.querySelectorAll("li.wc-block-product");
      if (products.length === 0) {
        rafId = requestAnimationFrame(formatProducts);
        return;
      }

      const wishlist = getWishlist();
      products.forEach((product) => {
        const productId = product.querySelector(
          ".add_to_cart_button[data-product_id]"
        )?.getAttribute("data-product_id");

        if (!productId) return;

        const buttonBlock = product.querySelector(
          ".wp-block-woocommerce-product-button"
        );
        const title = product.querySelector(
          "h3.wp-block-post-title, h3.wp-block-woocommerce-product-title"
        );
        const price = product.querySelector(
          ".wp-block-woocommerce-product-price, .custom-price"
        );
        const imageWrapper = product.querySelector(
          ".wc-block-components-product-image, .custom-product-image"
        );

        if (
          !buttonBlock ||
          !title ||
          !price ||
          !imageWrapper ||
          product.querySelector(".prod-grid-details")
        )
          return;

        // ✅ Format price to remove decimals like .00
        const bdiElements = price.querySelectorAll("bdi");
        bdiElements.forEach((bdi) => {
          const text = bdi.textContent;
          const match = text.match(/([^0-9]*)([\d,]+)(?:\.\d+)?/);
          if (match) {
            const currencySymbol = match[1];
            const numericPart = match[2];
            bdi.textContent = `${currencySymbol}${numericPart}`;
          }
        });

        // ----- Wishlist Button -----
        // ----- Wishlist Button -----
        const wishBtn = document.createElement("button");
        wishBtn.className = "wishlist_button";
        wishBtn.setAttribute("data-product_id", productId);
        const isWishlisted = wishlist.includes(parseInt(productId));
        if (isWishlisted) {
          wishBtn.classList.add("active");
        }
        // wishBtn.textContent = isWishlisted
        //   ? "Wishlisted"
        //   : "Add to Wishlist";

        wishBtn.innerHTML = `
          <svg height="25px" width="30px" viewBox="0 0 511.982 511.982" xmlns="http://www.w3.org/2000/svg">
            <path class="heart-fill" d="M362.644,21.339c-41.78,0-79.561,17.171-106.653,44.834c-27.101-27.663-64.873-44.834-106.66-44.834 C66.857,21.339,0,88.196,0,170.662c0,170.674,255.991,319.981,255.991,319.981s255.991-149.308,255.991-319.981 C511.982,88.196,445.125,21.339,362.644,21.339z"/>
          </svg>
        `;

        // ----- Cart Button -----
        const cartBtn = buttonBlock.querySelector(".add_to_cart_button");
        if (!cartBtn) return;

        // ----- Wishlist + Cart wrapper -----
        const wishlistWrapper = document.createElement("div");
        wishlistWrapper.className = "wishlist_button_wrapper";
        wishlistWrapper.appendChild(wishBtn);
        wishlistWrapper.appendChild(cartBtn);

        // ----- Discount or NEW IN label -----
        const newInWrapper = document.createElement("div");
        newInWrapper.className = "new_in_wrapper";

        const regularPriceElem = price.querySelector(
          ".custom-regular-price .amount bdi"
        );
        const salePriceElem = price.querySelector(
          ".custom-sale-price .amount bdi"
        );

        const newInLabel = document.createElement("span");
        newInLabel.className = "new_in_label";

        if (regularPriceElem && salePriceElem) {
          const regularText = regularPriceElem.textContent.replace(/[^0-9.]/g, "");
          const saleText = salePriceElem.textContent.replace(/[^0-9.]/g, "");

          const regularPrice = parseFloat(regularText);
          const salePrice = parseFloat(saleText);

          if (!isNaN(regularPrice) && !isNaN(salePrice) && regularPrice > salePrice) {
            const discount = Math.round(
              ((regularPrice - salePrice) / regularPrice) * 100
            );
            newInLabel.textContent = `${discount}% OFF`;
          } else {
            newInLabel.textContent = "NEW IN";
          }
        } else {
          newInLabel.textContent = "NEW IN";
        }

        newInWrapper.appendChild(newInLabel);

        // ----- Rebuild button block -----
        buttonBlock.innerHTML = "";
        buttonBlock.appendChild(wishlistWrapper);
        buttonBlock.appendChild(newInWrapper);

        const actionSec = document.createElement("div");
        actionSec.className = "action-sec";
        actionSec.appendChild(buttonBlock);

        const detailsSec = document.createElement("div");
        detailsSec.className = "details-sec";

        if (title.parentNode) title.parentNode.removeChild(title);
        if (price.parentNode) price.parentNode.removeChild(price);

        const brandElement = document.createElement("p");
        brandElement.className = "product-brand-home";
        brandElement.textContent = "";

        detailsSec.appendChild(brandElement);
        detailsSec.appendChild(title);
        detailsSec.appendChild(price);

        // Fetch brand
        fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/product_brand?post=${productId}`)
          .then((res) => res.json())
          .then((brands) => {
            if (brands?.length > 0) {
              const brandNames = brands.map((b) => b.name).join(", ");
              brandElement.textContent = brandNames;
            }
          })
          .catch((err) => {
            console.error("Failed to fetch brand for product", productId, err);
          });

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "prod-grid-details";
        gridWrapper.appendChild(detailsSec);
        gridWrapper.appendChild(actionSec);

        if (imageWrapper.nextSibling) {
          product.insertBefore(gridWrapper, imageWrapper.nextSibling);
        } else {
          product.appendChild(gridWrapper);
        }
      });
    };

    formatProducts();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [data]);

  // ✅ Handle category products formatting after they're added to DOM
  useEffect(() => {
    if (categoryProducts.length === 0) return;

    const formatCategoryProducts = () => {
      const categoryProductElements = document.querySelectorAll(".category-146-product");
      const wishlist = getWishlist();

      categoryProductElements.forEach((product) => {
        if (product.querySelector(".prod-grid-details")) return; // Already formatted

        const productId = product.getAttribute("data-product-id");
        if (!productId) return;

        const buttonBlock = product.querySelector(".product-actions");
        const title = product.querySelector("h3");
        const price = product.querySelector(".product-price");
        const imageWrapper = product.querySelector(".product-image");

        if (!buttonBlock || !title || !price || !imageWrapper) return;

        // ----- Wishlist Button -----
        // ----- Wishlist Button -----
        const wishBtn = document.createElement("button");
        wishBtn.className = "wishlist_button";
        wishBtn.setAttribute("data-product_id", productId);
        const isWishlisted = wishlist.includes(parseInt(productId));
        if (isWishlisted) {
          wishBtn.classList.add("active");
        }
        // wishBtn.textContent = isWishlisted
        //   ? "Wishlisted"
        //   : "Add to Wishlist";

        wishBtn.innerHTML = `
          <svg height="25px" width="30px" viewBox="0 0 511.982 511.982" xmlns="http://www.w3.org/2000/svg">
            <path class="heart-fill" d="M362.644,21.339c-41.78,0-79.561,17.171-106.653,44.834c-27.101-27.663-64.873-44.834-106.66-44.834 C66.857,21.339,0,88.196,0,170.662c0,170.674,255.991,319.981,255.991,319.981s255.991-149.308,255.991-319.981 C511.982,88.196,445.125,21.339,362.644,21.339z"/>
          </svg>
        `;

        // ----- Cart Button -----
        const cartBtn = document.createElement("button");
        cartBtn.className = "add_to_cart_button";
        cartBtn.setAttribute("data-product_id", productId);
        cartBtn.setAttribute("aria-label", `Add to cart: "${title?.textContent}"`);
        cartBtn.textContent = "Add to Cart";

        // ----- Wishlist + Cart wrapper -----
        const wishlistWrapper = document.createElement("div");
        wishlistWrapper.className = "wishlist_button_wrapper";
        wishlistWrapper.appendChild(wishBtn);
        wishlistWrapper.appendChild(cartBtn);

        // ----- NEW IN label -----
        // ----- NEW IN or Discount % label -----
        const newInWrapper = document.createElement("div");
        newInWrapper.className = "new_in_wrapper";

        const newInLabel = document.createElement("span");
        newInLabel.className = "new_in_label";

        // look for original and sale price spans
        const regularElem = price.querySelector(".original-price, .custom-regular-price .amount bdi");
        const saleElem = price.querySelector(".sale-price, .custom-sale-price .amount bdi");

        if (regularElem && saleElem) {
          const regularText = regularElem?.textContent.replace(/[^0-9]/g, "");
          const saleText = saleElem?.textContent.replace(/[^0-9]/g, "");

          const regularPrice = parseFloat(regularText);
          const salePrice = parseFloat(saleText);

          if (!isNaN(regularPrice) && !isNaN(salePrice) && regularPrice > salePrice) {
            const discountPercent = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
            newInLabel.textContent = `${discountPercent}% OFF`;
          } else {
            newInLabel.textContent = "NEW IN";
          }
        } else {
          newInLabel.textContent = "NEW IN";
        }

        newInWrapper.appendChild(newInLabel);

        // ----- Rebuild button block -----
        buttonBlock.innerHTML = "";
        buttonBlock.appendChild(wishlistWrapper);
        buttonBlock.appendChild(newInWrapper);

        const actionSec = document.createElement("div");
        actionSec.className = "action-sec";
        actionSec.appendChild(buttonBlock);

        const detailsSec = document.createElement("div");
        detailsSec.className = "details-sec";

        if (title.parentNode) title.parentNode.removeChild(title);
        if (price.parentNode) price.parentNode.removeChild(price);

        const brandElement = document.createElement("p");
        brandElement.className = "product-brand-home";
        brandElement.textContent = "";

        detailsSec.appendChild(brandElement);
        detailsSec.appendChild(title);
        detailsSec.appendChild(price);

        // Fetch brand
        fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/product_brand?post=${productId}`)
          .then((res) => res.json())
          .then((brands) => {
            if (brands?.length > 0) {
              const brandNames = brands.map((b) => b.name).join(", ");
              brandElement.textContent = brandNames;
            }
          })
          .catch((err) => {
            console.error("Failed to fetch brand for product", productId, err);
          });

        const gridWrapper = document.createElement("div");
        gridWrapper.className = "prod-grid-details";
        gridWrapper.appendChild(detailsSec);
        gridWrapper.appendChild(actionSec);

        if (imageWrapper.nextSibling) {
          product.insertBefore(gridWrapper, imageWrapper.nextSibling);
        } else {
          product.appendChild(gridWrapper);
        }
      });
    };

    const timer = setTimeout(formatCategoryProducts, 500);
    return () => clearTimeout(timer);
  }, [categoryProducts, state]);


  useEffect(() => {
    if (!data.isReady || loading) return;

    const initializeSlider = () => {
      const sliderContainer = document.getElementById('metaslider_11176');
      if (!sliderContainer) return;

      if (sliderContainer.classList.contains('enhanced-slider-initialized')) return;

      const slidesContainer = sliderContainer.querySelector('.slides');
      const slides = sliderContainer.querySelectorAll('.slides li');
      if (slides.length === 0) return;

      let currentSlide = 0;
      let isTransitioning = false;
      let autoSlideInterval;
      let translateX = 0;

      sliderContainer.classList.add('enhanced-slider-initialized');

      slidesContainer.style.cssText = `
        display: flex;
        width: ${slides.length * 100}%;
        transition: transform 0.3s ease-out;
        transform: translateX(0%);
      `;

      slides.forEach((slide) => {
        slide.style.cssText = `
          display: block;
          width: ${100 / slides.length}%;
          flex-shrink: 0;
        `;
      });

      const goToSlide = (slideIndex, smooth = true) => {
        if (isTransitioning || slideIndex === currentSlide) return;

        isTransitioning = true;
        currentSlide = slideIndex;
        translateX = -(currentSlide * (100 / slides.length));

        slidesContainer.style.transition = smooth ? 'transform 0.3s ease-out' : 'none';

        updateDots();

        slidesContainer.style.transform = `translateX(${translateX}%)`;
        setTimeout(() => {
          isTransitioning = false;
        }, 300);
      };

      const nextSlide = () => {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
      };

      const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3000);
      };

      const stopAutoSlide = () => {
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval);
          autoSlideInterval = null;
        }
      };

      // Prevent image dragging
      slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
          img.style.pointerEvents = 'none';
          img.setAttribute('draggable', 'false');
        }
      });

      // Create dots
      const createDots = () => {
        const existingDots = sliderContainer.parentNode.querySelector('.slider-dots');
        if (existingDots) existingDots.remove();

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.style.cssText = `
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
        `;

        slides.forEach((_, index) => {
          const dot = document.createElement('button');
          dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
          dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: ${index === 0 ? '#333' : '#ccc'};
            cursor: pointer;
            transition: background-color 0.3s ease;
          `;

          dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoSlide();
          });

          dotsContainer.appendChild(dot);
        });

        sliderContainer.parentNode.appendChild(dotsContainer);
      };

      const updateDots = () => {
        const dots = sliderContainer.parentNode.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
          dot.style.background = index === currentSlide ? '#333' : '#ccc';
          dot.classList.toggle('active', index === currentSlide);
        });
      };

      createDots();
      translateX = 0;
      goToSlide(0, false);
      startAutoSlide();

      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);

      sliderContainer._cleanup = () => {
        stopAutoSlide();
      };
    };

    const timer = setTimeout(initializeSlider, 500);

    return () => {
      clearTimeout(timer);
      const sliderContainer = document.getElementById('metaslider_11176');
      if (sliderContainer && sliderContainer._cleanup) {
        sliderContainer._cleanup();
      }
    };
  }, [data.isReady, loading]);

  const getBestDiscountedPrice = (product, coupons) => {
    const applicableCoupons = coupons.filter((coupon) => {
      const isGlobalCoupon =
        (!coupon.product_ids || coupon.product_ids.length === 0) &&
        (!coupon.product_categories || coupon.product_categories.length === 0) &&
        (!coupon.excluded_product_ids || coupon.excluded_product_ids.length === 0) &&
        (!coupon.excluded_product_categories || coupon.excluded_product_categories.length === 0);

      const includesProduct =
        (coupon.product_ids && coupon.product_ids.includes(product.id)) ||
        (coupon.product_categories && coupon.product_categories.some((catId) =>
          product.categories && product.categories.some((cat) => cat.id === catId)
        ));

      const isExcluded =
        (coupon.excluded_product_ids && coupon.excluded_product_ids.includes(product.id)) ||
        (coupon.excluded_product_categories && coupon.excluded_product_categories.some((excludedCatId) =>
          product.categories && product.categories.some((cat) => cat.id === excludedCatId)
        ));

      return (isGlobalCoupon || includesProduct) && !isExcluded;
    });

    if (applicableCoupons.length === 0) {
      return null;
    }

    let bestDiscountedPrice = parseFloat(product.price);

    applicableCoupons.forEach((coupon) => {
      const discountAmount =
        coupon.discount_type === "percent"
          ? (product.price * coupon.amount) / 100
          : parseFloat(coupon.amount);
      const discountedPrice = product.price - discountAmount;

      if (discountedPrice < bestDiscountedPrice) {
        bestDiscountedPrice = discountedPrice;
      }
    });

    return bestDiscountedPrice.toFixed(2);
  };

  if (!data.isReady) return <div className="loading-indicator" style={{ textAlign: 'center', padding: '20px' }}>
    <Loading />
  </div>;

  const page =
    data?.type && data?.id && state.source[data.type]
      ? state.source[data.type][data.id]
      : null;

  if (!page) return <p>Page not found</p>;


  // ✅ Inject API products into Best Selling section
  const updatedHtml =
    page.content?.rendered?.replace(
      /(<h2[^>]*>Best Selling<\/h2>[\s\S]*?<ul[^>]*>)([\s\S]*?)(<\/ul>)/,
      loading
        ? `$1<div><p>Loading more products...</p></div>$3`
        : `$1${bestSellingHtml || ""}$3`
    ) || "<p>No content</p>";

  return (
    <>
      <Html2React html={updatedHtml} />
      <div className="global_custom_class shop_by_cat_display">
        <h2>Shop By Categories</h2>

        {/* ✅ Display Category 146 Products */}
        {categoryProducts?.length > 0 && (
          <div className="category-products-section">
            <ul className="category-products-grid">
              {categoryProducts.map((product) => {
                // log product safely
                const isSale = saleSettings && saleSettings.sale_category && product.categories.some(category => category.id === saleSettings.sale_category.id);
                const isMegaSale = saleSettings && saleSettings.mega_sale_category && product.categories.some(category => category.id === saleSettings.mega_sale_category.id);
                const megaSalePrice = getBestDiscountedPrice(product, allCoupons);
                const { regularPrice, salePrice, onlyPrice } = parsePriceHtml(
                  product,
                  product.price_html
                );

                return (
                  <li
                    key={product.id}
                    className="wc-block-product category-146-product"
                    data-product-id={product.id}
                  >
                    <Link
                      link={`/product/${product.slug}`}
                      className="custom-product-link"
                    >
                      {isSale && (
                        <div
                          className="sale-tag"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'red',
                            color: 'white',
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                            zIndex: 1,
                          }}
                        >
                          SALE
                       </div>
                      )}
                      <div className="product-image custom-product-image">
                        <img
                          src={product.images?.[0]?.src || ""}
                          alt={product.name}
                        />
                      </div>
                    </Link>

                    <div className="product-details">
                      <h3 className="custom-product-title">{product.name}</h3>
                      <div className="product-price custom-price">
                        <div className="product-price">
                          {salePrice && regularPrice ? (
                            <>
                              <span className="original-price">{regularPrice}</span>{" "}
                              <span className="sale-price">{salePrice}</span>
                            </>
                          ) : (
                            <span className="regular-price">{onlyPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="product-actions wp-block-woocommerce-product-button">
                      {/* Buttons will be added by the DOM manipulation effect */}
                    </div>
                    {isMegaSale && megaSalePrice && (
                      <div
                        className="mega-sale-price"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "5px",
                          fontSize: "0.8em",
                          textAlign: "center",
                          marginTop: "5px",
                        }}
                      >
                        {saleSettings.mega_sale_text} ₹{megaSalePrice}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {isLoading && (
              <div
                className="loading-indicator"
                style={{ textAlign: "center", padding: "20px" }}
              >
                <Loading />
              </div>
            )}
          </div>
        )}
      </div>

      {categoryProducts.length > 0 && (
        <div class="wp-block-buttons alignfull view_all_button is-horizontal is-content-justification-center is-layout-flex wp-container-core-buttons-is-layout-03627597 wp-block-buttons-is-layout-flex" bis_skin_checked="1"><div class="wp-block-button has-custom-width wp-block-button__width-25 is-style-outline is-style-outline--1" bis_skin_checked="1"><Link link="/view-all/products/" target="_self" class="wp-block-button__link has-base-background-color has-text-color has-background has-link-color has-text-align-center wp-element-button css-h8js6y-props-css">View All</Link></div></div>
      )}
    </>
  );
};

export default connect(Homepage);
