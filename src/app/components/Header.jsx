import { useState } from "react";
import { useTranslation } from "react-i18next";

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
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
      />

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-[#0B1E48]" : "bg-gray-500"
            }`}
            onClick={() => handleIndicatorClick(index)}
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
