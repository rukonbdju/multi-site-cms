import React from 'react';
import {
    Clock,
    Shield,
    Wifi,
    Gauge,
    Timer,
    Settings,
} from 'lucide-react';

// Data array updated with descriptions
const benefitsList = [
    {
        Icon: Settings,
        title: 'Free Integration',
        description: 'Seamlessly integrate our services with your existing setup at no extra cost.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        Icon: Timer,
        title: 'Fast Installation',
        description: 'Get up and running in minutes, not days, with our optimized installation process.',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
    },
    {
        Icon: Gauge,
        title: 'Blazing-Fast Speeds',
        description: 'Experience unparalleled performance with our high-speed, low-latency network.',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
    },
    {
        Icon: Shield,
        title: 'Competitive Pricing',
        description: 'Top-tier features and reliable service without the enterprise-level price tag.',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
    },
    {
        Icon: Wifi,
        title: 'Constant Improvement',
        description: 'We are always evolving, adding new features based on user feedback.',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
    },
    {
        Icon: Clock,
        title: '24/7 Proactive Support',
        description: 'Our team is always available, ready to help you before issues even arise.',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
    },
];

const FeatureB = () => {
    return (
        <section className="bg-neutral-50 py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Section Title & Sub-header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why <span className="text-blue-600">Choose</span> Us
                    </h2>
                    <p className="text-lg text-gray-600">
                        We provide more than just a service. We offer a partnership built on
                        speed, reliability, and a constant drive for innovation.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Mapped Benefit Cards */}
                    {benefitsList.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl shadow-md p-6 flex items-start gap-5 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-blue-100"
                        >
                            {/* Icon with background */}
                            <div
                                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${benefit.iconBg} transition-all duration-300 group-hover:scale-110`}
                            >
                                <benefit.Icon size={24} className={benefit.iconColor} />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureB;

