'use client'

import React from 'react';
import { ArrowRight, Wifi, Cloud, Server, Shield, Briefcase } from 'lucide-react'; // More specific Lucide icons

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for a single service item.
 */
interface Service {
    id: string | number;
    // `photo` can be a URL or a Lucide icon component name (string)
    // For simplicity, let's assume `photo` is a URL string.
    // If you want to use Lucide component names, you'd need a mapping function.
    photo: string; // URL for the image
    serviceName: string;
    description: string;
    path: string; // URL path for the "View Details" link
}

/**
 * Props for the reusable ServiceCard component.
 */
interface ServiceCardProps {
    item: Service;
    // Optional prop to render a specific Lucide icon instead of an image
    iconComponent?: React.ElementType;
}

/**
 * Props for the ServicesCom container component.
 */
interface ServicesComProps {
    services: Service[];
}

// --- 1. REUSABLE SERVICE CARD COMPONENT ---

const ServiceCard: React.FC<ServiceCardProps> = ({ item, iconComponent: Icon }) => {
    return (
        <div className="flex flex-col bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group
                    transition-all duration-500 ease-in-out transform
                    hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300
                    relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-blue-50 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500">

            {/* Icon/Image with Gradient Background */}
            <div className="flex justify-center mb-6 relative z-10">
                <div className="p-4 rounded-full bg-blue-500 bg-opacity-10 backdrop-blur-sm
                        border border-blue-200 transition-all duration-300
                        group-hover:bg-blue-600 group-hover:bg-opacity-20 group-hover:border-blue-400">
                    {Icon ? (
                        <Icon size={48} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    ) : (
                        <img
                            src={item.photo}
                            alt={item.serviceName}
                            className="h-12 w-12 rounded-full object-cover shadow-md"
                        />
                    )}
                </div>
            </div>

            {/* Service Name */}
            <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-3 relative z-10">{item.serviceName}</h3>

            {/* Description */}
            <p className="text-gray-600 text-center text-base mb-6 flex-grow relative z-10 leading-relaxed">
                {item.description.slice(0, 150) + (item.description.length > 150 ? '...' : '')}
            </p>

            {/* View Details Button */}
            <div className="flex justify-center mt-auto relative z-10">
                <a
                    href={item.path}
                    className="inline-flex items-center justify-center gap-2 text-sm text-blue-600 cursor-pointer
                     bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold
                     transition-all duration-300 ease-in-out transform
                     border border-blue-200 hover:border-blue-400
                     group-hover:text-blue-700 group-hover:scale-105"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
            </div>
        </div>
    );
};

// --- 2. SERVICES CONTAINER COMPONENT ---

const ServicesCom: React.FC<ServicesComProps> = ({ services }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-6 leading-tight">
                    Red Data comes with a <span className="text-blue-700">wide</span> array of services
                </h2>
                <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
                    Explore our comprehensive range of services designed to empower your digital life and business with cutting-edge technology.
                </p>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {services.map((item) => {
                        let iconComponent: React.ElementType | undefined;
                        // Map service names to Lucide icons (extend as needed)
                        switch (item.serviceName.toLowerCase()) {
                            case 'broadband':
                                iconComponent = Wifi;
                                break;
                            case 'data center':
                                iconComponent = Server;
                                break;
                            case 'vpn service':
                                iconComponent = Shield;
                                break;
                            case 'cloud storage':
                                iconComponent = Cloud;
                                break;
                            default:
                                iconComponent = Briefcase; // Default fallback
                        }
                        return <ServiceCard key={item.id} item={item} iconComponent={iconComponent} />;
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 3. EXAMPLE APP (MAIN COMPONENT) ---

// Mock data for services
const mockServices: Service[] = [
    {
        id: 1,
        photo: "https://via.placeholder.com/96x96/FF5733/FFFFFF?text=BB", // Placeholder image, but we'll use iconComponent
        serviceName: "Broadband",
        description: "Experience blazing-fast internet speeds for your home and office. Seamless streaming, gaming, and browsing with reliable connectivity.",
        path: "/services/broadband"
    },
    {
        id: 2,
        photo: "https://via.placeholder.com/96x96/33CC57/FFFFFF?text=DC",
        serviceName: "Data Center",
        description: "Host your critical infrastructure with our secure, reliable, and scalable data center solutions. High uptime and robust security.",
        path: "/services/data-center"
    },
    {
        id: 3,
        photo: "https://via.placeholder.com/96x96/3366FF/FFFFFF?text=VPN",
        serviceName: "VPN Service",
        description: "Protect your online privacy and secure your connection with our high-speed virtual private network, ensuring anonymous browsing.",
        path: "/services/vpn"
    },
    {
        id: 4,
        photo: "https://via.placeholder.com/96x96/FF33A1/FFFFFF?text=CS",
        serviceName: "Cloud Storage",
        description: "Access your files from anywhere with our secure and affordable cloud storage solutions. Collaborate and share with ease, never lose a file again.",
        path: "/services/cloud-storage"
    },
    {
        id: 5,
        photo: "https://via.placeholder.com/96x96/6A0572/FFFFFF?text=IoT",
        serviceName: "IoT Solutions",
        description: "Transform your business with smart IoT solutions, connecting devices and gathering data for improved efficiency and insights.",
        path: "/services/iot"
    },
    {
        id: 6,
        photo: "https://via.placeholder.com/96x96/8A2BE2/FFFFFF?text=VOIP",
        serviceName: "VoIP Services",
        description: "Modernize your communication with reliable and cost-effective VoIP services. Crystal-clear calls and advanced features.",
        path: "/services/voip"
    },
    {
        id: 7,
        photo: "https://via.placeholder.com/96x96/4CAF50/FFFFFF?text=Sec",
        serviceName: "Cyber Security",
        description: "Comprehensive cyber security measures to protect your data and systems from evolving threats, ensuring peace of mind.",
        path: "/services/cyber-security"
    },
    {
        id: 8,
        photo: "https://via.placeholder.com/96x96/FFC107/FFFFFF?text=Mng",
        serviceName: "Managed IT",
        description: "Let us handle your IT infrastructure with our managed IT services, allowing you to focus on your core business.",
        path: "/services/managed-it"
    },
];

/**
 * Main App component to demonstrate the reusable ServicesCom.
 */
const FeatureA: React.FC = () => {
    return (
        <div className=" bg-gray-100">
            {/* You can add other parts of your page here (e.g., Navbar, Hero) */}

            <ServicesCom services={mockServices} />

            {/* You can add other parts of your page here (e.g., Footer) */}
        </div>
    );
};

export default FeatureA;

