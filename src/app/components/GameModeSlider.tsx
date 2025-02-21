// /src/app/components/GameModeSlider.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Types for the component props
export interface GameMode {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  redirectUrl: string;
  emoji: string;
  prompts: string[];
  isUnderConstruction?: boolean; 
}

interface GameModeSliderProps {
  gameModes: GameMode[];
  onModeSelect?: (modeId: string, index: number) => void;
  initialMode?: string | null;
}

export default function GameModeSlider({
  gameModes,
  onModeSelect,
  initialMode = null
}: GameModeSliderProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<string | null>(initialMode);
  const [isMobile, setIsMobile] = useState(false);

  // Initialisation au montage
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (initialMode) {
      const activeIndex = gameModes.findIndex(mode => mode.id === initialMode);
      if (activeIndex !== -1) {
        setActiveSlide(activeIndex);
        setTimeout(() => {
          if (carouselRef.current) {
            const slideWidth = carouselRef.current.clientWidth;
            carouselRef.current.scrollLeft = activeIndex * slideWidth;
          }
        }, 100);
      }
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [gameModes, initialMode]);

  // Mise à jour de l'active slide en fonction du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const slideWidth = carouselRef.current.clientWidth;
        const newActiveSlide = Math.round(scrollPosition / slideWidth);
        if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < gameModes.length) {
          setActiveSlide(newActiveSlide);
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeSlide, gameModes.length]);

  const navigateSlider = (direction: number) => {
    let newSlide = activeSlide + direction;
    if (newSlide < 0) newSlide = gameModes.length - 1;
    if (newSlide >= gameModes.length) newSlide = 0;
    setActiveSlide(newSlide);

    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: newSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleModeSelect = (modeId: string, index: number) => {
    setActiveMode(modeId);
    setActiveSlide(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
    if (onModeSelect) {
      onModeSelect(modeId, index);
    }
    window.location.href = gameModes[index].redirectUrl;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      {/* SLIDER TITLE */}
      <div className="text-center mb-6">
        <h2 className="inline-block text-3xl font-black bg-black text-white px-6 py-3 transform -rotate-2 border-4 border-black">
          CHOISIS TON MODE DE JEU
        </h2>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="relative">
        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between items-center pointer-events-none px-2 md:px-6 transform -translate-y-1/2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 md:w-16 md:h-16 bg-black text-white font-black text-2xl rounded-full flex items-center justify-center pointer-events-auto border-4 border-white transform -rotate-3"
            onClick={() => navigateSlider(-1)}
          >
            ←
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 md:w-16 md:h-16 bg-black text-white font-black text-2xl rounded-full flex items-center justify-center pointer-events-auto border-4 border-white transform rotate-3"
            onClick={() => navigateSlider(1)}
          >
            →
          </motion.button>
        </div>

        {/* CAROUSEL PRINCIPAL */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "12px",
            border: "8px solid black",
            boxShadow: "16px 16px 0 rgba(0,0,0,1)",
            background: "#000"
          }}
        >
          {/* CARD CONTAINER */}
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory scrollbar-hide"
            style={{
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {gameModes.map((mode, index) => {
              const isDisabled = mode.isUnderConstruction;
              return (
                <div
                  key={mode.id}
                  className="w-full flex-shrink-0 p-4 snap-center"
                  style={{
                    scrollSnapAlign: 'center',
                    minWidth: '100%'
                  }}
                >
                  <motion.div
                    initial={{ rotate: Math.random() > 0.5 ? 3 : -3 }}
                    whileHover={!isDisabled ? {
                      scale: 1.02,
                      rotate: 0,
                      boxShadow: "0 10px 50px rgba(0,0,0,0.5)"
                    } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    className={`w-full h-full ${mode.bgColor} mx-auto flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{
                      borderRadius: "8px",
                      border: activeMode === mode.id ? "8px solid white" : "8px solid black",
                      boxShadow: activeMode === mode.id ?
                        "0 0 0 4px black, 10px 10px 0 rgba(0,0,0,0.8)" :
                        "8px 8px 0 rgba(0,0,0,0.75)",
                      aspectRatio: "3/4",
                      maxWidth: isMobile ? "85%" : "380px",
                      margin: "0 auto",
                      padding: "24px",
                      transform: activeMode === mode.id ? "translateY(-10px)" : "none"
                    }}
                    onClick={!isDisabled ? () => handleModeSelect(mode.id, index) : undefined}
                  >
                    {/* Card Corner Emblem */}
                    <div className="absolute top-3 left-3 text-4xl">
                      {mode.emoji}
                    </div>
                    <div className="absolute top-3 right-3 text-4xl transform rotate-180">
                      {mode.emoji}
                    </div>

                    {/* Mode Border */}
                    <div className="absolute inset-8 border-2 border-dashed border-black opacity-50 pointer-events-none"></div>

                    {/* Card Content */}
                    <div className="mt-16 text-center mb-6">
                      <h2 className="text-3xl font-black mb-2 bg-black text-white inline-block px-3 py-1 transform -rotate-2">
                        {mode.title}
                      </h2>
                      <p className="font-bold text-lg px-4 py-2 bg-white bg-opacity-70 border-2 border-black">
                        {mode.description}
                      </p>
                    </div>

                    <div className="bg-black text-white p-4 border-2 border-white mb-6">
                      <p className="font-bold text-sm mb-1">DÉFI DU JOUR:</p>
                      <p className="italic">{mode.prompts[0]}</p>
                    </div>

                    {/* Card Bottom */}
                    <div className="absolute bottom-3 left-3 text-4xl transform rotate-180">
                      {mode.emoji}
                    </div>
                    <div className="absolute bottom-3 right-3 text-4xl">
                      {mode.emoji}
                    </div>

                    {/* Bouton d'action */}
                    {!isDisabled ? (
                      <Link href={mode.redirectUrl}>
                        <motion.button
                          whileHover={{ scale: 1.05, rotate: 0 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-black text-white font-black py-4 px-6 border-4 border-white hover:bg-white hover:text-black transition-all w-full"
                          style={{
                            transform: "rotate(-2deg)"
                          }}
                        >
                          ÉCRIRE MAINTENANT →
                        </motion.button>
                      </Link>
                    ) : (
                      <motion.button
                        disabled
                        className="bg-gray-500 text-white font-black py-4 px-6 border-4 border-gray-500 w-full opacity-50 cursor-not-allowed"
                      >
                        EN CONSTRUCTION
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation indicators */}
        <div className="flex justify-center mt-8">
          <div className="bg-black inline-flex p-2 rounded-full transform rotate-1">
            {gameModes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-5 h-5 mx-1 rounded-full border-2 border-black transition-all transform hover:scale-110 ${
                  activeSlide === index
                    ? 'bg-yellow-300 scale-125'
                    : 'bg-white hover:bg-gray-200'
                }`}
                style={{
                  boxShadow: activeSlide === index ? '3px 3px 0 rgba(0,0,0,0.5)' : 'none'
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
