import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    Clock,
    Globe,
    TrendingUp,
    Award,
    ArrowRight,
    Compass,
    LogOut,
    User as UserIcon,
    ChevronRight,
    Camera,
    Star,
    Zap,
    Plus,
    LayoutGrid,
    Banknote
} from "lucide-react";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [availableTrips, setAvailableTrips] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const [filterCategory, setFilterCategory] = useState("all");
    const [groupBy, setGroupBy] = useState("none");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        fetchTrips();
    }, [navigate]);

    const fetchTrips = async () => {
        try {
            const response = await fetch(`${API_URL}/trips`);
            const data = await response.json();
            const tripsArray = Array.isArray(data) ? data : data.success ? data.trips : [];
            const formattedTrips = tripsArray.map((trip) => ({
                id: trip._id,
                destination: trip.destination,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                budget: trip.budget,
                status: new Date(trip.startDate) > new Date() ? "available" : "past",
                image: trip.image,
                imageUrl: trip.imageUrl,
                category: trip.category,
                specialOffer: trip.specialOffer,
                recommendedByTravelers: trip.recommendedByTravelers,
                continent: trip.continent,
            }));
            setAvailableTrips(formattedTrips);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleBookTrip = (tripId) => {
        navigate(`/create-trip?packageId=${tripId}`);
    };

    const continentColors = {
        Africa: "from-amber-400 to-amber-600",
        Antarctica: "from-slate-400 to-slate-600",
        Asia: "from-emerald-400 to-emerald-600",
        Europe: "from-blue-400 to-blue-600",
        "North America": "from-violet-400 to-violet-600",
        Oceania: "from-cyan-400 to-cyan-600",
        "South America": "from-rose-400 to-rose-600",
    };

    const allContinents = [
        "Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"
    ];

    const continentImages = {
        Africa: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=400",
        Antarctica: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=400",
        Asia: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&q=80&w=400",
        Europe: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400",
        "North America": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=400",
        Oceania: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=400",
        "South America": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=400",
    };

    const getRegionalSelections = () => {
        const continentMap = {};
        allContinents.forEach(c => {
            continentMap[c] = { name: c, count: 0, trips: [] };
        });

        availableTrips.forEach(trip => {
            if (trip.continent && continentMap[trip.continent]) {
                continentMap[trip.continent].count++;
                continentMap[trip.continent].trips.push(trip);
            }
        });

        return allContinents.map((continent, index) => ({
            id: index + 1,
            name: continent,
            color: continentColors[continent] || "from-gray-400 to-gray-600",
            image: continentImages[continent],
            count: continentMap[continent].count,
            trips: continentMap[continent].trips
        }));
    };

    const regionalSelections = getRegionalSelections();

    if (!user) return null;

    const getProcessedTrips = () => {
        let trips = [...availableTrips];

        // Search Query Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            trips = trips.filter(trip =>
                trip.destination?.toLowerCase().includes(query) ||
                trip.description?.toLowerCase().includes(query) ||
                trip.category?.toLowerCase().includes(query)
            );
        }

        // Continent Filter (from regional selections)
        if (selectedContinent) {
            trips = trips.filter(trip => trip.continent === selectedContinent);
        }

        // Category Filter
        if (filterCategory !== "all") {
            trips = trips.filter(trip => trip.category === filterCategory);
        }

        // Sorting
        if (sortBy === "price-low") {
            trips.sort((a, b) => a.budget - b.budget);
        } else if (sortBy === "price-high") {
            trips.sort((a, b) => b.budget - a.budget);
        } else if (sortBy === "newest") {
            trips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        }

        return trips;
    };

    const processedTrips = getProcessedTrips();
    const categories = ["all", ...new Set(availableTrips.map(t => t.category).filter(Boolean))];

    const getGroupedTrips = () => {
        if (groupBy === "none") return { "All Trips": processedTrips };

        const groups = {};
        processedTrips.forEach(trip => {
            const key = trip[groupBy] || `Uncategorized ${groupBy}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(trip);
        });
        return groups;
    };

    const groupedTrips = getGroupedTrips();

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Navigation */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div onClick={() => navigate("/dashboard")} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GlobeTrotter</h1>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2">
                            <button
                                onClick={() => navigate("/my-trips")}
                                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
                            >
                                My Trips
                            </button>
                            <button
                                onClick={() => navigate("/community-tab")}
                                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
                            >
                                Community
                            </button>

                            <div className="relative ml-2">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold hover:bg-red-700 transition overflow-hidden shadow-md ring-2 ring-white"
                                >
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || "U"
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate("/dashboard/profile")}
                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 transition flex items-center gap-2"
                                            >
                                                <UserIcon size={16} className="text-red-600" />
                                                <span>Profile Settings</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-50"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Premium Hero Section */}
                <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 md:p-16 mb-12 text-left shadow-2xl shadow-red-200/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border border-red-500/20">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

                    <div className="relative z-10 max-w-xl text-center md:text-left w-full">
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
                            Welcome back, {user.name}
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            Ready for your <span className="text-red-200">next destination?</span>
                        </h2>
                        <p className="text-base md:text-lg text-red-50 leading-relaxed font-semibold opacity-90">
                            Discover handpicked luxury packages and curated experiences designed for the modern explorer.
                        </p>
                    </div>

                    <div className="relative z-10 hidden md:block md:pr-4 lg:pr-8">
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 text-white min-w-[140px] lg:min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                                <TrendingUp size={24} className="text-red-300 mb-2 lg:mb-3 group-hover/card:scale-110 transition-transform" />
                                <p className="text-2xl lg:text-3xl font-black">{availableTrips.length}</p>
                                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-60">Trips Available</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 text-white min-w-[140px] lg:min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                                <Award size={24} className="text-red-300 mb-2 lg:mb-3 group-hover/card:scale-110 transition-transform" />
                                <p className="text-2xl lg:text-3xl font-black">12k+</p>
                                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-60">Happy Travelers</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 text-white min-w-[140px] lg:min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                                <Globe size={24} className="text-red-300 mb-2 lg:mb-3 group-hover/card:scale-110 transition-transform" />
                                <p className="text-2xl lg:text-3xl font-black">{allContinents.length}</p>
                                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-60">Continents</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 text-white min-w-[140px] lg:min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                                <Zap size={24} className="text-red-300 mb-2 lg:mb-3 group-hover/card:scale-110 transition-transform" />
                                <p className="text-2xl lg:text-3xl font-black">24/7</p>
                                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-60">Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Global Controls */}
                <div className="mb-12 bg-white rounded-[2rem] p-4 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-4 items-center relative z-40">
                    <div className="flex-1 relative group w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by destination, activity or continent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Group By Dropdown */}
                        <div className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => { setIsGroupOpen(!isGroupOpen); setIsFilterOpen(false); setIsSortOpen(false); }}
                                className={`w-full md:w-auto px-6 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${groupBy !== 'none' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <LayoutGrid size={14} /> {groupBy === 'none' ? 'Group' : `By ${groupBy}`}
                            </button>
                            {isGroupOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsGroupOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                                        {['none', 'continent', 'category'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => { setGroupBy(option); setIsGroupOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition ${groupBy === option ? 'text-red-600' : 'text-gray-700'}`}
                                            >
                                                {option === 'none' ? 'No Grouping' : `Group by ${option}`}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsGroupOpen(false); setIsSortOpen(false); }}
                                className={`w-full md:w-auto px-6 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${filterCategory !== 'all' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter size={14} /> {filterCategory === 'all' ? 'Filter' : filterCategory}
                            </button>
                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up max-h-64 overflow-y-auto">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => { setFilterCategory(cat); setIsFilterOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition ${filterCategory === cat ? 'text-red-600' : 'text-gray-700'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); setIsGroupOpen(false); }}
                                className={`w-full md:w-auto px-6 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${sortBy !== 'default' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Clock size={14} /> {sortBy === 'default' ? 'Sort' : sortBy.replace('-', ' ')}
                            </button>
                            {isSortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                                        {[
                                            { id: 'default', label: 'Default' },
                                            { id: 'price-low', label: 'Price: Low to High' },
                                            { id: 'price-high', label: 'Price: High to Low' },
                                            { id: 'newest', label: 'Newest First' }
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition ${sortBy === option.id ? 'text-red-600' : 'text-gray-700'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories / Continents Grid */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                                <Compass size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Explore by Continent</h3>
                        </div>
                        {selectedContinent && (
                            <button
                                onClick={() => setSelectedContinent(null)}
                                className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {regionalSelections.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => setSelectedContinent(region.name === selectedContinent ? null : region.name)}
                                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${selectedContinent === region.name
                                    ? 'ring-4 ring-red-500 ring-offset-2 scale-105 shadow-xl'
                                    : 'hover:-translate-y-1 hover:shadow-lg'
                                    }`}
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    <img
                                        src={region.image}
                                        alt={region.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-40 group-hover:opacity-20 transition-opacity`}></div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <p className="text-white font-black text-xs uppercase tracking-widest drop-shadow-md">{region.name}</p>
                                    </div>

                                    {region.count > 0 && (
                                        <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white shadow-sm border border-white/10">
                                            {region.count}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Trip Grid */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">
                                {selectedContinent ? `${selectedContinent} Destinations` : 'Featured Experiences'}
                            </h3>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Adventures...</p>
                        </div>
                    ) : processedTrips.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Search size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2 font-black">No matches found</h4>
                            <p className="text-gray-500 mb-8 font-medium">Try searching for something else or explore another continent.</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {Object.entries(groupedTrips).map(([groupName, trips]) => (
                                <div key={groupName} className="space-y-8 animate-fade-in">
                                    {groupBy !== "none" && (
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-xl">
                                                {groupName}
                                            </h4>
                                            <div className="flex-1 h-[2px] bg-gray-100"></div>
                                            <span className="text-xs font-bold text-gray-400">{trips.length} Destinations</span>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {trips.map((trip) => (
                                            <div
                                                key={trip.id}
                                                onClick={() => handleBookTrip(trip.id)}
                                                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                                            >
                                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                                    {trip.imageUrl ? (
                                                        <img
                                                            src={trip.imageUrl}
                                                            alt={trip.destination}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            onError={(e) => {
                                                                e.target.onerror = null; // Prevent infinite loop
                                                                e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400"; // Optional: High quality placeholder
                                                                // Or if we really want the icon:
                                                                const parent = e.target.parentElement;
                                                                parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200">
                                                            <Camera size={48} />
                                                        </div>
                                                    )}

                                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                                        {trip.specialOffer > 0 && (
                                                            <div className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-200/50">
                                                                <Zap size={14} />
                                                                Special ${trip.specialOffer.toLocaleString()} Off
                                                            </div>
                                                        )}
                                                        {trip.recommendedByTravelers && (
                                                            <div className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-200/50">
                                                                <Star size={14} />
                                                                Top Rated
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-8 flex-1 flex flex-col">
                                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-4 line-clamp-1">
                                                        {trip.destination}
                                                    </h3>

                                                    <div className="space-y-4 mb-8">
                                                        <div className="flex items-center gap-3 text-red-600">
                                                            <div className="p-2 bg-red-50 rounded-lg"><Banknote size={16} /></div>
                                                            <span className="text-lg font-black tracking-tight">${trip.budget.toLocaleString()} <span className="text-[10px] text-gray-400 uppercase ml-1">Total Package</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-gray-500">
                                                            <div className="p-2 bg-gray-50 rounded-lg"><Calendar size={16} /></div>
                                                            <span className="text-sm font-bold uppercase tracking-tight">
                                                                {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -
                                                                {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-gray-500">
                                                            <div className="p-2 bg-gray-50 rounded-lg"><Clock size={16} /></div>
                                                            <span className="text-sm font-bold uppercase tracking-tight">{trip.category || 'Luxury Experience'}</span>
                                                        </div>
                                                    </div>

                                                    <button className="mt-auto w-full py-4 bg-gray-900 group-hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-gray-200 group-hover:shadow-red-200">
                                                        Explore Package
                                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Experience CTA */}
                <section className="mb-8">
                    <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="relative z-10 max-w-xl">
                            <h3 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Can't find the perfect trip?</h3>
                            <p className="text-gray-500 font-medium mb-8">Tell our community what you're looking for and get personalized recommendations from fellow globe trotters.</p>
                            <button
                                onClick={() => navigate("/community-tab")}
                                className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all duration-300"
                            >
                                View the Community
                            </button>
                        </div>

                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}

export default DashboardPage;
