import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X, Globe } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/machines", label: t.nav.machines },
    { to: "/how-it-works", label: t.nav.howItWorks },
    { to: "/applications", label: t.nav.applications },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  const bgClass = scrolled || !isHome
    ? "bg-surface-dark/95 backdrop-blur-xl border-b border-steel/10 shadow-lg"
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="GlassTech" className="h-10 lg:h-12 w-auto" />
            <span className="text-lg font-bold tracking-tight text-gradient-steel hidden sm:block">
              GlassTech
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                  ${location.pathname === link.to
                    ? "text-accent"
                    : "text-steel-light hover:text-accent"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-steel-light hover:text-accent transition-colors rounded-md border border-steel/20 hover:border-accent/30"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-steel-light hover:text-accent"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface-dark/98 backdrop-blur-xl border-t border-steel/10">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${location.pathname === link.to
                    ? "text-accent bg-accent/10"
                    : "text-steel-light hover:text-accent hover:bg-accent/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
