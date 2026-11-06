import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Features/auth/Hooks/useAuth";
import { InterviewContext } from "../../Features/ai/interview.context";
import Logo from "../ui/Logo";
import { CloseIcon, LayersIcon, LogoutIcon, MenuIcon, PlusIcon } from "../ui/Icons";
import { REPORTS_SECTION_ID, scrollToSection } from "./scroll";

const Header = () => {
  const { user, handleLogout } = useAuth();
  const interview = useContext(InterviewContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Route badalne par mobile menu band karo
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const onDashboard = location.pathname === "/dashboard";
  const reportsActive = onDashboard && location.hash === `#${REPORTS_SECTION_ID}`;
  const newReportActive = onDashboard && !reportsActive;

  const goToReports = (event) => {
    // Agar pehle se dashboard par hain to seedha scroll karo
    if (onDashboard) {
      event.preventDefault();
      navigate(`/dashboard#${REPORTS_SECTION_ID}`, { replace: true });
      scrollToSection(REPORTS_SECTION_ID);
      setMenuOpen(false);
    }
  };

  const onLogout = async () => {
    setLoggingOut(true);
    navigate("/", { replace: true });
    await handleLogout();
    interview?.setReports(null);
    interview?.setReport(null);
    setLoggingOut(false);
  };

  const linkBase =
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100";
  const linkClass = (active) =>
    `${linkBase} ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

  const navItems = user ? (
    <>
      <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
        Home
      </NavLink>
      <Link to="/dashboard" className={linkClass(newReportActive)} aria-current={newReportActive ? "page" : undefined}>
        New Report
      </Link>
      <Link
        to={`/dashboard#${REPORTS_SECTION_ID}`}
        onClick={goToReports}
        className={linkClass(reportsActive)}
        aria-current={reportsActive ? "page" : undefined}
      >
        All Reports
      </Link>
    </>
  ) : (
    <>
      <NavLink to="/" end className={({ isActive }) => linkClass(isActive && !location.hash)}>
        Home
      </NavLink>
      <Link to="/#features" className={linkClass(location.hash === "#features")}>
        Features
      </Link>
      <Link to="/#how-it-works" className={linkClass(location.hash === "#how-it-works")}>
        How it works
      </Link>
    </>
  );

  const initial = (user?.username || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {navItems}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-primary px-3.5 py-2">
                <PlusIcon className="h-4 w-4" />
                Generate
              </Link>
              <div className="h-6 w-px bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2.5" title={user.email}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {initial}
                </span>
                <span className="max-w-[9rem] truncate text-sm font-medium text-slate-700">
                  {user.username || user.email}
                </span>
              </div>
              <button type="button" onClick={onLogout} disabled={loggingOut} className="btn-secondary px-3 py-2">
                <LogoutIcon className="h-4 w-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-3.5 py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary px-3.5 py-2">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost -mr-2 p-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-3">
            {navItems}
          </nav>
          <div className="container-page border-t border-slate-100 py-4">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {initial}
                  </span>
                  <span className="truncate text-sm font-medium text-slate-700">{user.username || user.email}</span>
                </div>
                <button type="button" onClick={onLogout} disabled={loggingOut} className="btn-secondary shrink-0 px-3 py-2">
                  <LogoutIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="btn-secondary">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary">
                  Get started
                </Link>
              </div>
            )}
            {user && (
              <Link to="/dashboard" className="btn-primary mt-3 w-full">
                <LayersIcon className="h-4 w-4" />
                Generate new report
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
