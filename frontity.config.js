// frontity.config.js

const path = require("path");

export default {
  webpack: async (config, { isServer }) => {
    config.resolve.extensions.push(".mjs");

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  }
};
