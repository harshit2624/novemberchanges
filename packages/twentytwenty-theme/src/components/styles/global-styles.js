import { css } from "frontity";


const cssReset = css`
  html,
  body {
    border: none;
    margin: 0;
    padding: 0;
    background: transparent !important;
    width: 100%;
    font-family: "Roboto", sans-serif !important;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  div,
  strong,
  blockquote,
  address,
  big,
  cite,
  code,
  em,
  font,
  img,
  small,
  strike,
  sub,
  sup,
  li,
  ol,
  ul,
  fieldset,
  form,
  label,
  legend,
  button,
  table,
  caption,
  tr,
  th,
  td {
    border: none;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    text-align: inherit;
    text-transform: uppercase !important;
    font-family: "Roboto", sans-serif !important;
  }

  blockquote::before,
  blockquote::after {
    content: "";
  }

  a,
  path {
    transition: all 0.15s linear;
  }
`;

/**
 * Styles for Document Setup.
 *
 * See `1. Document Setup` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const documentSetup = (colors) => css`
  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    background: ${colors.bodyBg};
    box-sizing: border-box;
    color: #000;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue",
      Helvetica, sans-serif;
    font-size: 1.8rem;
    letter-spacing: -0.015em;
    text-align: left;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    word-break: break-word;
    word-wrap: break-word;
  }

  #site-content {
    overflow: hidden;
  }
`;

const accessibilitySettings = css`
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  }
`;

/**
 * Styles for Element Base.
 *
 * See `2. Element Base` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const elementBase = (colors) => css`
  main {
    display: block;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .faux-heading {
    font-feature-settings: "lnum";
    font-variant-numeric: lining-nums;
    font-weight: 700;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem 0 2rem;
  }

  h1,
  .heading-size-1 {
    font-size: 3.6rem;
    font-weight: 800;
    line-height: 1.138888889;
  }

  h2,
  .heading-size-2 {
    font-size: 3.2rem;
  }

  h3,
  .heading-size-3 {
    font-size: 2.8rem;
  }

  h4,
  .heading-size-4 {
    font-size: 2.4rem;
  }

  h5,
  .heading-size-5 {
    font-size: 2.1rem;
  }

  h6,
  .heading-size-6 {
    font-size: 1.6rem;
    letter-spacing: 0.03125em;
    text-transform: uppercase;
  }

  p {
    line-height: 1.5;
    margin: 0 0 1em 0;
  }

  em,
  i,
  q,
  dfn {
    font-style: italic;
  }

  em em,
  em i,
  i em,
  i i,
  cite em,
  cite i {
    font-weight: bolder;
  }

  big {
    font-size: 1.2em;
  }

  small {
    font-size: 0.75em;
  }

  b,
  strong {
    font-weight: 700;
  }

  ins {
    text-decoration: underline;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup {
    top: -0.5em;
  }

  sub {
    bottom: -0.25em;
  }

  abbr,
  acronym {
    cursor: help;
  }

  address {
    line-height: 1.5;
    margin: 0 0 2rem 0;
  }

  hr {
    border-style: solid;
    border-width: 0.1rem 0 0 0;
    border-color: ${colors.gray.light};
    margin: 4rem 0;
  }

  a {
    color: ${colors.primary};
    text-decoration: underline;
  }

  a:hover,
  a:focus {
    text-decoration: none;
  }
`;

const elementBase700 = css`
  @media (min-width: 700px) {
    h1,
    .heading-size-1,
    h2,
    .heading-size-2,
    h3,
    .heading-size-3 {
      margin: 6rem auto 3rem;
    }

    h4,
    .heading-size-4,
    h5,
    .heading-size-5,
    h6,
    .heading-size-6 {
      margin: 4.5rem auto 2.5rem;
    }

    h1,
    .heading-size-1 {
      font-size: 6.4rem;
    }

    h2,
    .heading-size-2 {
      font-size: 4.8rem;
    }

    h3,
    .heading-size-3 {
      font-size: 4rem;
    }

    h4,
    .heading-size-4 {
      font-size: 3.2rem;
    }

    h5,
    .heading-size-5 {
      font-size: 2.4rem;
    }

    h6,
    .heading-size-6 {
      font-size: 1.8rem;
    }
  }
`;

const elementBase1220 = css`
  @media (min-width: 1220px) {
    h1,
    .heading-size-1 {
      font-size: 8.4rem;
    }
  }
`;

const listStyle = css`
  ul,
  ol {
    margin: 0 0 3rem 3rem;
  }

  ul {
    list-style: disc;
  }

  ul ul {
    list-style: circle;
  }

  ul ul ul {
    list-style: square;
  }

  ol {
    list-style: decimal;
  }

  ol ol {
    list-style: lower-alpha;
  }

  ol ol ol {
    list-style: lower-roman;
  }

  li {
    line-height: 1.5;
    margin: 0.5rem 0 0 2rem;
  }

  li > ul,
  li > ol {
    margin: 1rem 0 0 2rem;
  }

  .reset-list-style,
  .reset-list-style ul,
  .reset-list-style ol {
    list-style: none;
    margin: 0;
  }

  .reset-list-style li {
    margin: 0;
  }

  dt,
  dd {
    line-height: 1.5;
  }

  dt {
    font-weight: 700;
  }

  dt + dd {
    margin-top: 0.5rem;
  }

  dd + dt {
    margin-top: 1.5rem;
  }
`;

/**
 * Styles for blockquotes.
 *
 * See `2. Element Base / Quotes` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const quoteStyle = (colors) => css`
  blockquote {
    border-color: ${colors.primary};
    border-style: solid;

    /*rtl:ignore*/
    border-width: 0 0 0 0.2rem;
    color: inherit;
    font-size: 1em;
    margin: 4rem 0;

    /*rtl:ignore*/
    padding: 0.5rem 0 0.5rem 2rem;
  }

  cite {
    color: ${colors.gray};
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.25;
  }

  blockquote cite {
    display: block;
    margin: 2rem 0 0 0;
  }

  blockquote p:last-child {
    margin: 0;
  }
`;

/**
 * Styles for code elements.
 *
 * See `2. Element Base / Code` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const codeStyle = (colors) => css`
  code,
  kbd,
  pre,
  samp {
    font-family: monospace;
    font-size: 0.9em;
    padding: 0.4rem 0.6rem;
  }

  code,
  kbd,
  samp {
    background: rgba(0, 0, 0, 0.075);
    border-radius: 0.2rem;
  }

  pre {
    border: 0.1rem solid ${colors.gray.light};
    line-height: 1.5;
    margin: 4rem 0;
    overflow: auto;
    padding: 3rem 2rem;
    text-align: left;
  }

  pre code {
    background: transparent;
    padding: 0;
  }
`;

/**
 * Styles for media elements.
 *
 * See `2. Element Base / Media` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const mediaStyle = (colors) => css`
  figure {
    display: block;
    margin: 0;
  }

  iframe {
    display: block;
    max-width: 100%;
  }

  video {
    display: block;
  }

  svg,
  img,
  embed,
  object {
    display: block;
    height: auto;
    max-width: 100%;
  }

  figcaption,
  .wp-caption-text {
    color: ${colors.gray.base};
    display: block;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 1.5rem;
  }

  figcaption a,
  .wp-caption-text a {
    color: inherit;
  }
`;

/**
 * Styles for tables.
 *
 * See `2. Element Base / Tables` at
 * https://themes.trac.wordpress.org/browser/twentytwenty/1.7/style.css.
 *
 * @param colors - Object with color definitions, from `state.theme.colors`.
 * @returns Serialized style.
 */
const tableStyles = (colors) => css`
  table {
    border: 0.1rem solid ${colors.gray.light};
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    font-size: 1.6rem;
    margin: 4rem 0;
    max-width: 100%;
    overflow: hidden;
    width: 100%;
  }

  .alignleft > table {
    margin: 0;
  }

  .alignright > table {
    margin: 0;
  }

  th,
  td {
    border: 0.1rem solid ${colors.gray.light};
    line-height: 1.4;
    margin: 0;
    overflow: visible;
    padding: 0.5em;
  }

  caption {
    background: ${colors.gray.light};
    font-weight: 600;
    padding: 0.5em;
    text-align: center;
  }

  thead {
    vertical-align: bottom;
    white-space: nowrap;
  }

  th {
    font-weight: 700;
  }
