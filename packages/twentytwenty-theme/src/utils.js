// utils.js
import apiFetch from "./apiFetch";

export const getWpBaseUrl = (state) => {

  return state?.source?.url || "https://www.croscrow.com/a"; // or state.source.api.replace("/wp-json", "");
};

export const consumer_key = "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5";
export const consumer_secret = "cs_14996e7e8eed396bced4ac30a0acfd9fea836214";

/* ----------  Toast Notification System ---------- */
let toastContainer = null;

const createToastContainer = () => {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
};

export const showToast = (message, type = 'success', duration = 5000) => {
  const container = createToastContainer();

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'success' ? '#10b981' :
      type === 'error' ? '#ef4444' :
        type === 'warn' ? '#f59e0b' : // amber-500
          '#3b82f6' // default (e.g., info - blue-500)
    };
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: all 0.3s ease-in-out;
    pointer-events: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 350px;
    word-wrap: break-word;
  `;

  // Add icon based on type
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Auto remove
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, duration);

  // Click to dismiss
  toast.addEventListener('click', () => {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  });
};

/* ----------  Check if User Logged In ---------- */
export const isUserLoggedIn = async (state) => {
  try {
    const res = await fetch(
      `${getWpBaseUrl(state)}/wp-json/wp/v2/users/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) return false;

    const user = await res.json();
    return !!user.id;
  } catch (e) {
    return false;
  }
};

export const pingCartActivity = async (state) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return;

  try {
    await apiFetch(`${getWpBaseUrl(state)}/wp-json/mailercart/v1/activity`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error pinging cart activity:', error);
  }
};

  // ✅ Accept product info as parameters
const fireAddToCartPixel = ({ productId, productName, price }) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_ids: [productId.toString()],
      content_name: productName,
      content_type: 'product',
      currency: 'INR',
      value: price,
    });
  }
};

export const addToCart = async (state, product, selectedVariant = null) => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("jwt_token");
  const isValidJwt = token && token.split(".").length === 3;

  const productName = product?.name;

  // ✅ Check for variants
  if (
    (product?.variants?.length > 0 && !selectedVariant) ||
    productName?.includes("Select options")
  ) {
    showToast("Please select a product variant before adding to cart.", "warn");
    return;
  }

  // ✅ Stock check
  if (product?.stock_status !== "instock") {
    showToast("This product is out of stock", "warn");
    return;
  }

  const isVariant = selectedVariant && selectedVariant.id !== product?.id;
  const productId = isVariant ? selectedVariant.id : product?.id;
  const variationId = isVariant ? productId : 0;
  const variation = {};
  const price = parseFloat(selectedVariant?.price || product.price || 0); // ✅ Centralized here

  if (!isValidJwt) {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

    const existingItemIndex = guestCart.findIndex(
      (item) => item.product_id === productId && item.variation_id === variationId
    );

    if (existingItemIndex >= 0) {
      guestCart[existingItemIndex].quantity += 1;
    } else {
      guestCart.push({
        cart_item_key: `${productId}-${variationId || "0"}`,
        product_id: productId,
        variation_id: variationId,
        name: product.name,
        price: product.price_html || product.price,
        quantity: 1,
        image: product.images?.[0]?.src || null,
        categories: product?.categories
      });
    }

    localStorage.setItem("guest_cart", JSON.stringify(guestCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: guestCart }));
    showToast(`${product.name} added to cart!`, "success");

    // ✅ Pass required info into pixel firing
    fireAddToCartPixel({ productId, productName, price });

    pingCartActivity(state);
    return;
  }

  // ✅ Set headers conditionally
  const headers = {
    "Content-Type": "application/json",
    ...(isValidJwt && { Authorization: `Bearer ${token}` }),
  };

  try {
    const cartRes = await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart`, { method: "GET", headers });

    if (!cartRes.ok) {
      console.error("Cart fetch failed:", await cartRes.text());
      showToast("Unable to access cart. Please try again.", "error");
      return;
    }

    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart/add`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
        variation_id: variationId,
        variation,
        categories: product?.categories
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Add to cart failed:", data);
      showToast(data.message || "Maximum quantity reached for this product", "warn");
      return;
    }

    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: data.cart }));
    showToast(`${product.name} added to cart!`, "success");

    fireAddToCartPixel({ productId, productName, price });

    pingCartActivity(state);

  } catch (error) {
    console.error("Add to cart error:", error);
    showToast("Error adding to cart. Please try again.", "error");
  }
};

