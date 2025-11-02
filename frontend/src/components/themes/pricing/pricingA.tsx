'use client'

import React from 'react';
import {
    Wifi,
    CheckCircle,
    ArrowRight,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for a single pricing package.
 * 'isFeatured' is new, for styling the "Best Value" card.
 * 'features' array replaces hardcoded list items.
 */
interface Package {
    id: string | number;
    showOnHome: boolean; // Was 'feature', renamed for clarity
    isFeatured: boolean; // New: for highlighting a specific card
    accentColor: string;
    price: string | number; // Was 'priceIncVAT'
    tag: string;
    packageName: string;
    bandwidth: string | number;
    features: string[]; // New: for a data-driven feature list
}

/**
 * Props for the reusable PricingCard component.
 */
interface PricingCardProps {
    item: Package;
    onChoosePackage: (item: Package) => void;
}

/**
 * Props for the PricingPackage container component.
 */
interface PricingPackageProps {
    packages: Package[];
    onChoosePackage: (item: Package) => void;
}

// --- 1. REUSABLE PRICING CARD COMPONENT ---

const PricingCard: React.FC<PricingCardProps> = ({ item, onChoosePackage }) => {
    // We can use the accentColor directly in style props.
    // We'll set the border-top-color directly for the featured card.
    const cardStyle = {
        ...(item.isFeatured && { borderTop: `4px solid ${item.accentColor}` })
    } as React.CSSProperties;

    return (
        <div
            style={cardStyle}
            className={`
                relative flex flex-col rounded-2xl shadow-lg bg-white transition-all duration-300 ease-in-out
                ${item.isFeatured ? '' : 'border border-gray-200'}
            `}
        >
            {/* "Most Popular" Badge - only shown if isFeatured is true */}
            {item.isFeatured && (
                <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: item.accentColor }}
                >
                    Most Popular
                </div>
            )}

            <div className="p-8 flex flex-col justify-between h-full">
                {/* Top Section: Header & Price */}
                <div>
                    {/* Icon and Tag */}
                    <div className="flex items-center mb-4">
                        <Wifi size={32} className="mr-3" style={{ color: item.accentColor }} />
                        <p className="text-sm font-medium text-gray-500">{item.tag}</p>
                    </div>

                    {/* Package Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {item.packageName}
                    </h3>

                    {/* Price - More prominent and modern layout */}
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-extrabold text-gray-900">
                            {/* Using Taka text symbol */}
                            <sub className="font-normal text-4xl mr-0.5 align-baseline">৳</sub>
                            {item.price}
                        </span>
                        <span className="text-lg text-gray-500 ml-1">/month</span>
                    </div>
                </div>

                {/* Middle Section: Features List (Now data-driven) */}
                {/* flex-grow ensures this section expands, pushing the button to the bottom */}
                <ul className="space-y-3 text-gray-700 text-base mb-8 flex-grow">
                    {/* Special item for Bandwidth */}
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span><span className="font-semibold">{item.bandwidth} Mbps</span> Bandwidth</span>
                    </li>

                    {/* Dynamically rendered features from the 'features' array */}
                    {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        24x7 Customer Care
                    </li>
                </ul>

                {/* Bottom Section: Button */}
                {/* mt-auto ensures the button is always at the bottom of the card */}
                <div className="mt-auto">
                    <button
                        onClick={() => onChoosePackage(item)}
                        className={`
                            w-full py-3 px-6 rounded-lg text-base font-semibold flex items-center justify-center gap-2
                            transition-all duration-300 ease-in-out
                            ${item.isFeatured
                                ? 'text-white shadow-md hover:brightness-95'
                                : 'border border-gray-300 text-gray-800 hover:bg-gray-50'
                            }
                        `}
                        // Apply background-color directly for the featured button
                        style={item.isFeatured ? { backgroundColor: item.accentColor } : {}}
                    >
                        Choose Package <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. PRICING PACKAGE CONTAINER COMPONENT ---

const PricingPackage: React.FC<PricingPackageProps> = ({ packages, onChoosePackage }) => {
    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
                    Our <span className="text-red-600">Popular</span> Packages
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Choose the perfect plan that fits your needs and enjoy high-speed internet with great benefits.
                </p>

                {/* We filter by 'showOnHome' to control which packages appear on this page.
                    The 'isFeatured' prop will handle the styling for the highlighted card.
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-stretch items-stretch">
                    {packages
                        .filter(item => item.showOnHome) // Only show packages marked for the homepage
                        .map((item) => (
                            <PricingCard
                                key={item.id}
                                item={item}
                                onChoosePackage={onChoosePackage}
                            />
                        ))}
                </div>

                <div className="mt-16 text-center">
                    <a href='/home-internet' className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300">
                        See All Packages <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- 3. EXAMPLE APP (MAIN COMPONENT) ---

// Mock data updated with 'isFeatured' and 'features' array
const mockPackages: Package[] = [
    {
        id: 1,
        showOnHome: true,
        isFeatured: false, // Not featured
        accentColor: "#FF5733", // Orange-red
        price: "500",
        tag: "Home User",
        packageName: "Starter Plan",
        bandwidth: 100,
        features: [
            "1,000 Taka OTC",
            "50 Min TalkTime",
            "Basic Streaming Access"
        ]
    },
    {
        id: 2,
        showOnHome: true,
        isFeatured: true, // This one IS featured
        accentColor: "#e7000b", // Red
        price: "1000",
        tag: "Power User",
        packageName: "Pro Connect",
        bandwidth: 250,
        features: [
            "500 Taka OTC",
            "100 Min TalkTime",
            "Premium Gaming & Streaming",
            "Priority Support"
        ]
    },
    {
        id: 3,
        showOnHome: true,
        isFeatured: false, // Not featured
        accentColor: "#33CC57", // Green
        price: "2000",
        tag: "Family Plan",
        packageName: "Ultimate Fiber",
        bandwidth: 500,
        features: [
            "No OTC",
            "200 Min TalkTime",
            "All Access Entertainment Pack"
        ]
    },
    {
        id: 4,
        showOnHome: false, // This one won't be shown on this page
        isFeatured: false,
        accentColor: "#FF33A1",
        price: "300",
        tag: "Lite",
        packageName: "Basic",
        bandwidth: 50,
        features: ["1,500 Taka OTC"]
    },
];

// Mock context/function
// Removed alert() as it's generally not used in "pro" apps.
const handleChoosePackage = (item: Package) => {
    console.log("Choosing package:", item.packageName);
    // In your app, you would call `toggleModal(item)` here.
};

/**
 * Main App component to demonstrate the reusable PricingPackage.
 */
const PricingA: React.FC = () => {
    return (
        <div className="font-inter antialiased">
            <PricingPackage
                packages={mockPackages}
                onChoosePackage={handleChoosePackage}
            />
        </div>
    );
};

export default PricingA;

