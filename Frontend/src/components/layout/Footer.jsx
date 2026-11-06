import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { useAuth } from "../../Features/auth/Hooks/useAuth";

const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  const productLinks = user
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "New report" },
        { to: "/dashboard#reports", label: "All reports" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/#features", label: "Features" },
        { to: "/#how-it-works", label: "How it works" },
      ];

  const accountLinks = user
    ? [{ to: "/dashboard", label: "Dashboard" }]
    : [
        { to: "/login", label: "Sign in" },
        { to: "/register", label: "Create account" },
      ];

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm leading-6">
            AI-powered interview preparation. Compare your resume with any job
            description and get a focused plan to land the role.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-white">Product</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-white">Account</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {accountLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-center text-sm sm:flex-row sm:text-left">
          <p>
            © {year} ResumeAI. All rights reserved by{" "}
            <span className="font-semibold text-white">Muhammad Fahad</span>.
          </p>
          <p className="text-slate-500">Built with React, Node.js &amp; Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
