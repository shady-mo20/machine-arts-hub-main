import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-dark border-t border-steel/10">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="GlassTech" className="h-10 w-auto" />
              <span className="text-lg font-bold text-gradient-steel">GlassTech</span>
            </Link>
            <p className="text-steel text-sm leading-relaxed max-w-md">
              {t.footer.brand}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-steel-light mb-4 uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/about", label: t.nav.about },
                { to: "/machines", label: t.footer.ourMachines },
                { to: "/gallery", label: t.nav.gallery },
                { to: "/how-it-works", label: t.nav.howItWorks },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-steel text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-steel-light mb-4 uppercase tracking-wider">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-2 text-steel text-sm">
              <li>{t.contact.info.phone}</li>
              <li>{t.contact.info.email}</li>
              <li>{t.contact.info.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steel/10 mt-12 pt-8 text-center text-steel text-xs">
          © {new Date().getFullYear()} GlassTech. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