`;

const headerPageStyle = css`
  header[class*="PageHeader"] {
    display: flex;
    max-width: 1680px;
    margin: 0 auto;
    padding-inline: 5rem;
  }
  header[class*="PageHeader"] div[class*="HeaderInner"] {
    padding: 0px;
    display: grid;
    grid-template-columns: 15% 65% 20%;
    margin: 0;
    gap: 20px;
    width: 100%;
  }
  div[class*="HeaderNavigationWrapper"] {
    width: 100%;
  }
  div[class*="searchGrid"] {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-color: #14181B #fff;
    scrollbar-width: thin;
    padding-right: 20px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
    position: absolute;
    background: #fff;
    width: 50%;
    top: 85px;
    margin: 0 0 0 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li {
    margin: 0 0 15px 0;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] p[class*="no-results"] {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
    letter-spacing: 0%;
  }
  div[class*="CartWrapper"],
  div[class*="WishlistWrapper"],
  .Myaccount {
    background: #F3F4F6;
    padding: 8px;
    border-radius: 5px;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li a img {
    height: 80px;
    width: 80px;
    object-fit: contain;
  }
  div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] li a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #14181B;
    gap: 10px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
    width: 80%;
  }
  div[class*="accountIcon"] {
    justify-content: flex-end;
    margin-right: 20px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] button[class*="SearchButton"] {
    background: #14181B;
    padding: 12px 21px;
    border-color: #14181b;
    margin-left: -71px;
  }
  div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] input[class*="SearchInput"] {
    background-color: #F0F0F0 !important;
    border: none;
    padding: 15px 16px;
    font-weight: 300;
  }
  header[class*="PageHeader"] div[class*="HeaderTop"] {
      padding: 0;
  }
  @media (max-width: 767px) {
    header[class*="PageHeader"] {
      max-width: 100%;
      padding-inline: 20px;
      justify-content: space-between;
      margin-block: 20px 0;
    }
    .mega-sale-price {
      font-size: 11px !important;
    }
    header[class*="PageHeader"] div[class*="HeaderTop"] {
      grid-column: 1 / 2;
      order: 1;
    }
    div[class*="HeaderNavigationWrapper"] {
      display: block;
      order: 3;
      grid-column: 1 / -1;
    }
    div[class*="accountIcon"] {
      order: 2;
      grid-column: 2 / 4;
      margin-right: 0;
    }
    div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
      width: 100%;
    }
    header[class*="PageHeader"] div[class*="HeaderInner"] {
      margin: 0;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 0;
    }
    header[class*="PageHeader"] div[class*="ToggleWrapper"] button {
      left: 50%;
      transform: translateX(-50%);
    }
    div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
      width: 100%;
    }
    div[class*="searchGrid"] {
      max-height: 300px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    header[class*="PageHeader"] {
      max-width: 100%;
      padding-inline: 20px;
      justify-content: space-between;
    }
    div[class*="HeaderNavigationWrapper"] {
      display: block;
    }
    header[class*="PageHeader"] div[class*="ToggleWrapper"] button {
      left: 50%;
      transform: translateX(-50%);
    }
    header[class*="PageHeader"] div[class*="HeaderInner"] {
      grid-template-columns: 15% 58% 20%;
    }
    div[class*="HeaderNavigationWrapper"] form[class*="SearchForm"] {
      width: 100%;
    }
    div[class*="HeaderNavigationWrapper"] ul[class*="ResultList"] {
      width: 100%;
    }
    div[class*="accountIcon"] {
      margin-right: 0;
    }
  }
`;

const PostArticle = css`
  header[class*="PostHeader-Header"] {
    display: none;
  }
`;

const PageWidth = css`
  div[class*="global_custom_class"],
  div[class*="category_page_main_class"],
  div[class*="product-main-class"],
  div[class*="related_products_section"],
  nav[class*="product-page-breadcrumbs"],
  div[class*="wishlist-container"],
  div[class*="order-details"],
  div[class*="thankYouWrapper"],
  h2[class*="global_custom_class"] {
    max-width: 1680px !important;
    margin: 0 auto !important;
    padding-inline: 5rem !important;
  }
  @media (max-width: 767px) {
      div[class*="global_custom_class"],
      div[class*="category_page_main_class"],
       div[class*="thankYouWrapper"],
      div[class*="product-main-class"],
      div[class*="order-details"],
      nav[class*="product-page-breadcrumbs"],
      div[class*="wishlist-container"],
      div[class*="CartContainer"],
      h2[class*="global_custom_class"] {
        max-width: 100% !important;
        padding-inline: 15px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
      div[class*="global_custom_class"],
      div[class*="category_page_main_class"],
      div[class*="thankYouWrapper"],
      div[class*="order-details"],
      div[class*="product-main-class"],
      div[class*="wishlist-container"],
      nav[class*="product-page-breadcrumbs"],
      div[class*="CartContainer"],
      h2[class*="global_custom_class"] {
        max-width: 100% !important;
        padding-inline: 25px !important;
    }
  }
`

const BannerSection = css`
  div[class*="SectionContainer-PostInner"] {
    max-width: 100%;
    margin: 0px;
    padding: 0px;
    width: 100%;
  }
  div[class*="EntryContent"] {
    width: 100%;
    max-width: 100%;
    border-top: 1px solid #0000001A;
    padding-top: 30px;
  }
  div[class*="homepage_banner"] {
    padding-inline: 35px;
    margin-bottom: 40px;
  }
  div[class*="homepage_banner"] figure {
    margin: 0;
  }
  div[class*="homepage_banner"] img {
    width: 100%;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] {
    overflow: hidden;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li img {
    width: 100%;
    aspect-ratio: 1000 / 584; /* Keeps height proportional */
    object-fit: cover;        /* Ensures the image doesn’t get stretched */
    border-radius: 9px;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
   padding-inline: 20px;
  }
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul,
  div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
    margin: unset;
  }
  @media (max-width: 767px) {
    div[class*="homepage_banner"] {
      padding-inline: 15px;
      margin-bottom: 15px;
    }
    div[class*="homepage_banner"] div[class*="enhanced-slider-initialized"] ul li {
      padding-inline: 0;
      aspect-ratio: 1000 / 584; 
      height: auto;
    }
    div[class*="homepage_banner"] div,
    div[class*="homepage_banner"] figure,
    div[class*="homepage_banner"] img {
      height: 100%;
      border-radius: 10PX;
    }
  }
`;

const BrandsTopsSection = css`
  div[class*="brands_tops_section"] {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: no-wrap;
    scrollbar-width: none;
    overflow-x: auto;
  }
  div[class*="brands_tops_section"] .wp-block-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 16%;
    max-width: 16%;
    width: 100%;
  }
  div[class*="brands_tops_section"] .wp-block-image, div[class*="brands_tops_section"] .wp-block-heading {
    margin: 0;
    font-weight: 300;
  }
  div[class*="brands_tops_section"] span[class*="Container"] {
   padding-bottom: unset;
  }
  div[class*="brands_tops_section"] span[class*="Container"] img {
   position: static;
  }
  @media(max-width: 767px) {
      div[class*="brands_tops_section"] {
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow-x: scroll;
        scrollbar-width: none;
      }
      div[class*="brands_tops_section"] .wp-block-column {
        width: 100%;
        min-width: 32%;
        max-width: 32%;
      }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
      div[class*="brands_tops_section"] {
        padding-inline: 25px 0 !important;
        flex-wrap: nowrap;
        overflow-x: scroll;
        scrollbar-width: none;
      }
      div[class*="brands_tops_section"] .wp-block-column {
        min-width: 22%;
        max-width: 22%;
        width: 100%;
      }
  }
  @media screen and (min-width: 992px) and (max-width: 1200px) {
      div[class*="brands_tops_section"] {
        padding-block: 30px 0;
      }
  }