export const mergeGuestCartToUserCart = async (state) => {
  const token = localStorage.getItem("jwt_token");
  const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

  if (!token || guestCart.length === 0) return;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  for (const item of guestCart) {
    try {
      await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: item.quantity,
          variation_id: item.variation_id || 0,
          variation: item.variation || {},
        }),
      });
    } catch (err) {
      console.error("❌ Failed to merge guest cart item:", err);
    }
  }

  localStorage.removeItem("guest_cart");
  window.dispatchEvent(new CustomEvent("cartUpdated"));
  showToast("Your saved items were added to your cart.", "success");
};

/* ----------  Remove from Cart (Updated for Guest Users) ---------- */
export const removeCartItem = async (state, cartItemKey) => {
  const token = localStorage.getItem("jwt_token");
  const isValidJwt = token && token.split(".").length === 3;
  
  if (!isValidJwt) {
    // Guest user logic - remove from localStorage
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    
    const updatedCart = guestCart.filter(item => item.cart_item_key !== cartItemKey);
    
    if (updatedCart.length === guestCart.length) {
      showToast("Item not found in cart", 'warn');
      return false;
    }
    
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart }));
    showToast("Item removed from cart", 'success');
    pingCartActivity(state);
    return true;
  }

  // Logged-in user logic (existing code)
  const requestData = { cart_item_key: cartItemKey.toString() };
  
  try {
    const res = await fetch(
      `${getWpBaseUrl(state)}/wp-json/theme/v1/cart/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await res.json();
    console.log("Backend response:", responseData);

    if (!res.ok) {
      console.error("Failed to remove item response:", responseData);
      showToast("Failed to remove item from cart: " + (responseData.message || "Unknown error"), 'error');
      return false;
    }

    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Item removed from cart", 'success');
    return true;
  } catch (e) {
    console.error("Remove-item error:", e);
    showToast("Error removing item. Please try again.", 'error');
    return false;
  }
};

/* ----------  Clear Cart (Updated for Guest Users) ---------- */
export const removeFromCart = async (state) => {
  const token = localStorage.getItem("jwt_token");
  const isValidJwt = token && token.split(".").length === 3;

  if (!isValidJwt) {
    // Guest user logic - clear localStorage cart
    localStorage.removeItem("guest_cart");
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
    showToast("Cart cleared successfully", 'success');
    return true;
  }

  // Logged-in user logic (existing code)
  try {
    const res = await fetch(
      `${getWpBaseUrl(state)}/wp-json/theme/v1/cart/clear`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to clear cart:", error.message);
      showToast("Failed to clear cart", 'error');
      return false;
    }

    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Cart cleared successfully", 'success');
    return true;
  } catch (e) {
    console.error("Clear cart error:", e);
    showToast("Error clearing cart. Please try again.", 'error');
    return false;
  }
};

/* ----------  Get Cart (Updated for Guest Users) ---------- */
export const getCart = async (state) => {
  const token = localStorage.getItem("jwt_token");
  const isValidToken = token && token.split(".").length === 3;

  if (!isValidToken) {
    // Guest user logic - return cart from localStorage
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    return {
      items: guestCart,
      totals: {
        total_items: guestCart.length,
        total_items_tax: 0,
        total: guestCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0),
        total_tax: 0,
        shipping_total: 0,
        currency_code: 'USD', // adjust based on your setup
        currency_symbol: '$'
      }
    };
  }

  // Logged-in user logic (existing code)
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart`, {
      headers,
      credentials: "include", 
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch cart", await res.text());
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Get cart error:", error);
    return null;
  }
};

const getWishlistApiBase = (state) => `${getWpBaseUrl(state)}/wp-json/friends/v1/wishlist`;

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt_token");
};

export const getWishlist = () => {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem("wishlist");
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to parse wishlist from localStorage:", e);
    return [];
  }
};

export const isInWishlist = (id) => getWishlist().includes(id);

const syncWithServer = async (state, productId, isAdding) => {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${getWishlistApiBase(state)}/${isAdding ? "add" : "remove"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });
  } catch (err) {
    console.error("Wishlist sync failed:", err);
  }
};

