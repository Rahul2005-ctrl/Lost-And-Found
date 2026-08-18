import { Link } from 'react-router-dom'
import gehuLogo from '../assets/gehu-logo.jpeg'

export default function Footer() {
  return (
    <footer className="w-full mt-12 md:mt-16 bg-surface-container-highest border-t border-outline-variant/30 pb-20 md:pb-0">
      <div className="py-6 sm:py-8 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-primary flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shadow-sm border border-outline-variant/30 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={gehuLogo}
                alt="Graphic Era Hill University Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
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
