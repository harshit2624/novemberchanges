import axios from "axios";

const woocommerceHandler = {
  name: "woocommerce-products",
  priority: 10,
  pattern: "/product/:slug",
  func: async ({ link, params, state }) => {
    const { slug } = params;
    
    try {
      // Fetch data from WooCommerce API
      const response = await axios.get(
        `https://www.croscrow.com/a/wp-json/wc/v3/products?slug=${slug}`,
        {
          auth: {
            username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
            password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
          },
        }
      );

      const product = response.data[0]; // Get the first product

      // Store product in the state
      state.source.data[link] = {
        type: "product",
        id: product.id,
        isProduct: true,
      };

      state.source.product = state.source.product || {};
      state.source.product[product.id] = product;

    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  },
};

export default woocommerceHandler;