`;

const ShopBySections = css`
  div[class*="shop_by_cat_display"] ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    row-gap: 50px;
  }
  .category-products-section div[class*="Container"] {
    height: auto;
  }
  div[class*="shop_by_cat_display"] ul li {
    width: calc(100% / 4);
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    padding-inline: 30px;
    row-gap: 5px;
    position: relative;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image a {
    height: 100%;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price {
    display: flex;
    // flex-direction: column;
    gap: 10px;
    line-height: normal;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price del {
    text-decoration: none;
  }
  div[class*="shop_by_cat_display"] ul li .wc-block-components-product-price del bdi {
    text-decoration: line-through;
  }
  div[class*="shop_by_cat_display"] img {
    height: auto;
    width: auto;
    // max-height: 322px;
    // max-width: 322px;
    position: static;
    aspect-ratio: 4/5;
    object-fit: contain;
  }
  div[class*="shop_by_cat_display"] li span[class*="Container"] {
    padding-bottom: 0;
  }
  div[class*="shop_by_cat_display"] div[class*="wc-block-components-product-sale-badge"] {
    position: absolute;
    z-index: 1;
    background: rgb(0, 46, 255);
    padding: 5px 22px;
    color: #fff;
    font-size: 14px;
    border-radius: 20px;
    margin: 11px 0 0 10px;
  }
  div[class*="shop_by_cat_display"] div[class*="wc-block-components-product-sale-badge"] .screen-reader-text {
    display: none;
  }
  div[class*="shop_by_cat_display"] h3 a,
  div[class*="category_page_main_class"] .product-card a {
    color: rgb(20, 24, 27);
    text-decoration: none;
    // line-height: 22px;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="shop_by_cat_display"] h3 {
    padding-top: 8px;
  }
  div[class*="shop_by_cat_display"] h3,
  div[class*="category_page_main_class"] .product-card .product-name strong {
    margin: 0;
    font-weight: 400;
    font-size: 13px;
    padding-top: 0;
    line-height: 18px;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
    font-size: 18px;
    font-weight: bold;
  }
  div[class*="category_page_main_class"] div[class*="product-card"] .original-price,
  .original-price {
    text-decoration: line-through;
  }
  div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi,
  div[class*="category_page_main_class"] div[class*="product-card"] .regular-price,
  div[class*="category_page_main_class"] div[class*="product-card"] .original-price,
  .original-price,
  .regular-price {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #14181B;
    }
  div[class*="category_page_main_class"] div[class*="product-card"] .sale-price,
  .sale-price {
    font-size: 14px;
    font-weight: 600;
    font-family: "Roboto", sans-serif;
    line-height: 17px;
  }
  div[class*="view_all_button"] {
    border-block: 1px solid #57636C;
    padding-block: 8px;
    display: flex;
    justify-content: center;
    margin-block: 60px;
  }
  div[class*="view_all_button"] div[class*="wp-block-button"] {
    width: 100%;
    text-align: center;
  }
  div[class*="view_all_button"] a {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-decoration: none;
    color: #14181B;
    width: 100%;
    display: block;
  }
  div[class*="shop_by_cat_display"] .wishlist_button_wrapper {
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 767px) {
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 2);
      padding-inline: 10px;
    }
    div[class*="shop_by_cat_display"] ul li .wc-block-components-product-image {
      height: 100%;
      width: 100%;
    }
    div[class*="shop_by_cat_display"] h3 {
      padding-top: 0;
      min-height: unset;
    }
    div[class*="shop_by_cat_display"] img {
      height: 100%;
      width: 100%;
      aspect-ratio: 4/5;
    }
    div[class*="shop_by_cat_display"] ul {
      row-gap: 30px;
    }
    div[class*="view_all_button"] {
      margin-block: 25px 0;
      padding-block: 6px;
      margin-inline: 30px;
      border: 1px solid #57636C;
    }
    div[class*="category_page_main_class"] .product-card .product-name strong {
      -webkit-line-clamp: 1 !important;
      min-height: 18px;
    }
    div[class*="shop_by_cat_display"] .prod-grid-details span {
      line-height: 14px;
      margin-top: 10px;
    }
    div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi {
      font-size: 12px !important;
    }
    div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
      font-size: 13px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="shop_by_cat_display"] ul {
      justify-content: flex-start;
    }
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 3);
      padding-inline: 20px;
      align-items: center;
    }
    div[class*="wc-block-components-product-button"] {
      align-items: flex-start !important;
      margin-top: 10px;
  }
    div[class*="shop_by_cat_display"] ul li .wc-block-grid__product-image {
      height: 100%;
      width: 100%;
    }
    div[class*="shop_by_cat_display"] img {
      height: 100%;
      width: 100%;  
      aspect-ratio: 4/5;
    }
    div[class*="view_all_button"] {
      margin-block: 30px;
      padding-block: 5px;
      margin-inline: 30px;
      border: 1px solid #57636C;
    }
    div[class*="shop_by_cat_display"] .custom-sale-price span[class*="woocommerce-Price-amount"] bdi {
      font-size: 15px;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1360px) {
    div[class*="shop_by_cat_display"] ul li {
      width: calc(100% / 4);
      padding-inline: 20px;
      max-width: 340px;
    }
    div[class*="shop_by_cat_display"] ul {
      justify-content: space-evenly;
    }
  }
  // @media (min-width: 1440px) {
  //   div[class*="shop_by_cat_display"] span[class*="Container"] {
  //     padding-bottom: 85%;
  //   }
  // }
`;

const BestSeller = css`
  div[class*="best_seller_products_display"] ul {
    display: flex;
    margin: 0;
    gap: 25px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  div[class*="best_seller_products_display"] ul li {
    width: calc(100% / 12);
    margin: 0;
    list-style: none;
    min-width: calc(100% / 12);
  }
  .custom-product-item a {
    text-decoration: none;
  }
  div[class*="global_custom_class"].best_seller_products_display {
    padding-inline: 5rem 0px!important;
  }
  div[class*="best_seller_products_display"] ul li .wp-block-woocommerce-product-price,
  div[class*="best_seller_products_display"] ul li .wc-block-components-product-button,
  div[class*="best_seller_products_display"] ul li .wc-block-components-product-sale-badge {
    display: none;
  }
  div[class*="best_seller_products_display"] h3 {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #14181B;
    margin: 10px 0 0 0;
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  div[class*="best_seller_products_display"] h2,
  div[class*="shop_by_cat_display"] h2,
  h2[class*="shop_by_category_heading"],
  h2[class*="related-title"] {
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-variant: small-caps;
    color: #14181B;
    margin-block: 25px !important;
  }
  .related_products_section h2[class*="related-title"] {
    margin-block: 20px !important;
  }
  div[class*="best_seller_products_display"] h3 a {    
    text-decoration: none;
    color: #14181B;
  }
  div[class*="best_seller_products_display"] span[class*="Container"] {
    padding-bottom: 100%;
  }
  div[class*="best_seller_products_display"] span[class*="Container"] img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: contain;
  }
  @media screen and (min-width: 992px) and (max-width: 1440px) {
      div[class*="best_seller_products_display"] ul li {
        width: calc(100% / 10);
        min-width: calc(100% / 10);
        margin: 0;
        list-style: none;
      }
  }
  @media (max-width: 767px) {
    div[class*="global_custom_class"].best_seller_products_display {
      padding-inline: 15px 0 !important;
    }
    .related_products_section h2[class*="related-title"] {
      margin-block: 30px 10px !important;
    }
    div[class*="best_seller_products_display"] ul {
      gap: 0;
      justify-content: flex-start;
      row-gap: 30px;
      overflow-x: scroll;
      flex-wrap: nowrap;
      scrollbar-width: none;
    }
    div[class*="best_seller_products_display"] ul li {
      width: 100%;
      max-width: 28.5%;
      min-width: 28.5%;
      padding-inline: 10px;
    }
    div[class*="best_seller_products_display"] h2,
    div[class*="shop_by_cat_display"] h2,
    h2[class*="shop_by_category_heading"] {
      margin-block: 25px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="best_seller_products_display"] ul {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
    }
    div[class*="global_custom_class"].best_seller_products_display {
      padding-inline: 25px 0 !important;
    }
    div[class*="best_seller_products_display"] ul li {
      width: 100%;
      min-width: calc(100% / 8);
      max-width: calc(100% / 8);
    }
  }
`;

const ShopByCategories = css`
  div[class*="category_display"] {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
  }
  .product-price.custom-price .product-price {
    line-height: 18px;
  }
  .prod-grid-details .product-brand-home {
    margin: 0px;
    font-weight: 400;
    font-size: 11px;
    line-height: 12px;
    color: rgb(87, 99, 108);
    display: -webkit-box !important;
    -webkit-line-clamp: 1 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .prod-grid-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
  }
  .prod-grid-details .screen-reader-text {
    display: none;
  }
  .prod-grid-details ins {
    text-decoration: none;
  }
  div[class*="shop_by_cat_display"] .prod-grid-details ins bdi {
    font-weight: 600;
    font-size: 16px;
  }
  div[class*="category_display"] .wp-block-column {
    width: calc(100% / 4); 
    margin: 0;
    // flex-direction: column;
    // display: flex;
    // align-items: center;
    // justify-content: end;
  }
  div[class*="category_display"] .wp-block-column figure {
    margin: 0;
    height: 100%;
  }
  // div[class*="category_display"] .wp-block-column figure img {
  //   height: 100%;
  //   width: 100%;
  // }
  div[class*="category_display"] .wp-block-column figure span {
    height: 100%;
  }
  @media(max-width: 767px) {
    div[class*="category_display"] {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
      margin-top: 40px !important;
    }
    .prod-grid-details {
      // flex-direction: column;
      // align-items: flex-start;
      gap: 0;
    }
    div[class*="category_display"] .wp-block-column {
      width: 100%;
      min-width: 70%;
      max-width: 70%;
    }
    div[class*="category_display"] .wp-block-column img {
      height: auto;
    }
    h2[class*="shop_by_category_heading"] {
      margin-block: 30px 10px !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="category_display"] .wp-block-column img {
      height: 100%;
    }
    div[class*="category_display"] .wp-block-column figure {
      margin: 0;
    }
    div[class*="category_display"] {
      flex-wrap: nowrap;
      overflow-x: scroll;
      scrollbar-width: none;
    }
    div[class*="category_display"] .wp-block-column {
      width: 100%;
      min-width: 33.33%;
      max-width: 33.33%;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1200px) {
    div[class*="category_display"] .wp-block-column img {
      height: 100%;
    }
    div[class*="category_display"] .wp-block-column figure {
      margin: 0;
    }
  }
`;

const Footer = css`
  footer[class*="SiteFooter"] {
    margin: 0;
    padding: 0;
    z-index: 9;
  }
  div[class*="SectionContainer-SiteFooterInner"] {
    display: none;
  }
  div[class*="footer_custom_class"] {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #FDF9F9;
    padding-block: 8px;
  }
  @media (max-width: 767px) {
    footer[class*="SiteFooter"] {
      padding-block: 12px;
      position: sticky;
      width: 100%;
      bottom: 0;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 20px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    footer[class*="SiteFooter"] {
      position: sticky;
      width: 100%;
      bottom: 0;
    }
  }
  @media screen and (min-width: 994px) and (max-width: 1440px) {
    div[class*="footer_custom_class"] {
      padding-block: 20px;
    } 
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 30px;
      width: 30px;
    }
  }
`;

const CategoryPage = css`
  div[class*="category_page_main_class"] div[class*="product-list"] {
    display: flex;
    flex-wrap: wrap;
    row-gap: 38px;
    margin-top: 20px;
  }
.filter-dropdown {
  display: flex;
}

.filter-dropdown label {
  font-weight: bold;
  font-size: 14px;
}

.filter-dropdown select {
  border-radius: 6px;
  font-size: 13px;
  background: transparent;
  outline: none;
  transition: border 0.3s ease;
  border: none;
}

.filter-dropdown select:hover {
  border-color: #888;
}

 .sort-toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px; /* space between icon & text */
  }
  .sort-toggle-btn .icon {
    font-size: 18px;
  }
  .sort-panel {
    transition: transform 0.4s ease-in-out;
    z-index: 999;
    display: flex;
    gap: 20px;
  }
  div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"]  {
   width: calc(100% / 4);
   padding-inline: 10px;
   min-height: max-content;
   height: 100%;
   position: relative;
  }
  div[class*="category_page_main_class"] .product-card .brand-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    color: #57636C;
    margin-block: 10px 0;
  }
  div[class*="category_page_main_class"] .product-card .product-name strong {
    min-height: unset !important;
  }
  div[class*="category_page_main_class"] .product-card .product-name {
    margin: 0;
  }
  div[class*="cat_prod_action"] {
      z-index: 0;
      display: flex;
      flex-direction: row-reverse;
      gap: 10px;
  }
  div[class*="category_page_main_class"] .product-card img,
  div[class*="wishlist-container"] ul[class*="wishlist-list"] li img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    margin: 0 auto;
    aspect-ratio: 4 / 5;
  }
  div[class*="category_page_main_class"] .product-card button,
  div[class*="wishlist-container"] button[class*="add-to-cart-button"],
  button[class*="related_product_addtocart"],
  button[class*="add_to_cart_button"],
  a[class*="add_to_cart_button"] {
    font-size: 0 !important;
    text-indent: -9999px;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    border: none !important;
    background: none !important;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    color: #666;
    margin: 0;
    display: flex;
  }
  div[class*="shop_by_cat_display"] button[class*="add_to_cart_button"]::before,
  div[class*="shop_by_cat_display"] a[class*="add_to_cart_button"]::before {
    left: 100%;
  }
  .wishlist_button
  .product-wishlist-button,
  .related_product_wishlist {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  } 

  .wishlist_button:hover,
  .product-wishlist-button:hover,
  .related_product_wishlist:hover {
    transform: scale(1.1);
  }

  .wishlist_button svg
  .product-wishlist-button svg,
  .related_product_wishlist svg {
    display: block;
  }

