import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    // First try to scroll the custom scrollbar container
    const customScrollContainer = document.querySelector('.custom-scroll-container');
    if (customScrollContainer) {
      customScrollContainer.scrollTop = 0;
    }
    
    // Also scroll window to top as fallback
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Scroll document body to top as another fallback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;