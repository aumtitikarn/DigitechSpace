import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

const Header = () => {
  const images = ["/1.gif", "/2.gif", "/3.gif", "/4.gif"];
  const { t, i18n } = useTranslation("translation");
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const handleSellClick = () => {
    router.push('/Sell');
  };

  const handleStepsClick = () => {
    goToSlide(3); // Go to the 4th slide (index 3)
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </div>
      ))}

      {/* Modern Arrow Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Call to Action Section */}
      {session?.user?.role === 'StudentUser' && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 w-full max-w-md">
          <button
            onClick={handleSellClick}
            className="w-64 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {t("nav.home.fsell")}
          </button>
          
          <button
            onClick={handleStepsClick}
            className="text-white hover:text-blue-200 text-sm font-medium underline underline-offset-4 transition-colors duration-200"
          >
            {t("nav.home.step")}
          </button>
        </div>
      )}

      {/* Current Slide Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/20 px-4 py-2 rounded-full text-white font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Header;