export const toggleWishlist = async (state, productId) => {
  if (typeof window === "undefined") return [];

  const current = getWishlist();
  const isAdding = !current.includes(productId);
  const updated = isAdding
    ? [...current, productId]
    : current.filter((id) => id !== productId);

  localStorage.setItem("wishlist", JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));
  showToast(isAdding ? "Added to wishlist" : "Removed from wishlist");

  await syncWithServer(state, productId, isAdding);
  return updated;
};

export const syncWishlistFromServer = async (state) => {
  const token = getToken();
  if (!token) {
    console.log("No token found, skipping wishlist sync");
    return;
  }

  try {
    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/friends/v1/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      console.warn("Failed to sync wishlist from server:", res.status, res.statusText);
      // Don't throw error, just continue with local wishlist
      return;
    }
    
    const data = await res.json();
    if (Array.isArray(data)) {
      const productIds = data.map((item) => parseInt(item.product_id));
      localStorage.setItem("wishlist", JSON.stringify(productIds));
      window.dispatchEvent(new Event("wishlistUpdated"));
      console.log("Wishlist synced from server:", productIds);
    }
  } catch (err) {
    console.warn("Failed to sync wishlist from server:", err);
    // Don't throw error, just continue with local wishlist
  }
};

export const removeFromWishlist = async (state, productId) => {
  if (typeof window === "undefined") return [];

  const current = getWishlist();
  const updated = current.filter((id) => id !== productId);

  localStorage.setItem("wishlist", JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));
  
  const token = getToken();
  if (!token) {
    console.log("No token, only removing from local storage");
    return updated;
  }

  try {
    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/friends/v1/wishlist/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });
    
    if (!res.ok) {
      console.warn("Failed to sync wishlist removal with server:", res.status);
    }
  } catch (err) {
    console.warn("Failed to sync wishlist removal with server:", err);
  }

  return updated;
};

/* ----------  Global Event Manager ---------- */
class GlobalEventManager {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }

  // Emit an event
  emit(eventName, data = null) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  // Remove all listeners for an event
  off(eventName) {
    delete this.events[eventName];
  }

  // Remove all listeners
  clear() {
    this.events = {};
  }
}

// Create global instance
export const eventManager = new GlobalEventManager();

/* ----------  Auth Event Handlers ---------- */
export const handleLogin = async (state, actions, token, userData = null) => {
  localStorage.setItem("jwt_token", token);
  window.dispatchEvent(new Event("userLoggedIn"));

  // Emit login event with user data
  eventManager.emit("user:login", { token, userData });

  // Sync wishlist after login
  await syncWishlistFromServer(state);
  await mergeGuestCartToUserCart(state);

  showToast("Login successful!", "success");

  // ---------------------------
  // Idle logout in 30 seconds
  // ---------------------------
  let idleTimer;

  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // Perform logout
      localStorage.removeItem("jwt_token");
      actions.router.set("/");
      showToast("You have been logged out", "info");
      window.dispatchEvent(new Event("userLoggedOut"));
    }, 5000000); // 30 seconds
  };

  // Reset on user interactions
  ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  // Start timer
  resetTimer();
};

export const handleLogout = (actions) => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("User");
  window.dispatchEvent(new Event("userLoggedOut"));
  
  showToast("Logged out successfully", 'success');
  // Clear wishlist on logout
  localStorage.removeItem("wishlist");
  
  // Emit logout event
  eventManager.emit('user:logout');
  
  // Redirect to home or login page
  actions.router.set("/");
  
};

