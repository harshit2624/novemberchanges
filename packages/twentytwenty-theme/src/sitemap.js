console.log("Sitemap handler loaded");

const sitemapHandler = {
  pattern: "/sitemap.xml",
  priority: 1,
  func: async ({ state, libraries }) => {
    state.source.data["/sitemap.xml"] = {
      isSitemap: true,
      isReady: true,
      sitemap: "hi",
    };
  },
};

export default sitemapHandler;
