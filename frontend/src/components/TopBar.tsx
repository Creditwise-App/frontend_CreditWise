import React from 'react';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="md:hidden bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={onOpenMobileMenu} 
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {sidebarOpen ? (
            // Close icon
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger menu icon
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        <div className="text-xl font-bold text-primary-green">CreditWise</div>
        
        <div className="w-6"></div> {/* Spacer to balance the layout */}
      </div>
    </header>
  );
};
