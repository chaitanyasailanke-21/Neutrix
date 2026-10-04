import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Problem', href: '#problem' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Simulator', href: '#simulator' },
  { label: 'Prototype', href: '#prototype' },
  { label: 'Validation', href: '#validation' },
  { label: 'Safety', href: '#safety' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Future', href: '#future' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-[#07111F]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-[1380px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo('#overview');
          }}
          className="text-lg font-bold tracking-wider text-[#F8FAFC] font-display whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#2DD4BF]"
        >
          NEUTRIX
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-5 xl:gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(link.href);
              }}
              className="text-xs xl:text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:underline underline-offset-8 decoration-[#2DD4BF] transition-colors whitespace-nowrap py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleScrollTo('#simulator')}
            className="px-4 py-2 text-xs font-semibold text-[#07111F] bg-[#2DD4BF] hover:bg-[#5EEAD4] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2DD4BF]"
          >
            Launch Simulator
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-md border border-slate-800 focus-visible:outline-2 focus-visible:outline-[#2DD4BF]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1726] border-b border-slate-800 px-4 py-4 shadow-2xl">
          <nav aria-label="Mobile Navigation" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101F31] rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
