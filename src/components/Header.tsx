/**
 * Header Component
 * Main navigation header with role-based navigation
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Calendar, User, LogOut, Scale, Building2, 
  Heart, Briefcase, TrendingUp, Landmark 
} from 'lucide-react';
import { useAuth, getDashboardRoute, AppRole } from '@/hooks/useAuth';

// Role-specific quick actions shown in header
const getRoleQuickLinks = (role: AppRole | null) => {
  const commonLinks = [
    { href: '/compare', label: 'Compare', icon: Scale },
  ];

  switch (role) {
    case 'buyer':
      return [
        ...commonLinks,
        { href: '/mortgage', label: 'Mortgage', icon: Landmark },
        { href: '/buyer/dashboard/saved', label: 'Favorites', icon: Heart },
      ];
    case 'investor':
      return [
        ...commonLinks,
        { href: '/mortgage', label: 'Financing', icon: Landmark },
        { href: '/investor/dashboard/portfolio', label: 'Portfolio', icon: TrendingUp },
      ];
    case 'developer':
      return [
        { href: '/developer/dashboard/listings', label: 'My Listings', icon: Building2 },
        { href: '/developer/dashboard/leads', label: 'Leads', icon: Briefcase },
      ];
    case 'broker':
      return [
        { href: '/broker/dashboard/listings', label: 'Listings', icon: Building2 },
        { href: '/broker/dashboard/leads', label: 'Leads', icon: Briefcase },
      ];
    case 'mortgage_partner':
      return [
        { href: '/mortgage-partner/dashboard/leads', label: 'Leads', icon: Briefcase },
        { href: '/mortgage-partner/dashboard/products', label: 'Products', icon: Landmark },
      ];
    case 'admin':
      return [
        { href: '/admin/dashboard/approvals', label: 'Approvals', icon: Building2 },
        { href: '/admin/dashboard/users', label: 'Users', icon: User },
      ];
    default:
      return commonLinks;
  }
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, role, signOut } = useAuth();

  // Base nav links shown to everyone
  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/#properties', label: 'Properties' },
    { href: '/compare', label: 'Compare' },
    { href: '/mortgage', label: 'Mortgage' },
  ];

  // Additional links for unauthenticated users
  const publicNavLinks = [
    ...baseNavLinks,
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  // Get role-specific quick links
  const roleQuickLinks = getRoleQuickLinks(role);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.includes('#')) {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = isAuthenticated ? baseNavLinks : publicNavLinks;

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
          <nav className="hidden lg:flex items-center gap-6">
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

            {/* Role-specific quick links */}
            {isAuthenticated && roleQuickLinks.length > 0 && (
              <>
                <span className="w-px h-5 bg-border" />
                {roleQuickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-1.5 text-muted-foreground font-medium hover:text-primary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Auth & Schedule Meeting Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardRoute(role)}
                  className="flex items-center gap-2 text-foreground font-semibold hover:text-secondary transition-colors"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-outline py-2 px-5">
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
            <Link to="/schedule" className="btn-primary py-2 px-5">
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
            <div className="flex flex-col gap-3">
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

              {/* Role-specific quick links on mobile */}
              {isAuthenticated && roleQuickLinks.length > 0 && (
                <>
                  <div className="border-t border-border my-2" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Quick Access</p>
                  {roleQuickLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-muted-foreground font-medium hover:text-primary py-2"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              <div className="border-t border-border my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardRoute(role)}
                    className="flex items-center gap-2 text-foreground font-semibold py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-destructive font-semibold py-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn-outline w-full justify-center mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
              <Link
                to="/schedule"
                className="btn-primary w-full justify-center mt-2"
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
