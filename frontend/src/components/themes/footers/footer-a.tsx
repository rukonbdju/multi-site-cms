import React from "react";
import {
    Facebook,
    Mail,
    MessageCircle,
    ChevronRight,
    LucideProps
} from "lucide-react";

// --- Reusable Component 1: Social Icon ---
interface SocialIconProps {
    href: string;
    "aria-label": string;
    icon: React.ReactElement<LucideProps>;
}

/**
 * A reusable, styled social media icon link.
 */
const SocialIcon: React.FC<SocialIconProps> = ({ href, "aria-label": ariaLabel, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-gray-700 transition-colors duration-200 hover:bg-red-700 hover:text-white"
    // The original used custom colors 'hover:bg-skin-fill hover:text-skin-base'
    // I've used 'hover:bg-red-700' as a fallback based on the logo
    // You can replace this with your 'hover:bg-skin-fill' and 'hover:text-skin-base' if they are defined in your Tailwind config
    >
        {React.cloneElement(icon, { size: 18 })}
    </a>
);

// --- Reusable Component 2: Footer Section Title ---
interface FooterSectionTitleProps {
    title: string;
}

/**
 * A reusable, styled title for footer sections.
 */
const FooterSectionTitle: React.FC<FooterSectionTitleProps> = ({ title }) => (
    <h6 className="mb-5 border-b-2 border-[#BE1E2D] pb-2 text-base font-semibold text-white opacity-90">
        {title}
    </h6>
);

// --- Reusable Component 3: Footer Link ---
interface FooterLinkProps {
    href: string;
    label: string;
    download?: boolean | string; // Can be boolean or the download filename
}

/**
 * A reusable, styled link for footer navigation, with a hover effect.
 */
const FooterLink: React.FC<FooterLinkProps> = ({ href, label, download }) => {
    const commonClasses =
        "group mb-2 flex items-center gap-1.5 text-gray-300 transition-all duration-200 hover:text-red-500 hover:translate-x-2";
    // Replace 'hover:text-red-500' with your 'hover:text-skin-main' if defined

    const content = (
        <>
            <ChevronRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
            />
            {label}
        </>
    );

    return (
        <a
            href={href}
            download={download}
            className={commonClasses}
        >
            {content}
        </a>
    );
};

// --- Main Footer Component ---
const Footer: React.FC = () => {
    // Using a placeholder for the logo as the local file path cannot be resolved here.
    const logoUrl = "https://placehold.co/150x50/BE1E2D/white?text=Red+Data";

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Assuming bg-skin-unfill is a dark color, like bg-gray-900 */}
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Column 1: Company Info & Socials */}
                    <div className="flex flex-col gap-4">
                        <img
                            src={logoUrl}
                            alt="Red Data Logo"
                            className="h-12 w-fit object-contain"
                        />
                        <p className="text-sm leading-relaxed">
                            Red Data (Pvt.) Limited <br />
                            Level 19, SimpleTree Attalika, <br />
                            134 Gulshan Avenue, Dhaka-1212, Bangladesh
                        </p>
                        <div className="flex gap-3 pt-2">
                            <SocialIcon
                                href="http://www.facebook.com/groups/reddatalimited/"
                                aria-label="Red Data Facebook Group"
                                icon={<Facebook />}
                            />
                            <SocialIcon
                                href="mailto:info@reddata.com.bd"
                                aria-label="Email Red Data"
                                icon={<Mail />}
                            />
                            <SocialIcon
                                href="https://www.facebook.com/profile.php?id=61556093758540&mibextid=ZbWKwL"
                                aria-label="Contact Red Data on Facebook"
                                icon={<MessageCircle />}
                            />
                        </div>
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <FooterSectionTitle title="Services" />
                        <nav className="flex flex-col">
                            <FooterLink href="/home-internet" label="Home Internet" />
                            <FooterLink href="/corporate-internet" label="Enterprise Internet" />
                            <FooterLink href="/blogs" label="Blog" />
                            <FooterLink href="/home-internet" label="Package" />
                        </nav>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <FooterSectionTitle title="Company" />
                        <nav className="flex flex-col">
                            <FooterLink href="/aboutus" label="About Us" />
                            <FooterLink href="/contact" label="Contact Us" />
                            <FooterLink href="/docs" label="Company Doc" />
                            {/* Assuming '/docs' is the link */}
                            <FooterLink
                                href="/tariff.pdf"
                                label="BTRC Approved Tariff"
                                download="btrc-approved-tariff.pdf"
                            />
                        </nav>
                    </div>

                    {/* Column 4: Registered Address */}
                    <div>
                        <FooterSectionTitle title="REGISTERED ADDRESS" />
                        <p className="text-sm leading-relaxed">
                            House 5/A, Road 2, <br />
                            Lane 3, Block G, <br />
                            Halishahar, Chittagong, Bangladesh
                        </p>
                    </div>

                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-black py-5">
                <p className="text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Red Data (Pvt.) Limited. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

