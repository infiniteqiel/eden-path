/**
 * Slideshow Background Component
 * 
 * Animated background slideshow for signup page
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import slide1 from '@/assets/signup-slide1.jpg';
import slide2 from '@/assets/signup-slide2.jpg';
import slide3 from '@/assets/signup-slide3.jpg';

const slides = [
  {
    image: slide1,
    title: "Sustainable Innovation",
    description: "Building businesses that benefit people and planet"
  },
  {
    image: slide2,
    title: "Stakeholder Governance", 
    description: "Decisions that consider all stakeholders, not just shareholders"
  },
  {
    image: slide3,
    title: "Community Impact",
    description: "Creating positive change in communities worldwide"
  }
];

export function SlideshowBackground() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center animate-fade-in">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-center max-w-2xl animate-fade-in [animation-delay:0.3s]">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}