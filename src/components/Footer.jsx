import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full mt-12 md:mt-16 bg-surface-container-highest border-t border-outline-variant/30 pb-20 md:pb-0">
      <div className="py-6 sm:py-8 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl fill">school</span>
            <span>GEHU Lost & Found</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/lost" className="font-body text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-1">
              Lost Items
            </Link>
            <Link to="/found" className="font-body text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-1">
              Found Items
            </Link>
            <Link to="/report" className="font-body text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-1">
              Report Item
            </Link>
            <a href="https://gehu.ac.in/haldwani/" target="_blank" rel="noopener noreferrer" className="font-body text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-1">
              GEHU Website
            </a>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 pt-4 border-t border-outline-variant/20 text-center md:text-left text-on-surface-variant font-body text-xs">
          © {new Date().getFullYear()} Graphic Era Hill University, Haldwani. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
