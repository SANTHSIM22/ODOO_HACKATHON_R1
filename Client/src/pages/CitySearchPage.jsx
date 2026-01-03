import { useState } from "react";
import { Link } from "react-router-dom";

const CitySearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [groupBy, setGroupBy] = useState("None");
    const [sortBy, setSortBy] = useState("Recommended");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [minRating, setMinRating] = useState(0);

    // Mock Data
    const cities = [
        { id: 1, name: "Paris", country: "France", avgPrice: 1200, rating: 4.9, image: "https://via.placeholder.com/600x200" },
        { id: 2, name: "Tokyo", country: "Japan", avgPrice: 1500, rating: 4.8, image: "https://via.placeholder.com/600x200" },
        { id: 3, name: "New York City", country: "USA", avgPrice: 2000, rating: 4.7, image: "https://via.placeholder.com/600x200" },
        { id: 4, name: "Rome", country: "Italy", avgPrice: 1100, rating: 4.8, image: "https://via.placeholder.com/600x200" },
        { id: 5, name: "Sydney", country: "Australia", avgPrice: 1800, rating: 4.6, image: "https://via.placeholder.com/600x200" },
        { id: 6, name: "Cape Town", country: "South Africa", avgPrice: 900, rating: 4.7, image: "https://via.placeholder.com/600x200" },
        { id: 7, name: "Kyoto", country: "Japan", avgPrice: 1300, rating: 4.9, image: "https://via.placeholder.com/600x200" },
        { id: 8, name: "Barcelona", country: "Spain", avgPrice: 1000, rating: 4.7, image: "https://via.placeholder.com/600x200" },
    ];

    // Processing Logic
    let processedCities = cities.filter(city =>
    (city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filtering
    if (priceRange.min > 0 || priceRange.max < 5000) {
        processedCities = processedCities.filter(c => c.avgPrice >= priceRange.min && c.avgPrice <= priceRange.max);
    }
    if (minRating > 0) {
        processedCities = processedCities.filter(c => c.rating >= minRating);
    }

    // Sorting
    if (sortBy === "Cost: Low to High") {
        processedCities.sort((a, b) => a.avgPrice - b.avgPrice);
    } else if (sortBy === "Cost: High to Low") {
        processedCities.sort((a, b) => b.avgPrice - a.avgPrice);
    } else if (sortBy === "Popularity") {
        processedCities.sort((a, b) => b.rating - a.rating);
    }

    const [activeDropdown, setActiveDropdown] = useState(null);

    const groupOptions = ["None", "Country"];
    const sortOptions = ["Recommended", "Cost: Low to High", "Cost: High to Low", "Popularity"];

    // Handlers
    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    const handleOptionSelect = (type, option) => {
        if (type === "group") setGroupBy(option);
        if (type === "sort") setSortBy(option);
        setActiveDropdown(null);
    };

    return (
        <div>
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full max-w-2xl">
                            <input
                                type="text"
                                placeholder="Search for cities, countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-6 pr-4 py-3 rounded-full border-2 border-brand-light focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-pale/50 transition shadow-sm text-lg placeholder-gray-400"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 w-full md:w-auto z-20">
                            {/* Group By Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown("group")}
                                    className={`px-5 py-2.5 rounded-full border transition whitespace-nowrap font-bold flex items-center gap-2 ${groupBy !== "None" ? "bg-brand-medium text-white border-transparent" : "bg-brand-pale text-brand-dark border-transparent hover:bg-brand-medium hover:text-white"}`}
                                >
                                    Group by: {groupBy}
                                    <span className="text-xs">▼</span>
                                </button>
                                {activeDropdown === "group" && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50">
                                        {groupOptions.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => handleOptionSelect("group", option)}
                                                className={`w-full text-left px-4 py-2 hover:bg-brand-pale/50 hover:pl-6 transition-all duration-200 ${groupBy === option ? "text-brand-medium font-bold" : "text-gray-700"}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown("filter")}
                                    className={`px-5 py-2.5 rounded-full border transition whitespace-nowrap font-bold flex items-center gap-2 ${(priceRange.min > 0 || priceRange.max < 5000 || minRating > 0) ? "bg-brand-medium text-white border-transparent" : "bg-brand-pale text-brand-dark border-transparent hover:bg-brand-medium hover:text-white"}`}
                                >
                                    Filters
                                    <span className="text-xs">▼</span>
                                </button>
                                {activeDropdown === "filter" && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2">Avg Price Range</h4>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-medium"
                                                />
                                                <span className="text-gray-400">-</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2">Minimum Pop. Rating</h4>
                                            <div className="flex justify-between gap-1">
                                                {[3, 4, 4.5].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${minRating === rating ? "bg-brand-medium text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                    >
                                                        {rating}+ ⭐
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveDropdown(null)}
                                            className="w-full py-2 bg-brand-dark text-white rounded-lg font-bold hover:bg-opacity-90 transition shadow-sm"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPriceRange({ min: 0, max: 5000 });
                                                setMinRating(0);
                                            }}
                                            className="w-full mt-2 py-2 text-gray-500 hover:text-brand-dark text-sm font-medium transition"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown("sort")}
                                    className={`px-5 py-2.5 rounded-full border transition whitespace-nowrap font-bold flex items-center gap-2 ${sortBy !== "Recommended" ? "bg-brand-medium text-white border-transparent" : "bg-brand-pale text-brand-dark border-transparent hover:bg-brand-medium hover:text-white"}`}
                                >
                                    Sort by: {sortBy}
                                    <span className="text-xs">▼</span>
                                </button>
                                {activeDropdown === "sort" && (
                                    <div className="absolute top-full right-0 md:left-auto md:right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => handleOptionSelect("sort", option)}
                                                className={`w-full text-left px-4 py-2 hover:bg-brand-pale/50 hover:pl-6 transition-all duration-200 ${sortBy === option ? "text-brand-medium font-bold" : "text-gray-700"}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1">Results</h2>
                    <div className="space-y-6">
                        {groupBy === "Country" ? (
                            Object.entries(processedCities.reduce((acc, city) => {
                                const key = city.country;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(city);
                                return acc;
                            }, {})).map(([country, groupCities]) => (
                                <div key={country} className="mb-8">
                                    <h3 className="text-lg font-bold text-brand-dark mb-4 bg-brand-pale/20 inline-block px-4 py-1 rounded-lg">{country}</h3>
                                    <div className="space-y-6">
                                        {groupCities.map(city => (
                                            <div key={city.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-medium transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                                <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <div className="w-full h-full bg-brand-pale/20 flex items-center justify-center text-brand-medium">
                                                        IMAGE
                                                    </div>
                                                </div>

                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-dark transition mb-2">{city.name}</h3>
                                                    <p className="text-gray-500 mb-3 flex items-center">
                                                        <span className="mr-2">🏳️</span> {city.country}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <span className="bg-brand-pale/30 px-3 py-1 rounded-full text-brand-dark font-medium">Est. Cost: ${city.avgPrice}</span>
                                                        <span className="flex items-center">⭐ {city.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="self-end sm:self-center mt-4 sm:mt-0">
                                                    <button className="px-6 py-2 rounded-lg bg-white border border-brand-medium text-brand-medium hover:bg-brand-medium hover:text-white transition font-medium">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            processedCities.length > 0 ? (
                                processedCities.map(city => (
                                    <div key={city.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-medium transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                            <div className="w-full h-full bg-brand-pale/20 flex items-center justify-center text-brand-medium">
                                                IMAGE
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-dark transition mb-2">{city.name}</h3>
                                            <p className="text-gray-500 mb-3 flex items-center">
                                                <span className="mr-2">🏳️</span> {city.country}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <span className="bg-brand-pale/30 px-3 py-1 rounded-full text-brand-dark font-medium">Est. Cost: ${city.avgPrice}</span>
                                                <span className="flex items-center">⭐ {city.rating}</span>
                                            </div>
                                        </div>

                                        <div className="self-end sm:self-center mt-4 sm:mt-0">
                                            <button className="px-6 py-2 rounded-lg bg-white border border-brand-medium text-brand-medium hover:bg-brand-medium hover:text-white transition font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl">No cities found matching "{searchQuery}"</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CitySearchPage;
