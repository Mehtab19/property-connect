/**
 * Header Component
 * Main navigation header for PrimeX Estates
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#properties', label: 'Properties' },
    { href: '/#contact', label: 'Contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Handle anchor links
    if (href.includes('#')) {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-white/98 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-white font-extrabold text-lg">
              PX
            </div>
            <h1 className="text-xl font-extrabold text-primary">PrimeX Estates</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-foreground font-semibold hover:text-secondary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Schedule Meeting Button */}
          <div className="hidden lg:block">
            <Link
              to="/schedule"
              className="btn-outline"
            >
              <Calendar className="w-4 h-4" />
              Schedule Meeting
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-primary p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-foreground font-semibold hover:text-secondary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/schedule"
                className="btn-outline w-full justify-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
