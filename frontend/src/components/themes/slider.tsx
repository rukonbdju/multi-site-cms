'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

// --- Data for the slides ---
// It's better to keep content separate from the component logic.
const slidesData = [
    {
        title: "Reliable IPS & High-Speed Internet Under One Roof",
        description: "From uninterrupted electricity to ultra-fast broadband, we empower homes and businesses across Bangladesh.",
        buttonText: "Discover Our Services",
        image: "/corporate.jpg",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-800",
        buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
        title: "Your Business Deserves 100% Uptime",
        description: "Boost productivity with dedicated corporate bandwidth, static IP, and 24/7 priority support—crafted for offices, SMEs, and enterprises.",
        buttonText: "Discover Our Services",
        image: "/office.jpg",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-800",
        buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
        title: "Dedicated Corporate Bandwidth & Support",
        description: "Experience stable, secure, and high-speed internet tailored for offices, call centers, SMEs, and enterprises",
        buttonText: "Get a Corporate Plan",
        image: "/office.jpg",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
        title: "Buffer-Free Streaming & Work From Home Ready",
        description: "Ultra-fast internet with seamless video calls, gaming, and streaming—perfect for modern households.",
        buttonText: "View Our Packages",
        image: "/corporate.jpg",
        bgColor: "bg-violet-50",
        textColor: "text-violet-800",
        buttonColor: "bg-violet-600 hover:bg-violet-700",
    },
];

// --- Animation Variants for Framer Motion ---
const sliderVariants: Variants = {
    incoming: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        scale: 1.2,
        opacity: 0
    }),
    active: {
        x: 0,
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        scale: 1,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.05, 0.01, 0.9]
        }
    })
};

const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2 + 0.5, // Staggered delay + initial delay
            duration: 0.7,
            ease: "easeOut"
        }
    })
};

// --- Arrow Icon Component ---
const Arrow = ({ direction, onClick }: { direction: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 z-20 p-2 bg-white/60 hover:bg-white rounded-full shadow-md transition-transform duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${direction === 'left' ? 'left-4' : 'right-4'} transform -translate-y-1/2`}
        aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800">
            {direction === 'left' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            )}
        </svg>
    </button>
);


// --- Main Slider Component ---
const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slideCount = slidesData.length;

    const handleNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, [slideCount]);

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
    };

    const handleDotClick = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    // Auto-play interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                handleNext();
            }
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [isPaused, handleNext]);

    const currentSlide = slidesData[currentIndex];

    return (
        <div
            className="relative w-full h-[85vh] md:h-[90vh] max-h-[900px] font-sans overflow-hidden select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    className={`absolute inset-0 w-full h-full ${currentSlide.bgColor}`}
                    custom={direction}
                    variants={sliderVariants}
                    initial="incoming"
                    animate="active"
                    exit="exit"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full max-w-7xl mx-auto px-6 lg:px-8 gap-8">

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left pt-12 lg:pt-0">
                            <motion.h2
                                custom={0}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${currentSlide.textColor} leading-tight mb-4`}
                            >
                                {currentSlide.title}
                            </motion.h2>
                            <motion.p
                                custom={1}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0"
                            >
                                {currentSlide.description}
                            </motion.p>
                            <motion.button
                                custom={2}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                className={`px-8 py-3 text-white font-bold text-lg rounded-lg shadow-lg transition-transform duration-300 ease-out hover:scale-105 ${currentSlide.buttonColor}`}
                            >
                                {currentSlide.buttonText}
                            </motion.button>
                        </div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: { delay: 0.4, duration: 0.8, ease: "easeOut" }
                            }}
                            className="w-full lg:w-1/2 flex items-center justify-center p-4"
                        >
                            <Image
                                height={800}
                                width={1000}
                                src={currentSlide.image}
                                alt={currentSlide.title}
                                className="max-w-full h-auto object-contain rounded-2xl shadow-2xl"
                                style={{ maxHeight: '500px' }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Arrow direction="left" onClick={handlePrev} />
            <Arrow direction="right" onClick={handleNext} />

            {/* Dot Indicators */}
            <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 flex flex-row items-center justify-center gap-1">
                {slidesData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`inline-block h-2 cursor-pointer rounded-full transition-all duration-300 ${index == currentIndex ? 'w-6 bg-teal-400' : 'w-4 bg-teal-600'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;

