import React, { useEffect, useState, useCallback, useRef } from "react";
import { connect } from "frontity";
import axios from "axios";
import {
  toggleWishlist,
  getWishlist,
  showToast
} from "../utils";

// Touch/Drag Slider Component
const TouchSlider = ({ sliderId, slides, autoPlay = true, className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (autoPlay && slides.length > 1 && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, slides.length, isDragging]);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    let newSlide = currentSlide;

    if (translateX > threshold && currentSlide > 0) {
      newSlide = currentSlide - 1;
    } else if (translateX < -threshold && currentSlide < slides.length - 1) {
      newSlide = currentSlide + 1;
    } else if (translateX < -threshold && currentSlide === slides.length - 1) {
      newSlide = 0;
    } else if (translateX > threshold && currentSlide === 0) {
      newSlide = slides.length - 1;
    }

    setCurrentSlide(newSlide);
    setTranslateX(0);
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      ref={sliderRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "8px",
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(${-currentSlide * 100 + (translateX / (sliderRef.current?.offsetWidth || 1)) * 100}%)`,
          transition: isDragging ? 'none' : "transform 0.5s ease-out",
          height: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <div
            className="firstSlider"
            key={index}
            style={{
              minWidth: "100%",
              position: "relative",
              height: "100%",
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt || slide.title || "Slider image"}
              style={{
                pointerEvents: 'none',
                // objectFit: 'cover'
              }}
              loading="lazy"
              draggable={false}
              className={className}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Product Slider Component
const ProductSlider = ({ products, onWishlistToggle, wishlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef(null);

  const cardsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const getCardsPerView = () => {
    if (window.innerWidth <= 768) return cardsPerView.mobile;
    if (window.innerWidth <= 1024) return cardsPerView.tablet;
    return cardsPerView.desktop;
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - cardsToShow);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 100;
    let newIndex = currentIndex;

    if (translateX > threshold && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (translateX < -threshold && currentIndex < maxIndex) {
      newIndex = currentIndex + 1;
    }

    setCurrentIndex(newIndex);
    setTranslateX(0);
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (products.length === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Slider Container */}
      <div
        ref={sliderRef}
        style={{
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(${-currentIndex * (100 / cardsToShow) + (translateX / (sliderRef.current?.offsetWidth || 1)) * 100}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            gap: '15px'
          }}
        >
          {products.map((product) => {
            const inWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  minWidth: `calc(${100 / cardsToShow}% - 10px)`, 
                  width: `calc(${100 / cardsToShow}% - 10px)`,    
                  flexShrink: 0
                }}
              >
                <ProductCard
                  product={product}
                  onWishlistToggle={onWishlistToggle}
                  inWishlist={inWishlist}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onWishlistToggle, inWishlist }) => {
  const getBrandName = (product) => {
    if (product.brands && Array.isArray(product.brands)) {
      return product.brands[0]?.name;
    }

    const metaBrand = product.meta_data?.find(
      (meta) => meta.key === "brand"
    );
    if (metaBrand?.value) return metaBrand.value;

    return null;
  };

  const brandName = getBrandName(product);

  return (
    <div style={{
      borderRadius: '8px',
      padding: '0',
      marginBottom: '15px',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
      height: '280px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <img
          src={product.images?.[0]?.src}
          alt={product.images?.[0]?.alt || product.name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'contain',
            borderRadius: '8px 8px 0 0'
          }}
        />
      </div>

      <div style={{ padding: '10px' }}>
        {brandName && (
          <p style={{
            color: '#666',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 5px 0',
            fontWeight: '600'
          }}>
            {brandName}
          </p>
        )}

        <h3 style={{
          fontSize: '12px',
          fontWeight: '600',
          margin: '0',
          color: '#333',
          lineHeight: '1.3',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </h3>
      </div>
    </div>
  );
};

const CalendarPage = ({ state }) => {
  const data = state.source.get("/calendar/");
  const page = state.source.page[data.id];
  let rawHtml = page?.content?.rendered;

  if (rawHtml) {
    const wpBase = "https://www.croscrow.com/a";
    rawHtml = rawHtml.replace(
      new RegExp(`${wpBase}/product/([^"]+)`, "g"),
      `/product/$1`
    );
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(getWishlist());

  // Function to extract slider data from rawHtml using regex
  const extractSliderData = (html, sliderId) => {
    if (!html) return [];

    const sliderRegex = new RegExp(`<div id="${sliderId}"[^>]*>([\\s\\S]*?)<\\/div>\\s*<\\/div>\\s*<\\/div>`);
    const sliderMatch = html.match(sliderRegex);

    if (!sliderMatch) return [];

    const sliderContent = sliderMatch[1];

    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*(?:title="([^"]*)")?[^>]*>/g;
    const images = [];
    let match;

    while ((match = imgRegex.exec(sliderContent)) !== null) {
      images.push({
        src: match[1],
        alt: match[2] || '',
        title: match[3] || '',
      });
    }

    return images;
  };

  const homeSliderData = extractSliderData(rawHtml, 'metaslider_4102');
  const newLaunchesSliderData = extractSliderData(rawHtml, 'metaslider_4135');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://www.croscrow.com/a/wp-json/wc/v3/products",
          {
            auth: {
              username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
              password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
            },
            params: {
              category: 139,
              per_page: 12,
            },
          }
        );
        console.log("Upcoming Products Response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistToggle = useCallback((id) => {
    setWishlist(toggleWishlist(id));
  }, []);

  if (!rawHtml) return <div>No content found</div>;

  return (
    <div className="calender homepage_banner" style={{
      backgroundColor: '#f8f9fa',
      overflow: 'hidden'
    }}>
      {/* Main Content Container - Full Screen Layout */}
      <div className="celenderContainer" style={{
        display: 'flex',
        gap: '30PX'
      }}>

        {/* Left Side - Hero Slider (Reduced Width) */}
        <div className="celenderHero" style={{
          flex: '0 0 45%',
          position: 'relative'
        }}>
          <TouchSlider
            sliderId="metaslider_4102"
            slides={homeSliderData}
            autoPlay={true}
            className={'homeSlider'}
          />
        </div>

        {/* Right Side Container - Expanded Width Column */}
        <div className="celenderSidebar" style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* New Launches Section */}
          <div className="celenderNewLaunches" style={{
            position: 'relative',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0',
              color: '#fff',
              textAlign: 'left',
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: '99',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '8px 12px',
              borderRadius: '4px'
            }}>
              New Launches
            </h2>

            <TouchSlider
              sliderId="metaslider_4135"
              slides={newLaunchesSliderData}
              autoPlay={true}
              className={'newlanch'}
            />
          </div>

          {/* Coming Soon Products Section */}
          <div className="celenderComingSoon" style={{
            flex: 1,
            padding: '20px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 20px 0',
              color: '#333',
              textAlign: 'left'
            }}>
              Coming Soon
            </h2>

            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '14px'
              }}>
                Loading products...
              </div>
            )}

            {!loading && products.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '14px'
              }}>
                No Coming Soon products found.
              </div>
            )}

            {!loading && products.length > 0 && (
              <div style={{
                height: '100%',
                overflow: 'auto'
              }}>
                <ProductSlider
                  products={products}
                  onWishlistToggle={handleWishlistToggle}
                  wishlist={wishlist}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        .homeSlider {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover; 
          border-radius: 9px;    
        }
        .newlanch {
          width: 100%;
          aspect-ratio: 2 / 1; 
          object-fit: cover;    
          border-radius: 9px;    
        }
        @media (max-width: 1024px) {
          .celenderHero {
            flex: 0 0 60% !important;
          }
        }

        @media (max-width: 768px) {
          .calender {
            height: auto !important;
            overflow: visible !important;
          }
          
          .celenderContainer {
            flex-direction: column !important;
            height: auto !important;
          }
          
          .celenderHero {
            flex: none !important;
          }
          
          .celenderSidebar {
            width: 100% !important;
            height: auto !important;
            border-left: none !important;
            border-top: 1px solid #e0e0e0 !important;
          }
        }
        
        @media (max-width: 480px) {          
          .celenderComingSoon {
            padding: 15px !important;
          }
        }

        /* Custom scrollbar for Coming Soon section */
        .celenderComingSoon::-webkit-scrollbar {
          width: 6px;
        }
        
        .celenderComingSoon::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .celenderComingSoon::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .celenderComingSoon::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default connect(CalendarPage);