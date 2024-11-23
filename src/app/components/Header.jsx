import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const Header = () => {
  const images = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-slide functionality
  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  }, [isTransitioning, images.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 2000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Manual slide change
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Slides */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        </div>
      ))}

      {/* Enhanced Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20 bg-black/20 px-4 py-3 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group focus:outline-none"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`
              h-2 rounded-full transition-all duration-300 ease-in-out
              ${currentIndex === index ? 'w-12 bg-white' : 'w-6 bg-white/50'}
              group-hover:bg-white group-hover:w-12
            `} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;