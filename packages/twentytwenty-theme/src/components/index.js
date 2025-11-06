import { connect, Global, Head, styled } from "frontity";
import Switch from "@frontity/components/switch";
import Footer from "./footer";
import globalStyles from "./styles/global-styles";
import FontFaces from "./styles/font-faces";
import Header from "./header";
import Archive from "./archive";
import Loading from "./loading";
import Post from "./post";
import SearchResults from "./search/search-results";
import SkipLink from "./styles/skip-link";
import MetaTitle from "./page-meta-title";
import PageError from "./page-error";
import Product from "./product-page";
import CategoryPage from "./category-page";
import CartPage from "./cart-page";
import WishlistPage from "./wishlist-page";
import CheckoutPage from "./checkout-page";
import ThankYouPage from "./thankyou-page";
import OrderDetailsPage from "./order-details-page";
import MyAccountPage from "./my-account-page";
import LoginPage from "./login-page";
import FlashScreen from "./FlashScreen";
import RegisterPage from "./register-page";
import FriendsPage from "./friends-page";
import Homepage from "./Homepage";
import CalendarPage from "./calender-page";
import BrandsPage from "./brands-page";
import { useEffect, useState } from "react";
import SingleBrandPage from "./SingleBrandPage";
import ViewAllPage from "./ViewAllPage";
import { trackFbqEvent } from "../api/track";
import OfferFlashScreen from "./OfferFlashScreen";

/**
 * Theme is the root React component of our theme. The one we will export
 * in roots.
 */
const Theme = ({ state, actions }) => {
  // Get information about the current URL.
  const data = state.source.get(state.router.link);
  let title = "croscrow";
  const [showFlashScreen, setShowFlashScreen] = useState(false);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    if (window.fbq) {
      const originalFbq = window.fbq;
      window.fbq = function (...args) {
        if (args[0] === 'track') {
          trackFbqEvent(args[1], args[2]);
        }
        return originalFbq.apply(this, args);
      };
      Object.assign(window.fbq, originalFbq);
    }
  }, []);

useEffect(() => {
  const LoggedIn = localStorage.getItem('jwt_token');
  
  // Check for offer parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const offerCode = urlParams.get('offer');

  // If offer code exists, show offer flash screen for ALL users (logged in or not)
  if (offerCode) {
    setOfferCoupon(offerCode);
    setShowOfferScreen(true);
  } else if (!LoggedIn) {
    // Show regular flash screen only for non-logged-in users without offer code
    setShowFlashScreen(true);
  }

  fetch("https://www.croscrow.com/a/wp-json/theme/v1/header")
    .then((res) => res.json())
    .then((data) => {
      setHeaderData(data);
      localStorage.setItem('headerData', JSON.stringify(data));
    })
    .catch((e) => console.error("Header fetch error:", e));
}, []);

  const [showOfferScreen, setShowOfferScreen] = useState(false);
  const [offerCoupon, setOfferCoupon] = useState('');

  if (data.isCategory && data.isReady) {
    const category = state.source.category[data.id];
    title = category?.name || "Category";
  } else if (data.isError) {
    title = "croscrow";
  }
  const cleanLink = state.router.link.split("?")[0] || "/";
  return (
    <>
      {/* Add global styles for the whole site, like body or a's or font-faces. 
        Not classes here because we use CSS-in-JS. Only global HTML tags. */}
      {showFlashScreen && (
        <FlashScreen
          isVisible={showFlashScreen}
          onClose={() => setShowFlashScreen(false)}
        />
      )}
      {showOfferScreen && (
        <OfferFlashScreen
          isVisible={showOfferScreen}
          couponCode={offerCoupon}
          onClose={() => setShowOfferScreen(false)}
        />
      )}
      <Global styles={globalStyles(state.theme.colors)} />
      <FontFaces />

      {/* Add some metatags to the <head> of the HTML. */}
      <MetaTitle />
      <Head>
        <meta name="description" content={state.frontity.description} />

        {/* Do NOT put <html> inside Head */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Hepta+Slab:wght@1..900&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Maven+Pro:wght@400..900&family=Nosifer&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Google One Tap login */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>

        {/* Google Analytics */}
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RJKTPPCXP5"></script>
        <script>
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RJKTPPCXP5');
            `}
        </script>

        {/* Facebook Pixel */}
        <script>
          {`
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;n=f.fbq=function(){
                  n.callMethod? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
                };
                if(!f._fbq)f._fbq=n;
                n.push=n; n.loaded=!0; n.version='2.0';
                n.queue=[]; t=b.createElement(e); t.async=!0;
                t.src=v; s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '1152941102790637'); 
              fbq('track', 'PageView');
            `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=1152941102790637&ev=PageView&noscript=1"
            />`}
        </noscript>
        {/* End Facebook Pixel */}
        <title>{title}</title>
      </Head>


      {/* Accessibility: Provides ability to skip to main content */}
      <SkipLink as="a" href="#main">
        Skip to main content
      </SkipLink>

      <div style={{ minHeight: "90vh" }}>
        {/* Add the header of the site. */}
        <Header />

        {/* Add the main section. It renders a different component depending
        on the type of URL we are in. */}
        <Main id="main">
        <Switch>
            <Loading when={data.isFetching} />
            <SearchResults when={data.isSearch} />
            <Product when={data.isProduct} />
            <CartPage when={state.router.link.startsWith("/cart")} />
            <WishlistPage when={state.router.link === "/wishlist/"} />
            <CheckoutPage when={state.router.link === "/checkout/" || state.router.link === "/checkout"} />
            <ThankYouPage when={state.router.link.startsWith("/thank-you")} />
            <MyAccountPage when={state.router.link.startsWith("/my-account")} />
            <OrderDetailsPage when={state.router.link.startsWith("/view-orders")} />
            <LoginPage when={state.router.link === "/Login"} />
            <RegisterPage when={state.router.link === "/register/"} />
            <FriendsPage when={state.router.link === "/friends/"} />
            <CategoryPage when={state.router.link.includes("/product-category/")} />
            <ViewAllPage when={state.router.link.includes("/view-all/products/")} />
            {/* <Homepage when={state.router.link === "/"} /> */}
            <CalendarPage when={state.router.link === "/calendar/"} />
            <BrandsPage when={state.router.link === "/brands/"} />
            <SingleBrandPage when={state.router.link.startsWith("/brand/")} />
            <Homepage when={state.router.link.startsWith("/")} />
            <Archive when={data.isArchive} />
            <Post when={data.isPostType} />
            <PageError when={data.isError} />
          </Switch>

        </Main>
      </div>

      <Footer />
    </>
  );
};

export default connect(Theme);

const Main = styled.main`
  display: block;
`;