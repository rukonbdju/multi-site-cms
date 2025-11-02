'use client'
import React, { useState, FormEvent, ElementType } from 'react';
import { CalendarDays, Hand } from 'lucide-react';

// --- REUSABLE NEWSLETTER COMPONENT ---

/**
 * Defines a single feature to be displayed in the list.
 */
interface Feature {
    /** The title of the feature. */
    title: string;
    /** A brief description of the feature. */
    description: string;
    /** The icon component (e.g., from lucide-react) to display. */
    icon: ElementType;
}

/**
 * Props for the reusable NewsletterCTA component.
 */
interface NewsletterCTAProps {
    /** The main heading. */
    title: string;
    /** The supporting text below the heading. */
    description: string;
    /** Text to display on the submit button. */
    buttonText: string;
    /** Placeholder text for the email input field. */
    inputPlaceholder: string;
    /** An array of features to display. */
    features: Feature[];
    /**
     * Callback function triggered on form submission.
     * @param email The email submitted by the user.
     */
    onSubscribe: (email: string) => void;
}

/**
 * A reusable call-to-action component for newsletter subscriptions.
 */
const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
    title,
    description,
    buttonText,
    inputPlaceholder,
    features,
    onSubscribe,
}) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubscribe(email);
        setEmail(''); // Clear input after submission
    };

    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32 rounded-lg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">

                    {/* Text and Form Section */}
                    <div className="max-w-xl lg:max-w-lg">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-gray-300">
                            {description}
                        </p>
                        <form className="mt-6 flex max-w-md gap-x-4" onSubmit={handleSubmit}>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder={inputPlaceholder}
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                            <button
                                type="submit"
                                className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                {buttonText}
                            </button>
                        </form>
                    </div>

                    {/* Features Section */}
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex flex-col items-start">
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <feature.icon
                                        aria-hidden="true"
                                        className="size-6 text-white"
                                    />
                                </div>
                                <dt className="mt-4 font-semibold text-white">
                                    {feature.title}
                                </dt>
                                <dd className="mt-2 leading-7 text-gray-400">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Background Gradient */}
            <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>
        </div>
    );
};

// --- EXAMPLE USAGE ---

/**
 * Main App component demonstrating the reusable NewsletterCTA.
 */
export default function NewsletterA() {
    // Define the features to be passed as props
    const newsletterFeatures: Feature[] = [
        {
            title: 'Weekly articles',
            description: 'Non laboris consequat cupidatat laborum magna. Eiusmod non irure cupidatat duis commodo amet.',
            icon: CalendarDays, // Using lucide-react icon
        },
        {
            title: 'No spam',
            description: 'Officia excepteur ullamco ut sint duis proident non adipisicing. Voluptate incididunt anim.',
            icon: Hand, // Using lucide-react icon
        },
    ];

    // Define the subscription handler function
    const handleSubscribe = (email: string) => {
        // In a real app, you'd send this email to your backend API
        console.log('Subscribing email:', email);
        // You could show a success message here
    };

    return (
        <div className="p-4 sm:p-8 md:p-12">
            <NewsletterCTA
                title="Subscribe to our newsletter"
                description="Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt dolore."
                buttonText="Subscribe"
                inputPlaceholder="Enter your email"
                features={newsletterFeatures}
                onSubscribe={handleSubscribe}
            />
        </div>
    );
}