.wishlist_button {
  background: transparent;
}
.wishlist_button .heart-fill,
.product-wishlist-button .heart-fill,
.related_product_wishlist svg .heart-fill {
  stroke: #333;
  stroke-width: 50px;
  transition: fill 0.3s ease;
  fill: transparent;
}

.wishlist_button.active .heart-fill,
.product-wishlist-button.active .heart-fill,
.related_product_wishlist.active .heart-fill {
  fill: rgb(20, 24, 27);
  stroke: #fff;
  background: transparent;
}
  .product-wishlist-button {
    border: 1px solid;
    padding-inline: 10px;
    padding: 9px 6px;
    border-radius: 5px;
    background: transparent;
  }
  div[class*="category_page_main_class"] .product-card button[class*="add_to_cart_button"]::before,
  button[class*="add_to_cart_button"]::before,
  a[class*="add_to_cart_button"]::before,
  button[class*="related_product_addtocart"]::before {
    content: "";
    background: url("data:image/png;base64,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");
    font-size: 20px;
    position: absolute;
    z-index: 5;
    top: 50%;
    text-indent: 0px;
    background-repeat: no-repeat;
    left: 50%;
    height: 100%;
    transform: translate(-50%, -50%);
    width: 100%;
    background-size: 25px;
    display: flex;
    align-item: center;
  }
  div[class*="wc-block-components-product-button"] {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
  }
  .new_in_wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 6px;
  }
  .new_in_wrapper span {
    font-family: Roboto;
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0%;
    color: #2149FF;
  }
  @media (max-width: 767px) {
    div[class*="category_page_main_class"] div[class*="product-list"] {
      margin-top: 30px;
    }
    // .product-wishlist-button {
    //   padding: 3px 7px;
    // }
    // .wishlist_button .heart-fill, .product-wishlist-button .heart-fill, .related_product_wishlist svg .heart-fill {
    //   stroke-width: 30px;
    // }
    // .product-wishlist-button svg {
    //   height: 20px !important;
    //   width: 15px !important;
    // }
    .action-sec {
      margin-top: 5px;
    }
    .new_in_wrapper {
      margin-top: 0;
    }
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"] {
        width: calc(100% / 2);
    }
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"].list-view {
        width: 100%;
    }
    div[class*="rel_detail_sec"] {
      // align-items: flex-start !important;
    }
    div[class*="rel_detail_sec"], div[class*="cat_detail_sec"] {
      gap: 0 !important;
      row-gap: 0 !important;
    }
    div[class*="product_name_related"], div[class*="related_product_price"] {
      min-height: unset !important;
    }
    div[class*="wc-block-components-product-button"] {
      align-items: flex-start;
      // margin-top: 10px;
    }
    div[class*="category_page_main_class"] .product-card button[class*="add_to_cart_button"]::before, div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before, button[class*="add_to_cart_button"]::before, a[class*="add_to_cart_button"]::before, button[class*="related_product_addtocart"]::before,
    div[class*="category_page_main_class"] .product-card button[class*="wishlist_button"]::before, button[class*="wishlist_button"]::before {
      background-size: 18px;
    }
    div[class*="category_page_main_class"] .product-card button, div[class*="wishlist-container"] button[class*="add-to-cart-button"], button[class*="related_product_addtocart"], button[class*="add_to_cart_button"], a[class*="add_to_cart_button"], button[class*="wishlist_button"] {
      width: 19px !important;
      height: 20px !important;
    }

  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="category_page_main_class"] div[class*="product-list"] div[class*="product-card"]  {
      width: calc(100% / 2);
      max-width: 250px;
    }
    div[class*="category_page_main_class"] div[class*="product-list"] {
      margin-block: 20px 70px;
      justify-content: space-between;
      max-width: 600px;
      margin: 0 auto;
    }
    div[class*="category_page_main_class"] .product-card button {
      margin-right: 0;
    }
  }
