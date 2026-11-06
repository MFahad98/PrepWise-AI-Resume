import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { scrollToSection } from "./scroll";

// Har route change par: hash ho to us section par scroll, warna page ke top par
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      scrollToSection(decodeURIComponent(hash.slice(1)));
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
};

const AppLayout = () => (
  <div className="flex min-h-screen flex-col">
    <ScrollManager />
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lift"
    >
      Skip to content
    </a>
    <Header />
    <main id="main" className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AppLayout;
