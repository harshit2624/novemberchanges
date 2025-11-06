const settings = {
  "name": "frontity-custom",
  "state": {
    "frontity": {
      "url": "https://www.croscrow.com",
      "title": "Croscrow",
      "description": "Croscrow"
    }
  },
  libraries: {
    html: {
      head: [
        // Firebase core
        {
          tag: "script",
          attrs: {
            src: "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js",
          },
        },
        {
          tag: "script",
          attrs: {
            src: "https://www.gstatic.com/firebasejs/11.9.1firebase-auth-compat.js",
          },
        },
        // Your inline Firebase config script
        {
          tag: "script",
          attrs: { type: "text/javascript" },
          content: `
            const firebaseConfig = {
              apiKey: "AIzaSyAzgMPPJQ_cYlxlbzf1z6zEzXcbGoOex_M",
              authDomain: "croscrow-91f68.firebaseapp.com",
              projectId: "croscrow-91f68",
              storageBucket: "croscrow-91f68.firebasestorage.app",
              messagingSenderId: "377807834172",
              appId: "1:377807834172:web:1d589882b6d9859dedc739"
            };
            firebase.initializeApp(firebaseConfig);
            const provider = new firebase.auth.GoogleAuthProvider();
          `,
        },
      ],
    },
  },
  "packages": [
    {
      "name": "@frontity/twentytwenty-theme",
      "state": {
        "theme": {
          colors: {
            primary: "#002eff",
          },
          "menu": [
            [
              "Home",
              "/"
            ],
            [
              "Nature",
              "/category/nature/"
            ],
            [
              "Travel",
              "/category/travel/"
            ],
            [
              "Japan",
              "/tag/japan/"
            ],
            [
              "About Us",
              "/about-us/"
            ]
          ],
          "featured": {
            "showOnList": false,
            "showOnPost": false
          }
        }
      }
    },
    {
      name: "@frontity/wp-source",
      state: {
        source: {
          url: "https://www.croscrow.com/a",
          homepage: "/home-page-new/",
          postTypes: [
            {
              type: "product",
              endpoint: "product",
              archive: "/products"
            }
          ],
          taxonomies: [
            {
              taxonomy: "product_cat",
              endpoint: "product_cat",
              postTypeEndpoint: "products"
            },
            {
              taxonomy: "product_brand",
              endpoint: "product_brand",
              postTypeEndpoint: "products"
            }
          ]
        }
      }
    },
    "@frontity/tiny-router",
    "@frontity/html2react"
  ]
};

export default settings;
