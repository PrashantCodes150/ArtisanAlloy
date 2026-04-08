import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.svg',
  fallback = '/fallback.svg'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setHasError(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallback);
      setHasError(true);
    };
    
    img.src = src;
  }, [src]);

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      loading="lazy"
    />
  );
};

export default LazyImage;