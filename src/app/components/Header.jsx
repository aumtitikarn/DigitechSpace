import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const Header = () => {
  const images = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
          {/* Overlay gradient - ปรับความเข้มให้น้อยลง */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 " />
        </div>
      ))}

      {/* Progress Indicators - ปรับตำแหน่งให้อยู่ด้านล่างพอดี */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-20 ">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && setCurrentIndex(index)}
            className="group focus:outline-none "
          >
            <div className={`
              h-1 rounded-full transition-all duration-300 ease-in-out
              ${currentIndex === index ? 'w-10 bg-white' : 'w-5 bg-white/50'}
              group-hover:bg-white
            `} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;