export const handleRegistration = async (state, actions, userData) => {
  // Emit registration event
  eventManager.emit('user:register', userData);
  
  // Auto login after registration
  const loginRes = await fetch(`${getWpBaseUrl(state)}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
    }),
  });
  
  const loginJson = await loginRes.json();
  if (loginJson.token) {
    await handleLogin(state, actions, loginJson.token, userData);
  }
};

/* ----------  Enhanced Cart Functions ---------- */
export const updateCartWithEvents = async (state, cartData) => {
  // Emit cart update event
  eventManager.emit('cart:updated', cartData);
  
  // Also dispatch the existing custom event for backward compatibility
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartData }));
};

export const addToCartWithEvents = async (state, product, selectedVariant = null, productQTY) => {
  const token = localStorage.getItem("jwt_token");
  if (typeof window === "undefined") return;

  const productName = product?.name;

  if ((product.variants && product.variants.length > 0 && !selectedVariant) || productName.includes('Select options')) {
    showToast("Please select a product variant before adding to cart.", 'warn');
    eventManager.emit('cart:error', { type: 'variant_required', product });
    return;
  }

  if (productQTY === null || productQTY <= 0) {
    showToast("This product is out of stock", 'warn');
    eventManager.emit('cart:error', { type: 'out_of_stock', product });
    return;
  }

  const isVariant = selectedVariant && selectedVariant.id !== product.id;
  const productId = isVariant ? selectedVariant.id : product.id;
  const variationId = isVariant ? productId : 0;
  const variation = {};

  try {
    // Emit adding to cart event
    eventManager.emit('cart:adding', { product, selectedVariant, productQTY });

    const cartRes = await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const cartData = await cartRes.json();

    let existingItem = null;
    if (cartData?.items && Array.isArray(cartData.items)) {
      existingItem = cartData.items.find(
        (item) =>
          item.product_id === productId &&
          (!item.variation_id || item.variation_id === variationId)
      );
    }

    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/theme/v1/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: newQuantity,
        variation_id: variationId,
        variation,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || 'Maximum quantity reached for this product', 'warn');
      eventManager.emit('cart:error', { type: 'quantity_limit', product, message: data.message });
      return;
    }

    // Emit successful add to cart event
    eventManager.emit('cart:item_added', { product, cart: data.cart, newQuantity });
    updateCartWithEvents(state, data.cart);
    showToast(`${product.name} added to cart!`, 'success');
    
  } catch (error) {
    console.error("Add to cart error:", error);
    showToast("Error adding to cart. Please try again.", 'error');
    eventManager.emit('cart:error', { type: 'network_error', product, error });
  }
};

/* ----------  Enhanced Wishlist Functions ---------- */
export const toggleWishlistWithEvents = async (state, productId, productData = null) => {
  if (typeof window === "undefined") return [];

  const current = getWishlist();
  const isAdding = !current.includes(productId);
  const updated = isAdding
    ? [...current, productId]
    : current.filter((id) => id !== productId);

  localStorage.setItem("wishlist", JSON.stringify(updated));
  
  // Emit wishlist events
  eventManager.emit('wishlist:updated', updated);
  if (isAdding) {
    eventManager.emit('wishlist:item_added', { productId, productData });
  } else {
    eventManager.emit('wishlist:item_removed', { productId, productData });
  }
  
  // Backward compatibility
  window.dispatchEvent(new Event("wishlistUpdated"));
  
  showToast(isAdding ? "Added to wishlist" : "Removed from wishlist");

  await syncWithServer(state, productId, isAdding);
  return updated;
};

/* ----------  User Profile Events ---------- */
export const handleProfileUpdate = async (state, token, updatedData) => {
  try {
    const res = await fetch(`${getWpBaseUrl(state)}/wp-json/wc/v3/customers/${updatedData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const json = await res.json();

    if (!json.message) {
      eventManager.emit('user:profile_updated', { updatedData: json });
      showToast("Account updated successfully!", 'success');
      return { success: true, data: json };
    } else {
      eventManager.emit('user:profile_update_error', { error: json.message });
      showToast("Update failed: " + json.message, 'error');
      return { success: false, error: json.message };
    }
  } catch (err) {
    console.error("Update error:", err);
    eventManager.emit('user:profile_update_error', { error: err });
    showToast("Something went wrong.", 'error');
    return { success: false, error: err };
  }
};

/* ----------  Utility Functions for Event Management ---------- */
export const subscribeToAuthEvents = (callbacks) => {
  const unsubscribers = [];
  
  if (callbacks.onLogin) {
    unsubscribers.push(eventManager.on('user:login', callbacks.onLogin));
  }
  
  if (callbacks.onLogout) {
    unsubscribers.push(eventManager.on('user:logout', callbacks.onLogout));
  }
  
  if (callbacks.onRegister) {
    unsubscribers.push(eventManager.on('user:register', callbacks.onRegister));
  }
  
  // Return function to unsubscribe all
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};