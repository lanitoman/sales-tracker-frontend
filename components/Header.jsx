'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─────────────────────────────────────────────
// NAVIGATION CONFIG — Easy to extend
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

// ─────────────────────────────────────────────
// ICONS (inline SVGs — zero dependencies)
// ─────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <path d="M10 22L16 10L22 22H10Z" fill="white" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12l4-4-4-4" />
  </svg>
);

// ─────────────────────────────────────────────
// ACTIVE LINK COMPONENT — Isolated client logic
// ─────────────────────────────────────────────
function NavLink({ href, label, onClick }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
        ${isActive 
          ? 'text-indigo-600 bg-indigo-50' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full md:hidden" />
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────
// CTA BUTTON
// ─────────────────────────────────────────────
function CTAButton({ mobile = false, onClick }) {
  return (
    <Link
      href="/get-started"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-2.5 
        text-sm font-semibold text-white bg-indigo-600 
        hover:bg-indigo-700 active:bg-indigo-800
        rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${mobile ? 'w-full mt-4' : ''}
      `}
    >
      Get Started
      <ChevronRightIcon className="w-4 h-4" />
    </Link>
  );
}

// ─────────────────────────────────────────────
// MAIN HEADER COMPONENT
// ─────────────────────────────────────────────
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll-aware header behavior
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Add background blur when scrolled
    setIsScrolled(currentScrollY > 10);
    
    // Hide/show on scroll direction (with threshold)
    if (currentScrollY < 80) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false); // Scrolling down
    } else {
      setIsVisible(true); // Scrolling up
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change (handled by usePathname re-render)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [usePathname()]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
            >
              <div className="text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                <LogoIcon />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Brand
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <CTAButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`
                md:hidden p-2 rounded-lg transition-colors duration-200
                ${isMobileMenuOpen 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              `}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out
          ${isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Panel */}
        <div
          className={`
            absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl
            transition-transform duration-300 ease-out origin-top
            ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0'}
          `}
        >
          <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, index) => (
              <div
                key={link.href}
                className={`
                  transition-all duration-300
                  ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <NavLink 
                  href={link.href} 
                  label={link.label} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            ))}
            <CTAButton mobile onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className="h-16 lg:h-20" aria-hidden="true" />
    </>
  );
}