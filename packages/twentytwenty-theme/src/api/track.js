import axios from "axios";

const getWpBaseUrl = () => {
    return `https://www.croscrow.com/a`;
};

export const trackFbqEvent = async (eventName, params = {}) => {
  const apiUrl = getWpBaseUrl();
  const endpoint = `${apiUrl}/wp-json/fb-pixel-event-tracker/v1/track`;

  let itemName = null;
  let itemPhoto = null;
  let productId = null;

  if (params && params.contents && params.contents.length > 0) {
    productId = params.contents[0].id;
    itemName = params.contents[0].id; // Fallback to id if name not available
  } else if (params && params.content_name) {
    itemName = params.content_name;
  }

  if (params && params.content_ids && params.content_ids.length > 0) {
    productId = params.content_ids[0];
  }

  if (productId) {
    try {
      const productResponse = await axios.get(`${apiUrl}/wp-json/wc/v3/products/${productId}`);
      const product = productResponse.data;
      if (product) {
        itemName = product.name;
        if (product.images && product.images.length > 0) {
          itemPhoto = product.images[0].src;
        }
      }
    } catch (error) {
      console.error("Error fetching product data for tracking:", error);
    }
  }


  const data = {
    eventName,
    itemName,
    itemPhoto,
  };

  // This is a fire and forget request, so we don't need to handle the response
  axios.post(endpoint, data).catch(err => {
    console.error('Error tracking event', err);
  });
};