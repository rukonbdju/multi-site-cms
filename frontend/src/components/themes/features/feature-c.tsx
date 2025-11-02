"use client";

import React, { useState, useMemo, FC } from "react";
// Import icons from lucide-react
import { MapPin, Search, SearchX } from "lucide-react"; // Removed ChevronDown, Added SearchX

// --- TYPE DEFINITIONS ---

/**
 * Represents a geographical division.
 */
export interface Division {
    id: string | number;
    name: string;
    [key: string]: unknown; // Allow other properties if needed
}

/**
 * Represents a geographical district, linked to a division.
 */
export interface District {
    id: string | number;
    name: string;
    division_id: string | number; // Foreign key linking to Division
    [key: string]: unknown; // Allow other properties
}

/**
 * Props for the reusable AreaCoverage component.
 */
export interface AreaCoverageProps {
    /** The main title to display on the banner. */
    title: string;
    /** Placeholder text for the search input. */
    searchPlaceholder?: string;
    /** An array of all available divisions. */
    divisions: Division[];
    /** An array of all available districts. */
    districts: District[];
}

// --- REUSABLE COMPONENT ---

/**
 * A reusable component to display and search through a list of
 * districts grouped by division.
 */
export const AreaCoverage: FC<AreaCoverageProps> = ({
    title,
    searchPlaceholder = "Search Area",
    divisions,
    districts,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    // Memoize the filtered districts to avoid re-calculating on every render
    const filteredDistricts = useMemo(() => {
        // If no search term, return all districts
        if (!searchTerm) {
            return districts;
        }
        // Otherwise, filter by name and ensure their division exists
        return districts.filter(
            (district) =>
                district.name.toLowerCase().includes(searchTerm) &&
                // Use .some() to check for existence (fixes potential bug in original logic)
                divisions.some((division) => division.id === district.division_id)
        );
    }, [searchTerm, districts, divisions]);

    // Memoize the grouped list
    const groupedDistricts = useMemo(() => {
        return divisions
            .map((division) => ({
                ...division,
                // Filter the *already filtered* list of districts
                districts: filteredDistricts.filter(
                    (district) => district.division_id === division.id
                ),
            }))
            .filter((division) => division.districts.length > 0); // Hide divisions with no matching districts
    }, [divisions, filteredDistricts]);

    return (
        <div className="bg-neutral-100 min-h-screen p-4 sm:p-8">
            <main className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="p-6 sm:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {title}
                    </h1>
                    <p className="mt-2 text-base sm:text-lg text-gray-600">
                        Find your area of service below. Use the search to filter by
                        district.
                    </p>
                </div>

                {/* Search Bar Section */}
                <div className="px-6 sm:px-10 pb-8 border-b border-gray-200">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            className="p-4 pl-12 rounded-lg shadow-sm bg-gray-50 text-gray-700 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder={searchPlaceholder}
                            onChange={handleSearchChange}
                            value={searchTerm}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Results List Section */}
                <div className="p-6 sm:p-10">
                    {groupedDistricts.length > 0 ? (
                        <div className="space-y-10">
                            {groupedDistricts.map((division) => (
                                <section key={division.id}>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                                        {division.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {division.districts.map((district) => (
                                            <div
                                                className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100 transition-all hover:bg-indigo-100 hover:shadow-sm cursor-default"
                                                key={district.id}
                                            >
                                                <MapPin className="w-4 h-4" />
                                                <span>{district.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500 py-16">
                            <SearchX className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-xl font-medium">No results found</p>
                            <p className="mt-1">
                                Try adjusting your search terms or clear the search.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// --- MAIN APP (DEMONSTRATION) ---

// Mock data (replace with your actual JSON imports)
const divisions: Division[] = [
    { id: "1", name: "Dhaka" },
    { id: "2", name: "Chittagong" },
    { id: "3", name: "Rajshahi" },
    { id: "4", name: "Khulna" },
];

const districts: District[] = [
    { id: "101", name: "Dhaka", division_id: "1" },
    { id: "102", name: "Gazipur", division_id: "1" },
    { id: "103", "name": "Narayanganj", division_id: "1" },
    { id: "201", name: "Chittagong", division_id: "2" },
    { id: "202", name: "Cox's Bazar", division_id: "2" },
    { id: "203", name: "Comilla", division_id: "2" },
    { id: "301", name: "Rajshahi", division_id: "3" },
    { id: "302", name: "Bogra", division_id: "3" },
    { id: "303", name: "Pabna", division_id: "3" },
    { id: "401", name: "Khulna", division_id: "4" },
    { id: "402", name: "Jessore", division_id: "4" },
    { id: "403", name: "Satkhira", division_id: "4" },
];

/**
 * This is the main App component that demonstrates how to use the
 * reusable AreaCoverage component.
 */
const FeatureC: FC = () => {
    return (
        <div className="font-sans bg-neutral-100">
            {/* The AreaCoverage component now controls its own background 
        and padding, so it will fill the page.
      */}
            <AreaCoverage
                title="Our Area Coverage"
                searchPlaceholder="Search for a district..."
                divisions={divisions}
                districts={districts}
            />

            {/* You could even reuse it with different data */}
            {/*
      <AreaCoverage
        title="International Coverage"
        searchPlaceholder="Search for a city..."
        divisions={[{id: "100", name: "USA"}]}
        districts={[{id: "1001", name: "New York", division_id: "100"}]}
      />
      */}
        </div>
    );
};

export default FeatureC;