`;

const ProductPage = css`
  footer[class*="SiteFooter"] {
    margin: 0;
    padding: 0;
  }
  h4[class*="available-coupons"] {
    margin: 20px 0;
    color: #14181B;
  }
  .related-products-show div[class*="related_product_price_con"] {
    display: flex !important;
  }
  div[class*="SectionContainer-SiteFooterInner"] {
    display: none;
  }
  div[class*="footer_custom_class"] {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #FDF9F9;
    padding-block: 28px;
  }
  div[class*="product-image-gallery"] {
   overflow: hidden;
   width: 50%;
   height: 615px;
  }
  div[class*="image-gallery-thumbnails"] {
   width: 16% !important;
   height: 100% !important;
  }
  div[class*="image-gallery-thumbnails"] .swiper-slide {
   height: 100px !important;
  }
  div[class*="image-gallery-thumbnails"] .swiper-slide img {
   height: 100px !important;
   width: 100px !important;
   object-fit: contain !important;
  }
  div[class*="product-main-image"] {
   width: 82% !important;
   overflow: hidden;
   height: 100% !important;
  }
  div[class*="product-main-image"] .swiper-wrapper {
    display: flex;
    height: 100%;
  }
  div[class*="product-main-image"] .swiper-wrapper .swiper-slide {
    width: 100% !important;
    max-width: 100%;
    min-width: 100%;
  }
  div[class*="product-main-image"] img {
    width: 100% !important;
    border: 1px solid #00000033 !important;
    height: 100% !important;
  }
  h2[class*="product-name-title"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 32px;
    line-height: 34px;
    color: #14181B;
    margin: 24px 0 12px 0;
  }
  div[class*="product-brandname"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: rgb(87, 99, 108);
  }
  div[class*="product-main-class"] {
    display: flex;
    gap: 45px;
  }
  div[class*="product-desc-details"] {
   width: 50%;
  }
  div[class*="product-desc-details"] div[class*="product-price"] span {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px !important;
    line-height: 20px;
    color: #14181B;
  }
  div[class*="swiper-button-prev"],
  div[class*="swiper-button-next"] {
    padding: 5px 14px;
    background: #000;
  }
  div[class*="swiper-button-prev"].swiper-button-lock,
  div[class*="swiper-button-next"].swiper-button-lock {
    display: none;
  }
  div[class*="swiper-button-prev"]::before,
  div[class*="swiper-button-next"]::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-left: 3px solid #fff;
    border-top: 3px solid #fff;
  }
  div[class*="swiper-button-prev"]::before {
    transform: rotate(45deg);
  }
  div[class*="swiper-button-next"]::before {
    transform: rotate(-135deg);
  }
  nav[class*="product-page-breadcrumbs"] {
    margin-block: 20px !important;
  }
  div[class*="product-brandname"],
  div[class*="product-variants"] {
    margin-block: 14px !important;
  }
  div[class*="product-variants"] {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  div[class*="attribute-display"],
  div[class*="variant-select"] button {
    border: 1px solid rgb(87, 99, 108) !important;
    padding: 9px 18px !important;
    border-radius: 4px !important;
    font-size: 14px !important;
    line-height: normal;
  }
  div[class*="attribute-display"].active {
    background: #14181B;
    color: #FFFFFF;
  }
  button[class*="product-addtocart-button"] {
    background: #14181B;
    color: #FFFFFF;
    padding: 13px 65px;
    border-radius: 5px;
    cursor: pointer;
  }
  button[class*="product-addtocart-button"].addBTN {
    background: transparent;
    color: rgb(20, 24, 27);
    border: 1px solid rgb(20, 24, 27);
  }
  div[class*="product-desc-main"] {
    margin-block: 40px;
  }
  div[class*="BenefitWrapper"] {
    margin: 15px 0px;
  }
  div[class*="product-description-title"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    color: #57636C;
    display: flex;
    gap: 10px;
  }
  div[class*="product-description-content"] p {
      font-family: "Roboto", sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 16px;
      color: #57636C;
      margin-top: 14px;
  }
  div[class*="related_products_section"].also-like-section {
    max-width: 100% !important;
    padding-inline: 0 !important;
  }
  div[class*="related_products_section"] .related-products-show {
   display: flex;
   row-gap: 20px;
   overflow-x: auto;
   scrollbar-width: none;
  }
  div[class*="related_products_section"] .related-products-show .related-products {
    width: calc(25% - 1vw);
    height: 100%;
    border: none !important;
    min-width: calc(25% - 1vw);
  }
  div[class*="related_products_section"] .related-products-show .related-products img {
    height: 100%;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
    max-height: 260px;
    object-fit: contain;
    aspect-ratio: 4 / 5;
  }
  div[class*="related_products_section"] .related-products-show .related-products .rel_prod_action {
    display: flex;
    align-items: center;
  }
  div[class*="product_brand_name_related"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 11px;
    line-height: 12px;
    color: #57636C;
    margin-block: 10px 0;
  }
  div[class*="product_name_related"],
  div[class*="related_product_price"] {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #14181B;
    line-height: 18px;
    display: -webkit-box!important;
    -webkit-line-clamp: 2!important;
    -webkit-box-orient: vertical!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
  }
  div[class*="rel_detail_sec"],
  div[class*="cat_detail_sec"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  div[class*="coupon-img-display"] {
   display: flex;
   padding-inline: 13px;
  }
  div[class*="coupon-container"] {
   display: grid;
   width: 100%;
   grid-template-columns: 20% 55% 25%;
   align-items: center;
  }
  p[class*="get-it-in"] {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    color: #14181B;
    margin: 8px 0 4px 0;
  }
  p[class*="coupon-text"] {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 14px;
    margin: 0 0 8px 0;
    color: #57636C;
  }
  span[class*="coupon-code"] {
     border: 1px dashed #57636C;
     color: rgb(0, 46, 255);
     border-radius: 4px;
    padding: 8px 15px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
  }
  div[class*="percentage-off-display"] {
    color: #57636C;
    border: 1px solid #57636C;
    border-radius: 4px;
    padding: 8px 15px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
  }
  div[class*="coupon-offer-discount"] {
    border: 1px solid #14181B;
  }
  div[class*="coupon-display"] {
    width: 80%;
  }
  div[class*="copy-coupon"] {
    display: flex;
    border-top: 1px solid #14181B;
    border-radius: 5px;
    padding: 8px 13px 9px 13px;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }
  div[class*="copy-coupon"] .use-code {
    margin: 0;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #57636C;
    line-height: 20px;
    text-transform: uppercase;
  }
  div[class*="copy-coupon"] .coupon-code {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: #14181B;
    text-transform: uppercase;
  }
  div[class*="offer-title"] {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  div[class*="offer-title"] p {
    margin: 0;
  }
  button[class*="see-all-btn"] {
    width: 100%;
    background: rgb(20, 24, 27);
    padding: 9px 16px;
    border-radius: 4PX;
    color: #fff;
    text-align: center;
    font-family: "Roboto", sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height: 40px;
  }
  div[class*="product-buttons-action"] {
    display: flex;
    align-items: center;
    margin-top: 40px;
    gap: 12px;
  }
  .similarProd div[class*="Container"]{
    height: unset !important;
  }
  .product-desc-details p {
    font-size: 14px;
  }
  @media(max-width: 1380px) {
      div[class*="related_products_section"] .related-products-show .related-products {
        width: calc(33% - 1vw);
        min-width: calc(33% - 1vw);
      }
  }
  @media (max-width: 767px) {
    footer[class*="SiteFooter"] {
      padding-block: 12px;
    }
    .product-features button {
      padding: 7px !important;
      height: fit-content !important;
      font-size: 12px !important;
    }
    .product-desc-details p {
      font-size: 12px !important;
    }
    .rel_prod_desc {
      max-width: 75%;
    }
    .coupon-img {
     max-height: 18px !important;
    }
    div[class*="product-main-image"] img {
     border: none !important;
    }
    div[class*="product-main-image"] {
      width: 100% !important;
    }
    div[class*="product-description-title"] {
      font-size: 13px;
      justify-content: space-between;
      grid-template-columns: 30% 50% 20%;
      display: grid !important;
    }
    div[class*="product-description-title"] > span {
      font-size: 13px;
    }
    div[class*="product-description-title"] .icon {
      position: absolute;
      right: 10px;
    }
    div[class*="product-description-content"] p {
      font-size: 12px;
      margin-top: 10px;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 20px;
    }
    div[class*="product-main-class"] {
      flex-direction: column;
    }
    div[class*="product-desc-details"],
    div[class*="product-image-gallery"] {
      width: 100%;
    }
    div[class*="product-image-gallery"] {
      flex-direction: row-reverse;
      margin-top: 0px !important;
    }
    div[class*="swiper-button-prev"], div[class*="swiper-button-next"] {
      transform: translateX(-50%);
      left: 50% !important;
    }
    div[class*="swiper-button-prev"]::before, div[class*="swiper-button-next"]::before {
      width: 8px;
      height: 8px;
      border-left: 1px solid rgb(255, 255, 255);
      border-top: 1px solid rgb(255, 255, 255);
    }
    div[class*="swiper-button-prev"], div[class*="swiper-button-next"] {
      padding: 2px 10px;
    }
    button[class*="product-addtocart-button"] {
      padding: 9px 22px;
      font-size: 12px;
    }
    div[class*="image-gallery-thumbnails"] .swiper-slide {
      height: 71px!important;
    }
    div[class*="image-gallery-thumbnails"] {
      height: inherit !important;
    }
    div[class*="image-gallery-thumbnails"] {
      display: none;
    }
    div[class*="image-gallery-thumbnails"] .swiper-slide img {
      height: 70px !important;
      width: 70px !important;
      object-fit: contain !important;  
    }
    h2[class*="product-name-title"] {
      font-size: 16px;
      line-height: 18px;
      margin: 10px 0px 12px;
    }
    div[class*="product-main-class"] {
      gap: 10px;
      margin-top: 25px !important;
    }
    div[class*="product-brandname"] {
      font-size: 14px;
    }
    div[class*="coupon-display"] {
      width: 100%;
    }
    div[class*="coupon-container"],
    div[class*="copy-coupon"] {
      grid-template-columns: 20% 50% 30%;
      gap: 2px;
    }
    div[class*="copy-coupon"] {
      padding: 5px 13px 5px 13px;
      justify-content: space-between;
    }
    button[class*="see-all-btn"] {
      font-size: 10px;
      justify-content: center;
      gap: 5px;
      padding: 7px 16px;
    }
    button[class*="see-all-btn"] svg {
      height: 16px;
      width: 18px;
    }
    div[class*="percentage-off-display"], span[class*="coupon-code"] {
        padding: 4px 15px;
        font-size: 10px;
        font-weight: 400;
    }
    div[class*="BenefitBoxes"] div[class*="BenefitItem"] {
      font-size: 11px;
      padding: 8px 12px;
    }
    .product-page-breadcrumbs {
      display: none;
    }
    div[class*="BenefitBoxes"] {
      gap: 8px;
    } 
    p[class*="get-it-in"],
    div[class*="copy-coupon"] .use-code {
      font-size: 12px;
      line-height: 15px;
    }
    p[class*="coupon-text"],
    div[class*="copy-coupon"] .coupon-code {
      font-size: 10px;
      line-height: 14px;
    }
    div[class*="product-buttons-action"],
    div[class*="product-desc-main"] {
      margin-top: 20px;
    }
    h2[class*="related-title"] {
      margin-block: 20px !important;
    }
    div[class*="related_products_section"] .related-products-show .related-products {
      width: calc(100% /1.5);
      min-width: calc(100% /1.5);
    }
    div[class*="related_products_section"] .related-products-show {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: scroll;
    }
    body div[class*="related_products_section"],
    body div[class*="related_products_section"].also-like-section {
      padding-inline: 15px 0 !important;
    }
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] {
      margin-top: 0;
    }
    div[class*="attribute-display"] {
      padding: 5px 14px !important;
      font-size: 12px !important;
    }
    div[class*="size_guide"] {
      font-size: 16px;
    }
    h4[class*="available-coupons"] {
      margin-block: 18px;
      font-size: 16px;
    }
    div[class*="product_name_related"] {
      -webkit-line-clamp: 1!important;
      font-size: 14px !important;
    }
  }
  @media screen and (min-width: 320px) and (max-width: 390px) {
     div[class*="product-image-gallery"] {
      height: 450px;
    }
  }
  @media screen and (min-width: 390px) and (max-width: 520px) {
     div[class*="product-image-gallery"] {
      height: 500px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    footer[class*="SiteFooter"] div[class*="DynamicWpFooter"] img {
      height: 30px;
    }
    div[class*="product-main-class"] {
      flex-direction: column;
    }
    div[class*="product-image-gallery"],
    div[class*="product-desc-details"] {
      width: 100%;
    }
    div[class*="product-image-gallery"] {
      max-height: 400px;
    }
    div[class*="image-gallery-thumbnails"] {
      height: inherit !important;
    }
    div[class*="product-main-class"] {
      gap: 20px;
    }
    h2[class*="product-name-title"] {
      font-size: 24px;
      line-height: 28px;
      text-transform: uppercase;
    }
    div[class*="product-brandname"], div[class*="product-variants"] {
      text-transform: uppercase;
    }
    div[class*="related_products_section"] .related-products-show .related-products {
      width: calc(100% /3);
      min-width: 33%;
    }
    div[class*="related_products_section"] .related-products-show {
      flex-wrap: nowrap;
      overflow-x: scroll;
    }
    h2[class*="related-title"] {
      margin-block: 20px !important;
    }
    button[class*="see-all-btn"] {
      font-size: 16px;
      justify-content: center;
      gap: 5px;
    }
    button[class*="see-all-btn"]::after {
      background-size: 30px;
      height: 30px;
      width: 30px;
    }
    div[class*="percentage-off-display"] {
      font-size: 16px;
    }
  }
  @media screen and (min-width: 992px) and (max-width: 1440px) {
    div[class*="coupon-container"],
    div[class*="copy-coupon"] {
      grid-template-columns: 0.5fr 1fr .5fr;
    }
  }
`;

const WishlistPage = css`
  div[class*="wishlist-container"] h2 {
    color: #14181B;
    font-size: 24px;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] {
    list-style: none;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] a {
    text-decoration: none;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] a h3 {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
    margin-block: 10px;
    color: #000;
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] p {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    margin-block: 10px;
    color: rgb(20, 24, 27);
  }
  div[class*="wishlist-container"] li[class*="wishlist-item"] strong {
    font-family: "Roboto", sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    color: #000;
  }
  div[class*="wishlist-container"] button[class*="remove-wishlist-button"] {
    background: transparent;
    color: red;
  }
  div[class*="wishlist-container"] div[class*="wishlist_action_container"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-right: 20px;
  }
  div[class*="wishlist-container"] ul[class*="wishlist-list"] {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    row-gap: 38px;
  }
  div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
   width: calc(100% / 4);
   padding-inline: 0 20px;
   margin: 0;
   height: 100%;
  }
  div[class*="variant-select"] {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  @media (max-width: 767px) {
    div[class*="wishlist-container"] ul[class*="wishlist-list"] {
      justify-content: space-between;
    }
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
      width: calc(100% / 2 - 10px);
      padding-inline: 0 0;
    }
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li img {
      max-height: 150px;
      min-height: 150px;
    }
    div[class*="variant-select"] button {
      padding: 5px 8px !important;
      border-radius: 4px !important;
      font-size: 10px !important;
    }
    // div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before {
    //   top: 70%;
    // }
    div[class*="wishlist-container"] li[class*="wishlist-item"] a h3 {
      font-size: 12px;
      line-height: 14px;
    }
    div[class*="wishlist-container"] li[class*="wishlist-item"] p {
      font-size: 14px;
      line-height: 16px;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="wishlist-container"] ul[class*="wishlist-list"] li {
      width: calc(100% / 3);
      height: 100%;
    }
    div[class*="shop_by_cat_display"] span[class*="woocommerce-Price-amount"] bdi {
      font-size: 12px !important;
    }
    // div[class*="wishlist-container"] button[class*="add-to-cart-button"]::before {
    //   top: 70%;
    // }
  }
`;

const CartDropdown = css`
  div[class*="CartDropdown"] {
    width: 550px;
    padding-inline: 20px;
  }
  span[class*="CartCount"],
  span[class*="WishlistCount"] {
    font-size: 14px;
    width: 22px;
    height: 22px;
    background: red;
    color: rgb(255, 255, 255);
  }
  div[class*="CartDropdown"] .cartItems {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-color: #14181B #fff;
    scrollbar-width: thin;
    padding-right: 20px;
  }
  div[class*="CartDropdown"] div[class*="CartItem"] {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
  }
  div[class*="CartItem"] a {
    text-decoration: none;
    font-size: 18px;
    color: rgb(20, 24, 27);
    font-family: "Roboto", sans-serif;
  }
  div[class*="product-price-display"],
  div[class*="taxes-note-display"] {
    font-size: 14px !important;
    font-family: "Roboto", sans-serif;
  }
  a[class*="StyledLink"] {
    font-family: "Roboto", sans-serif;
  }
  div[class*="taxes-note-display"] {
    margin-block: 15px;
  }
  div[class*="Subtotal"] {
    font-weight: 500;
    font-size: 14px;
  }
  div[class*="Subtotal"] {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    font-family: "Roboto", sans-serif;
    flex-direction: column;
    gap: 10px;
  }
  div[class*="CheckoutNote"] {
    font-size: 14px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="Subtotal"] br {
    display: none;
  }
  div[class*="taxes-note-display"] {
    margin-block: 15px;
  }
  div[class*="cartItemPrice"] {
    font-size: 14px;
  }
  img[class*="CartImage"] {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  button[class*="RemoveButton"] {
    text-align: end;
    font-size: 24px;
  }
  @media (max-width: 767px) {
    div[class*="CartDropdown"] {
      width: 320px;
      right: -30px;
    }
    div[class*="CartItem"] {
      align-items: center;
      display: grid;
      grid-template-columns: .7fr 1.8fr .2fr;
    }
    img[class*="CartImage"] {
      width: 70px;
      height: 70px;
      padding-right: 10px;
    }
    div[class*="cartItemPrice"] {
      font-size: 12px;
    }
  }
  @media screen and (min-width: 767px ) and (max-width: 992px) {
    div[class*="CartDropdown"] {
      width: 350px;
    }
    div[class*="CartDropdown"] div[class*="CartItem"] {
      gap: 10px;
    }
    div[class*="cartItemPrice"] {
      font-size: 12px;
    }
  }
`;

const CartPage = css`
  div[class*="CartContainer"] {
    margin-top: 0;
  }
  .cartActions {
    display: flex;
    justify-content: flex-end;
    margin-block: 30px 0;
    gap: 20px;
  }
  div[class*="CartContainer"] div[class*="CartTotals"] {
    margin-block: 20px;
    font-family: "Roboto", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="CartContainer"] div[class*="TotalAmount"] {
    font-size: 20px;
    font-weight: 600;
    margin-top: 0;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul {
    padding: 0;
    margin: 0;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul li div {
    font-size: 14px;
  }
  div[class*="CartContainer"] div[class*="CouponList"] ul li {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px dashed rgb(204, 204, 204);
    padding: 20px 10px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div[class*="CouponContainer"] input {
    border-color: #000;
  }
  div[class*="CartContainer"] div[class*="CouponContainer"] input,
  div[class*="CartContainer"] div[class*="CouponContainer"] button {
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    text-align: center;
  }
  div[class*="CartContainer"] div[class*="CartItem"] {
    align-items: center;
    position: relative;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] {
    width: 80%;
    gap: 20px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] img {
    width: 100px;
    height: 100px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display strong,
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display .cart-products-price,
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
    margin-top: 0;
  }
  div[class*="CartContainer"] div[class*="CartItem"] div[class*="TotalPrice"] {
    width: 20%;
    text-align: end;
    font-size: 16px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="CartContainer"] div {
    font-size: 14px;
  }
  div[class*="CartContainer"] strong,
  div[class*="CartContainer"] button,
  div[class*="CartContainer"] li,
  div[class*="CartContainer"] li strong div {
    font-size: 14px;
  }
  div[class*="CartContainer"] h2,
  div[class*="checkout-page"] h2,
  div[class*="CartContainer"] h4 {
    margin-top: 30px;
    font-family: "Roboto", sans-serif;
    font-size: 26px;
  }
  div[class*="CartHeader"] {
    font-family: "Roboto", sans-serif;
  }
  @media(max-width: 767px) {
    div[class*="CartItem"] {
      display: flex;
    }
    .cartActions {
      flex-direction: column;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] {
      width: 80%;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="TotalPrice"] {
      width: 20%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] input {
      width: 60%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] button {
      width: 40%;
    }
    div[class*="CartContainer"] div[class*="CouponContainer"] input,
    div[class*="CartContainer"] div[class*="CouponContainer"] button,
    div[class*="CartContainer"] div[class*="CouponList"] ul li {
      padding: 10px 15px;
      font-size: 11px;
    }
    div[class*="CartContainer"] div[class*="CouponList"] ul li div {
      font-size: 12px;
    }
    div[class*="CartContainer"] div[class*="CouponList"] h4 {
      font-size: 18px;
      margin-block: 20px;
    }
    div[class*="CartContainer"] div[class*="CartTotals"] {
      margin-block: 20px 0;
      gap: 10px;
    }
    div[class*="CartItem"] a {
      font-size: 13px;
    }
    div[class*="CheckoutNote"] {
      font-size: 11px;
    }
    div[class*="CartContainer"] div[class*="CartTotals"] div {
      font-size: 14px;
      margin-block: 8px;
    }
    div[class*="CartContainer"] h2 {
      margin-top: 0;
      font-size: 20px;
      margin-bottom: 10px;
    }
    div[class*="CartHeader"] div {
      font-size: 16px;
    }
    div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display strong, div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display .cart-products-price, div[class*="CartContainer"] div[class*="CartItem"] div[class*="ProductInfo"] .cart-products-display button {
      font-size: 14px;
    }
  }
`;

const CheckoutPage = css`
  div[class*="checkout-page"] {
    max-width: 1160px !important;
  }
  .error.fields {
    width: 50%;
  }
  div[class*="checkout-page"] .checkout-products {
    display: grid;
    width: 100%;
    grid-template-columns: 1.5fr 1.5fr 0.5fr;
  }
  div[class*="checkout-page"] .checkout_product_sale s {
    font-size: 13px;
    margin-right: 5px;
  }
  div[class*="checkout-page"] .checkout_product_price {
    font-size: 13px;
    font-family: "Roboto", sans-serif;
  }
  div[class*="checkout-page"] .checkout_product_sale span,
  div[class*="checkout-page"] .checkout_product_price_total {
    font-size: 16px;
    font-weight: 700;
  }
  div[class*="checkout-page"] .checkout_product_sale_total {
    font-size: 18px;
    font-weight: 700;
  }
  div[class*="CartContainer"] .cartActions a[class*="CheckoutButton"] {
    margin: 0;
    text-decoration: none;
  }
  div[class*="checkout-page"] .checkout-placeorder,
  div[class*="CartContainer"] a[class*="CheckoutButton"] {
    padding: 12px 50px;
    border-radius: 10px;
    font-family: Roboto, sans-serif;
    font-size: 18px;
    background: rgb(20, 24, 27);
    font-weight: bold;
    cursor: pointer;
    margin: 0px auto;
    display: flex;
    margin-block: 80px;
    color: rgb(204,204,204);
  }
  div[class*="checkout-page"] .payment-gateways p {
    font-size: 14px !important;
    padding-left: 20px;
    margin-top: 5px;
    margin-bottom: 0;
  }
  div[class*="checkout-page"] ul li img  {
    height: 300px!important;
    width: 300px!important;
  }
  div[class*="checkout-page"] ul li {
    margin: 0;
    border-top: none !important;
    align-items: center;
  }
  div[class*="checkout-page"] ul li .checkout-grandtotal{
    font-size: 20px;
    font-weight: 500;
  }
  div[class*="checkout-page"] ul {
    margin: 0;
  }
  div[class*="checkout-page"] .shipping-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  div[class*="checkout-page"] p,
  div[class*="checkout-page"] span,
  div[class*="checkout-page"] div {
    font-family: "Roboto", sans-serif;
  }
  div[class*="checkout-page"] p,
  div[class*="checkout-page"] label {
    font-size: 14px;
  }
  div[class*="checkout-page"] h3 {
    font-size: 16px;
    font-family: "Roboto", sans-serif;
    margin-block: 40px 20px;
  }
  div[class*="checkout-page"] label {
    display: flex;
    margin-top: 15px;
    font-family: "Roboto", sans-serif;
    gap: 10px;
    align-items: center;
    margin: 0;
    cursor: pointer;
  }
  div[class*="checkout-page"] .shipping-address-form input,
  div[class*="checkout-page"] .shipping-address-form select {
    margin-block: 8px;
  }
  .custom-select {
    position: relative;
  }
  .custom-select select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .custom-select::after {
    content: '▼'; 
    position: absolute;
    right: 10px; 
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.8rem;
    color: rgb(204, 204, 204);
  }
  .shippingMethods, .payment-gateways {
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    cursor: pointer;
  }
  .shippingMethods label {
    justify-content: space-between;
    flex-direction: row-reverse;
  }
  div[class*="checkout-page"] .shippingMethods label input[type="radio"]:checked {
    color: #14181b;
  }
  .payment-gateways label div {
    width: 97%;
  }
  .checkoutImage {
    display: flex;
    overflow-x: overlay;
    scrollbar-width: none;
  }
  .checkoutImage li {
    flex-direction: column;
    width: calc(33.33%);
    min-width: 33.33%;
  }
  .checkoutImage li span {
    background: silver;
    border-radius: 50%;
    font-size: 12px;
    color: #fff;
    display: flex;
    height: 35px;
    width: 35px;
    align-items: center;
    justify-content: center;
  }
  div[class*="checkout-page"] .shippingMethods label input,
  div[class*="checkout-page"] label input {
    height: 20px;
    width: 3% !important;
  }
  .custom-select-section {
    display: flex;
    gap: 20px;
  }
  .custom-select-section .custom-select {
    width: 100%;
    position: relative;
  }
  div[class*="checkout-page"] select {
    // width: 30% !important;
    margin-right: 20px;
  }
  div[class*="checkout-page"] input,
  form[class*="Form"] input,
  div[class*="checkout-page"] select {
    width: 100%;
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    background-color: transparent !important;
  }
  div[class*="checkout-page"] select {
    background: rgb(20, 24, 27) !important;
    color: rgb(204,204,204); !important;
  }
  .checkoutInputs {
    display: flex;
    gap: 20px;
  }
  .sameAddress {
    margin-top: 20px;
  }
  @media(max-width: 767px) {
    div[class*="checkout-page"] ul li img {
      height: 110px!important;
      width: 110px!important;
      margin-right: 10px!important;
      object-fit: cover !important;
    }    
    .error.fields {
      width: 100% !important;
    }
    div[class*="checkout-page"] h3 {
      font-size: 18px;
      margin-block: 20px;
    }
    div[class*="checkout-page"] h3.shipping-address {
      margin-block: 15px;
    }
    div[class*="checkout-page"] .payment-gateways p {
      font-size: 12px !important;
    }
    .sameAddress {
      margin-top: 10px;
    }
    div[class*="checkout-page"] ul li span,
    div[class*="checkout-page"] ul li p {
      font-size: 14px;
    }
    div[class*="checkout-page"] ul li .checkout-grandtotal {
      font-size: 20px;
    }
    div[class*="checkout-page"] input, form[class*="Form"] input, div[class*="checkout-page"] select {
      padding: 10px 20px;
      border-radius: 4px;
    }
    div[class*="checkout-page"] p,
    div[class*="checkout-page"] label {
      font-size: 14px;
    }
    .checkoutInputs, .custom-select-section {
      display: block;
    }
    div[class*="checkout-page"] .checkout-products {
      grid-template-columns: 1.5fr 1.5fr 0.5fr;
      gap: 8px;
    }
    div[class*="checkout-page"] .checkout-placeorder,
    div[class*="CartContainer"] a[class*="CheckoutButton"] {
      margin-block: 40px 10px;
      font-size: 14px;
      justify-content: center;
    }
    div[class*="checkout-page"] select {
      width: 100% !important;
      margin-right: 0;
    }
    div[class*="checkout-page"] {
      padding-inline: 15px !important;
    }
    .checkoutHeading {
      margin-top: 0px;
      font-size: 20px;
    }
    div[class*="checkout-page"] .shippingMethods label input, div[class*="checkout-page"] label input {
      width: 5% !important;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="checkout-page"] select {
      margin-right: 0 !important;
    }
    div[class*="checkout-page"] select[name="country"] {
      margin-right: 10px !important;
    } 
    div[class*="checkout-page"] {
      padding-inline: 25px!important;
    }
    div[class*="checkout-page"] .checkout-placeorder,
    div[class*="CartContainer"] a[class*="CheckoutButton"] {
      margin-block: 40px;
    }
    div[class*="checkout-page"] h3 {
      font-size: 24px;
    }
    div[class*="checkout-page"] p {
      font-size: 16px;
    }
    .checkoutHeading {
      font-size: 30px;
      margin-block: 10px 0;
    }
  }
`;

const LoginPage = css`
  form[class*="Form"] button {
    padding: 12px 80px;
    border-radius: 4px;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    background: rgb(20, 24, 27);
    font-weight: 500;
    cursor: pointer;
    margin: 0px auto;
    display: flex;
    margin-block: 30px;
    color: #fff;
  }
  form[class*="Form"] .register-account {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  form[class*="Form"] h3 {
    text-align: center;
  }
  form[class*="Form"] h3,
  form[class*="Form"] button,
  form[class*="Form"] input,
  form[class*="Form"] span,
  form[class*="Form"] h3{
    font-family: "Roboto", sans-serif;
  }
`;

const MyAccountPage = css`
  .thirdLogin {
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
  }
  .thirdLogin span {
    text-decoration: underline;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  div[class*="AccountDashboard"] {
    display: grid;
    grid-template-columns: 25% 75%;
  }
  .mobileInput {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }
  .mobileInput span {
    position: absolute;
    height: 100%;
    padding-inline: 12px;
    display: flex;
    background: linear-gradient(135deg, rgb(9, 12, 14), rgb(126, 142, 154));
    align-items: center;
    color: #fff;
  }
  div[class*="AccountDashboard"] div[class*="Content"] {
    padding: 30px 40px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] h4 {
    margin: 0px 0 25px 0 !important;
    font-family: "Roboto", sans-serif;
    font-size: 40px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .content_text {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 14px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails input {
    width: 100%;
    padding: 12px 30px;
    border-radius: 4px;
    border-width: 1px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    background-color: transparent!important;
    margin-bottom: 20px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails label {
    display: block;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    margin-bottom: 10px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer {
    display: grid;
    grid-template-columns: 50% 50%;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer div:first-child {
    padding-right: 15px;
  }
  div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .savebtn {
    background: #14181B;
    color: #FFFFFF;
    padding: 13px 65px;
    border-radius: 5px;
    cursor: pointer;
    margin-block: 30px;
  }
  .accountOrderContainer {
    overflow-y: auto;
  }
  @media(max-width: 767px) {
    div[class*="AccountDashboard"] {
      grid-template-columns: 100%;
    }
    .thirdLogin {
      grid-template-columns: 1fr;
      row-gap: 9px;
    }
    div[class*="AccountDashboard"] div[class*="Tabs"] {
      margin-right: 0 !important;
      padding: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Tabs"] button[class*="Tab"] {
      padding: 10px 15px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer {
      grid-template-columns: 100%;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .content_text {
      line-height: 30px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] {
      padding: 30px 15px;
      margin: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails input {
      margin-bottom: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails label {
      margin-bottom: 5px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .inputContainer div:first-child {
      padding-right: 10px;
    }
    div[class*="AccountDashboard"] div[class*="Content"] .AccountDetails .savebtn {
      margin-block: 30px 0;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    div[class*="AccountDashboard"] {
        grid-template-columns: 35% 65%;
    }
  }
`;
const ThankYouPage = css`
  .thankYouWrapper .thankYouHeading {
    font-family: "Roboto", sans-serif;
    font-size: 30px;
    margin-block: 30px;
  }
  .thankYouWrapper p {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
  }
  .thankYouWrapper .orderGrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    margin: 0;
  }
  .thankYouWrapper .orderGrid li {
    margin: 0;
    list-style: none;
    max-width: 322px;
  }
  .thankYouWrapper .orderGrid li img {
    height: auto;
    width: auto;
    aspect-ratio: 4/5;
  }
  .imageContainer {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .thankYouWrapper .orderGrid li p {
    margin: 0;
    display: -webkit-box!important;
    -webkit-line-clamp: 1!important;
    -webkit-box-orient: vertical!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
  }    
  @media (max-width: 767px) {
    .thankYouWrapper .orderGrid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .product-wishlist-button svg {
        height: 20px !important;
        width: 30px !important;
    }
    .thankYouWrapper .orderGrid li img {
      max-height: 150px;
      min-height: 150px;
    }
    .thankYouWrapper .thankYouHeading {
      font-size: 20px;
      margin-block: 20px;
    }
    .thankYouWrapper p {
      font-size: 14px;
      line-height: 26px;
    }
    .imageContainer {
      height: unset;
    }
  }
  @media screen and (min-width: 767px) and (max-width: 1024px) {
    .thankYouWrapper .orderGrid {
      grid-template-columns: repeat(3, 1fr);
    }
    .thankYouWrapper .orderGrid li img {
      max-height: 200px;
      min-height: 200px;
    }
    .imageContainer {
      height: unset;
    }
  }
`;

const MyAccountOrder = css`
  th, td {
    font-family: "Roboto", sans-serif;
  }
  .orderTable .viewBtn {
    background: rgb(20, 24, 27);
    padding: 5px 15px;
    color: #fff;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  @media (max-width: 992px) {
    .orderTable {
      margin: 0;
    }
  }
`;

const FriendsPage = css`
  .loaderContainer div[class*="Container"] {
    height: auto;
  }
  @media screen and (min-width: 767px) and (max-width: 992px) {
    .productSec {
      width: calc(100% / 3) !important;
      min-width: calc(100% / 3) !important;
    }
  }
`

const ViewAllPage = css`
/* Skeleton Loading Animation Styles */

/* Skeleton shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Base skeleton styling */
.skeleton-card {
  pointer-events: none;
  opacity: 0.7;
}

.skeleton-image {
  width: 100%;
  height: 200px; /* Adjust based on your product image height */
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-text {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-brand {
  height: 14px;
  width: 60%;
}

.skeleton-name {
  height: 16px;
  width: 90%;
}

.skeleton-price {
  height: 18px;
  width: 50%;
}

.skeleton-button {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-cart-btn {
  height: 40px;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-wishlist-btn {
  height: 36px;
  width: 100%;
}

/* Loading more text styling */
.loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

/* Fade in animation for new products */
.product-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark theme skeleton (optional) */
@media (prefers-color-scheme: dark) {
  .skeleton-image,
  .skeleton-text,
  .skeleton-button {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #3a3a3a 37%,
      #2a2a2a 63%
    );
  }
}
  .category-sort-bar {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  gap: 20px;
}

.sort-btn {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #555;
}

.sort-btn.active {
  color: #000;
  border-bottom: 2px solid #000;
}

`;

// Add this to your global styles array
const globalStyle = (colors) =>
  css([
    cssReset,
    documentSetup(colors),
    accessibilitySettings,
    elementBase(colors),
    elementBase700,
    elementBase1220,
    listStyle,
    quoteStyle(colors),
    codeStyle(colors),
    mediaStyle(colors),
    tableStyles(colors),
    headerPageStyle,
    PostArticle,
    BannerSection,
    PageWidth,
    BrandsTopsSection,
    BestSeller,
    ShopBySections,
    ShopByCategories,
    Footer,
    CategoryPage,
    ProductPage,
    WishlistPage,
    CartDropdown,
    CartPage,
    CheckoutPage,
    LoginPage,
    MyAccountPage,
    ThankYouPage,
    MyAccountOrder,
    FriendsPage,
    ViewAllPage,
  ]);

export default globalStyle;
