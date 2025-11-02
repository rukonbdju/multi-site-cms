import FeatureA from "@/components/themes/features/feature-a";
import FeatureB from "@/components/themes/features/feature-b";
import FeatureC from "@/components/themes/features/feature-c";
import Footer from "@/components/themes/footers/footer-a";
import { Navbar } from "@/components/themes/navbar";
import NewsletterA from "@/components/themes/newsletter-sections/newsletter-a";
import PricingA from "@/components/themes/pricing/pricingA";
import Slider from "@/components/themes/slider";

// 1. Define your navigation items.
const navigationData = [
    { label: 'Home', path: '#' },
    {
        label: 'Services',
        path: '#',
        children: [
            { label: 'Web Development', path: '#' },
            { label: 'Mobile Development', path: '#' },
            { label: 'SEO', path: '#' },
        ],
    },
    { label: 'About', path: '#' },
    {
        label: 'Products',
        path: '#',
        children: [
            { label: 'Product A', path: '#' },
            { label: 'Product B', path: '#' },
        ],
    },
    { label: 'Contact', path: '#' },
];

const Preview = () => {
    return (
        <div className="bg-white">
            <Navbar navItems={navigationData} />
            <Slider />
            <PricingA />
            <FeatureA />
            <NewsletterA />
            <FeatureB />
            <FeatureC />
            <Footer />
        </div>
    )
}

export default Preview;