import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

// ImageSlider Component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  const { t, i18n } = useTranslation("translation");

  return (
    <div className="relative w-auto h-[300px] lg:h-[500px] overflow-hidden rounded-[15px] bg-gray-300">
      <div className="relative w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover transition-all duration-500"
          quality={75}
        />
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? "bg-[#0B1E48]" : "bg-gray-500"
            }`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

// Main Component
const App = () => {
  const images = ["/1.png", "/2.png", "/3.png", "/4.png"];

  return (
    <div className="p-4">
      <ImageSlider images={images} />
    </div>
  );
};

export default App;