import { Navbar } from "@/components/themes/navbar";
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
        <div>
            <Navbar navItems={navigationData} />
            <Slider />
        </div>
    )
}

export default Preview;