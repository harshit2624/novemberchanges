import React, { useEffect, useState } from "react";
import { connect } from "frontity";
import { getWishlist, addToCart, removeFromWishlist, syncWishlistFromServer, getWpBaseUrl, consumer_key, consumer_secret } from "../utils";
import Link from "@frontity/components/link";
import Loading from "./loading";

const WishlistPage = ({ state }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variations, setVariations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        // Debug wishlist state
        console.log("=== WISHLIST PAGE DEBUG ===");
        const initialIds = getWishlist();
        console.log("Initial wishlist IDs:", initialIds);
        
        // First sync with server if user is logged in
        await syncWishlistFromServer(state);
        
        // Get wishlist again after sync
        const ids = getWishlist();
        
        if (ids.length === 0) {
          setWishlistItems([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/products?include=${ids.join(
            ","
          )}&consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWishlistItems(data);

        // Fetch variations for variable products
        const variationPromises = data
          .filter(product => product.type === "variable")
          .map(async (product) => {
            try {
              const variationRes = await fetch(
                `${getWpBaseUrl(state)}/wp-json/wc/v3/products/${product.id}/variations?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`
              );
              
              if (variationRes.ok) {
                const variationData = await variationRes.json();
                return { productId: product.id, variations: variationData };
              }
            } catch (error) {
              console.error(`Failed to fetch variations for product ${product.id}:`, error);
            }
            return null;
          });

        const variationResults = await Promise.all(variationPromises);
        
        const newVariations = {};
        variationResults.forEach(result => {
          if (result) {
            newVariations[result.productId] = result.variations;
          }
        });
        
        setVariations(newVariations);
        setLoading(false);
        
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [state]);

  const handleVariantChange = (productId, attrName, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [attrName]: value,
      },
    }));
  };

  const getMatchingVariation = (productId) => {
    const selected = selectedVariants[productId];
    if (!selected || !variations[productId]) return null;

    return variations[productId].find((variation) =>
      Object.entries(selected).every(
        ([attr, val]) =>
          variation.attributes.find(
            (a) =>
              a.name.toLowerCase() === attr.toLowerCase() &&
              a.option === val
          )
      )
    );
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(state, productId);
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handleAddToCart = async (item, variation) => {
    try {
      await addToCart(state, item, variation, 1);
      await handleRemoveFromWishlist(item.id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  
  if (loading) return <Loading />;

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlistItems.map((item) => {
            const imageUrl = item.images?.[0]?.src || "";
            const brandName = item.brands?.[0]?.name || null;
            const isVariable = item.type === "variable";
            const variation = isVariable ? getMatchingVariation(item.id) : null;

            const finalPrice = isVariable
              ? variation?.price
              : item.sale_price || item.regular_price;

            const isDisabled = isVariable && !variation;

            return (
              <li key={item.id} className="wishlist-item">
                <Link link={`/product/${item.slug}`}>
                  <h3>{item.name}</h3>
                </Link>

                {brandName && <p className="brand-name">{brandName}</p>}

                <img src={imageUrl} alt={item.name} className="wishlist-image" />

                <p className="wishlist-price">
                  {isVariable
                    ? variation
                      ? `Price: ₹${variation.price}`
                      : "Price: Select option"
                    : `Price: ₹${finalPrice}`}
                </p>

                {isVariable &&
                  item.attributes.map((attr) => (
                    <div key={attr.id} className="variant-select">
                      <strong>{attr.name}:</strong>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {attr.options.map((opt) => {
                          const isSelected =
                            selectedVariants[item.id]?.[attr.name] === opt;

                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                handleVariantChange(item.id, attr.name, opt)
                              }
                              style={{
                                padding: "6px 12px",
                                borderRadius: "5px",
                                border: isSelected ? "2px solid black" : "1px solid #ccc",
                                backgroundColor: isSelected ? "#000" : "#fff",
                                color: isSelected ? "#fff" : "#000",
                                cursor: "pointer",
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                <div className="wishlist_action_container">
                  <button
                    onClick={() => handleAddToCart(item, variation)}
                    disabled={isDisabled}
                    className={`add-to-cart-button addtocart_wishlist${isDisabled ? " disabled" : ""}`}
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="remove-wishlist-button removeitem_wishlist"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default connect(WishlistPage);