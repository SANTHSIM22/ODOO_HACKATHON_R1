import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ChevronDown, Clock } from "lucide-react";

const ActivitySearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [groupBy, setGroupBy] = useState("None");
    const [sortBy, setSortBy] = useState("Recommended");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [minRating, setMinRating] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDuration, setSelectedDuration] = useState("All");
    const [addedActivities, setAddedActivities] = useState(new Set());

    const toggleActivity = (id) => {
        setAddedActivities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Mock Data
    const activities = [
        { id: 1, title: "Paragliding in Alps", location: "Interlaken, Switzerland", price: 150, rating: 4.8, category: "Adventure", duration: "3 hours", image: "https://via.placeholder.com/600x200" },
        { id: 2, title: "Scuba Diving", location: "Great Barrier Reef, Australia", price: 200, rating: 4.9, category: "Adventure", duration: "5 hours", image: "https://via.placeholder.com/600x200" },
        { id: 3, title: "City Walking Tour", location: "Rome, Italy", price: 30, rating: 4.5, category: "Sightseeing", duration: "2 hours", image: "https://via.placeholder.com/600x200" },
        { id: 4, title: "Desert Safari", location: "Dubai, UAE", price: 80, rating: 4.7, category: "Adventure", duration: "6 hours", image: "https://via.placeholder.com/600x200" },
        { id: 5, title: "Northern Lights Tour", location: "Reykjavik, Iceland", price: 120, rating: 4.9, category: "Sightseeing", duration: "4 hours", image: "https://via.placeholder.com/600x200" },
        { id: 6, title: "Sushi Making Class", location: "Tokyo, Japan", price: 60, rating: 4.6, category: "Food & Drink", duration: "2.5 hours", image: "https://via.placeholder.com/600x200" },
    ];

    const categories = ["All", ...new Set(activities.map(a => a.category))];
    const durations = ["All", ...new Set(activities.map(a => a.duration))];

    // Processing Logic
    let processedActivities = activities.filter(activity =>
    (activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filtering
    if (selectedCategory !== "All") {
        processedActivities = processedActivities.filter(a => a.category === selectedCategory);
    }
    if (selectedDuration !== "All") {
        processedActivities = processedActivities.filter(a => a.duration === selectedDuration);
    }
    if (priceRange.min > 0 || priceRange.max < 1000) {
        processedActivities = processedActivities.filter(a => a.price >= priceRange.min && a.price <= priceRange.max);
    }
    if (minRating > 0) {
        processedActivities = processedActivities.filter(a => a.rating >= minRating);
    }

    // Sorting
    if (sortBy === "Price: Low to High") {
        processedActivities.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
        processedActivities.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating") {
        processedActivities.sort((a, b) => b.rating - a.rating);
    }

    const [activeDropdown, setActiveDropdown] = useState(null);

    const groupOptions = ["None", "Location"];
    const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

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
                                placeholder="Search for activities, cities..."
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
                                    <ChevronDown size={14} />
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
                                    className={`px-5 py-2.5 rounded-full border transition whitespace-nowrap font-bold flex items-center gap-2 ${(priceRange.min > 0 || priceRange.max < 1000 || minRating > 0 || selectedCategory !== "All" || selectedDuration !== "All") ? "bg-brand-medium text-white border-transparent" : "bg-brand-pale text-brand-dark border-transparent hover:bg-brand-medium hover:text-white"}`}
                                >
                                    Filters
                                    <ChevronDown size={14} />
                                </button>
                                {activeDropdown === "filter" && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 max-h-[80vh] overflow-y-auto">
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2">Category</h4>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-medium bg-white"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2">Duration</h4>
                                            <select
                                                value={selectedDuration}
                                                onChange={(e) => setSelectedDuration(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-medium bg-white"
                                            >
                                                {durations.map(dur => (
                                                    <option key={dur} value={dur}>{dur}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-700 mb-2">Price Range</h4>
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
                                            <h4 className="font-bold text-gray-700 mb-2">Minimum Rating</h4>
                                            <div className="flex justify-between gap-1">
                                                {[3, 4, 4.5].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1 ${minRating === rating ? "bg-brand-medium text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                    >
                                                        {rating}+ <Star size={12} className={minRating === rating ? "fill-white" : "fill-gray-600"} />
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
                                                setPriceRange({ min: 0, max: 1000 });
                                                setMinRating(0);
                                                setSelectedCategory("All");
                                                setSelectedDuration("All");
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
                                    <ChevronDown size={14} />
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
                        {groupBy === "Location" ? (
                            Object.entries(processedActivities.reduce((acc, activity) => {
                                const key = activity.location.split(',')[0]; // Group by city
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(activity);
                                return acc;
                            }, {})).map(([location, groupActivities]) => (
                                <div key={location} className="mb-8">
                                    <h3 className="text-lg font-bold text-brand-dark mb-4 bg-brand-pale/20 inline-block px-4 py-1 rounded-lg">{location}</h3>
                                    <div className="space-y-6">
                                        {groupActivities.map(activity => (
                                            <div key={activity.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-medium transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                                <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <div className="w-full h-full bg-brand-pale/20 flex items-center justify-center text-brand-medium">
                                                        IMAGE
                                                    </div>
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-dark transition mb-1">{activity.title}</h3>
                                                            <p className="text-gray-500 mb-2 flex items-center text-sm">
                                                                <MapPin size={14} className="mr-1 text-gray-400" /> {activity.location}
                                                            </p>
                                                        </div>
                                                        <span className="px-2 py-1 bg-brand-pale/30 rounded text-xs font-bold text-brand-dark">
                                                            {activity.category}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                                        Experience the thrill of {activity.title} in {activity.location}. Duration: {activity.duration}. Perfect for {activity.category} lovers.
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium flex items-center gap-1"><Clock size={14} /> {activity.duration}</span>
                                                        <span className="bg-brand-pale/30 px-3 py-1 rounded-full text-brand-dark font-medium">${activity.price}</span>
                                                        <span className="flex items-center gap-1"><Star size={14} className="fill-brand-dark text-brand-dark" /> {activity.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="self-end sm:self-center mt-4 sm:mt-0 flex flex-col gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleActivity(activity.id);
                                                        }}
                                                        className={`px-6 py-2 rounded-lg transition font-medium shadow-sm hover:shadow ${addedActivities.has(activity.id) ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-brand-medium text-white hover:bg-brand-dark"}`}
                                                    >
                                                        {addedActivities.has(activity.id) ? "Remove" : "Add to Trip"}
                                                    </button>
                                                    <button className="text-sm text-gray-400 hover:text-brand-medium underline">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            processedActivities.length > 0 ? (
                                processedActivities.map(activity => (
                                    <div key={activity.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-medium transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                            <div className="w-full h-full bg-brand-pale/20 flex items-center justify-center text-brand-medium">
                                                IMAGE
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-dark transition mb-1">{activity.title}</h3>
                                                    <p className="text-gray-500 mb-2 flex items-center text-sm">
                                                        <MapPin size={14} className="mr-1 text-gray-400" /> {activity.location}
                                                    </p>
                                                </div>
                                                <span className="px-2 py-1 bg-brand-pale/30 rounded text-xs font-bold text-brand-dark">
                                                    {activity.category}
                                                </span>
                                            </div>

                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                                Experience the thrill of {activity.title} in {activity.location}. Duration: {activity.duration}. Perfect for {activity.category} lovers.
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium flex items-center gap-1"><Clock size={14} /> {activity.duration}</span>
                                                <span className="bg-brand-pale/30 px-3 py-1 rounded-full text-brand-dark font-medium">${activity.price}</span>
                                                <span className="flex items-center gap-1"><Star size={14} className="fill-brand-dark text-brand-dark" /> {activity.rating}</span>
                                            </div>
                                        </div>

                                        <div className="self-end sm:self-center mt-4 sm:mt-0 flex flex-col gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleActivity(activity.id);
                                                }}
                                                className={`px-6 py-2 rounded-lg transition font-medium shadow-sm hover:shadow ${addedActivities.has(activity.id) ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-brand-medium text-white hover:bg-brand-dark"}`}
                                            >
                                                {addedActivities.has(activity.id) ? "Remove" : "Add to Trip"}
                                            </button>
                                            <button className="text-sm text-gray-400 hover:text-brand-medium underline">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl">No activities found matching "{searchQuery}"</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActivitySearchPage;
