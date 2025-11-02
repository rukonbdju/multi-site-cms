'use client'

import React from 'react';
import {
    Wifi,
    CheckCircle, // Changed ChevronsRight to CheckCircle for a more modern "feature list" look
    ArrowRight,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for a single pricing package.
 */
interface Package {
    id: string | number;
    feature: boolean;
    accentColor: string; // Renamed from colorText to accentColor for clarity
    priceIncVAT: string | number;
    tag: string;
    packageName: string;
    bandwidth: string | number;
    otc: string | number;
    minPlusPhone: string | number;
    vas: string;
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
    return (
        <div className="relative flex flex-col justify-between p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white group w-full">
            {/* Price Badge - Reverted to SVG Ribbon */}
            <div className="absolute -right-[20px] -top-4 ">
                <div className="relative h-full w-full">
                    {/* svg */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="120"
                        height="120"
                        x="0"
                        y="0"
                        viewBox="0 0 512 512"

                        xmlSpace="preserve"
                    >
                        <g>
                            <path
                                d="M384 0H149.333c-41.237 0-74.667 33.429-74.667 74.667v426.667a10.668 10.668 0 0 0 6.592 9.856c1.291.538 2.676.813 4.075.811a10.663 10.663 0 0 0 7.552-3.115l120.448-120.619C260.48 434.795 325.44 499.2 332.416 507.136c3.261 4.906 9.882 6.24 14.788 2.979a10.67 10.67 0 0 0 3.964-4.835 6.53 6.53 0 0 0 .832-3.947v-448c0-17.673 14.327-32 32-32 5.891 0 10.667-4.776 10.667-10.667S389.891 0 384 0z"
                                style={{ fill: item.accentColor }}
                            />
                            <path
                                d="M394.667 0c23.564 0 42.667 19.103 42.667 42.667v32c0 5.891-4.776 10.667-10.667 10.667H352V42.667C352 19.103 371.103 0 394.667 0z"
                                style={{ fill: item.accentColor }}
                            />
                        </g>
                    </svg>
                    {/* Price */}
                    <div className="absolute left-7 top-5 flex flex-col text-xl font-semibold text-white">
                        <span>
                            {/* Using Taka text symbol */}
                            <sub className="font-normal text-white text-lg mr-0.5">৳</sub>
                            <span className="text-white">{item.priceIncVAT}</span>
                        </span>
                        <span className="text-xs font-normal text-white">/month</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                {/* Icon and Tag */}
                <div className="flex items-center mb-4">
                    <Wifi size={32} style={{ color: item.accentColor }} className="mr-3" />
                    <p className="text-sm font-medium text-gray-500">{item.tag}</p>
                </div>

                {/* Package Name */}
                <h3 className="text-3xl font-extrabold mb-6" style={{ color: item.accentColor }}>
                    {item.packageName}
                </h3>

                {/* Features List */}
                <ul className="space-y-3 text-gray-700 text-base">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">{item.bandwidth} Mbps</span> Bandwidth
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Unlimited devices
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        OTC: {item?.otc} Taka
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {item?.minPlusPhone} Min TalkTime
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {item?.vas}
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        24x7 Customer Care
                    </li>
                </ul>
            </div>

            {/* Choose Package Button */}
            <div className="mt-8">
                <button
                    onClick={() => onChoosePackage(item)}
                    className="w-full py-3 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2
                     border transition-colors duration-300"
                    style={{
                        borderColor: item.accentColor,
                        color: item.accentColor,
                        backgroundColor: 'white',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.accentColor;
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = item.accentColor;
                    }}
                >
                    Choose Package <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// --- 2. PRICING PACKAGE CONTAINER COMPONENT ---

const PricingPackage: React.FC<PricingPackageProps> = ({ packages, onChoosePackage }) => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
                    Our <span className="text-blue-600">Popular</span> Packages
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Choose the perfect plan that fits your needs and enjoy high-speed internet with great benefits.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {packages
                        .filter(item => item.feature) // Only show featured packages
                        .map((item) => (
                            <PricingCard
                                key={item.id}
                                item={item}
                                onChoosePackage={onChoosePackage}
                            />
                        ))}
                </div>

                <div className="mt-16 text-center">
                    <a href='/home-internet' className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
                        See All Packages <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- 3. EXAMPLE APP (MAIN COMPONENT) ---

// Mock data (as in the original)
const mockPackages: Package[] = [
    {
        id: 1,
        feature: true,
        accentColor: "#FF5733", // Orange-red
        priceIncVAT: "500",
        tag: "Home User",
        packageName: "Starter Plan",
        bandwidth: 100, // Increased for modern context
        otc: 1000,
        minPlusPhone: 50,
        vas: "Basic Streaming Access"
    },
    {
        id: 2,
        feature: true,
        accentColor: "#33CC57", // Green
        priceIncVAT: "1000",
        tag: "Power User",
        packageName: "Pro Connect",
        bandwidth: 250, // Increased
        otc: 500,
        minPlusPhone: 100,
        vas: "Premium Gaming & Streaming"
    },
    {
        id: 3,
        feature: true,
        accentColor: "#3366FF", // Blue
        priceIncVAT: "2000",
        tag: "Family Plan",
        packageName: "Ultimate Fiber",
        bandwidth: 500, // Increased
        otc: 0,
        minPlusPhone: 200,
        vas: "All Access Entertainment Pack"
    },
    {
        id: 4,
        feature: false, // This one won't be shown
        accentColor: "#FF33A1",
        priceIncVAT: "300",
        tag: "Lite",
        packageName: "Basic",
        bandwidth: 50,
        otc: 1500,
        minPlusPhone: 0,
        vas: "No VAS"
    },
];

// Mock context/function (as in the original)
// This simulates the `toggleModal` from your StoreContext
const handleChoosePackage = (item: Package) => {
    console.log("Choosing package:", item.packageName);
    // In your app, you would call `toggleModal()` here.
    // We use console.log here for demonstration.
    alert(`You chose the "${item.packageName}" package!`);
};

/**
 * Main App component to demonstrate the reusable PricingPackage.
 */
const PricingA: React.FC = () => {
    return (
        <div className="">
            {/* You can add other parts of your page here (e.g., Navbar, Hero) */}

            <PricingPackage
                packages={mockPackages}
                onChoosePackage={handleChoosePackage}
            />

            {/* You can add other parts of your page here (e.g., Footer) */}
        </div>
    );
};

export default PricingA;

