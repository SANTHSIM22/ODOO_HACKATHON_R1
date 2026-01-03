import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    Plus,
    X,
    LogOut,
    User,
    Calendar,
    Info,
    Camera,
    Filter,
    RotateCcw,
    MessageSquare,
    Share2,
    Heart,
    Plane,
    Copy,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";

import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

const CommunityPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isCopying, setIsCopying] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        placeName: "",
        location: "",
        description: "",
        imageUrl: "",
        tips: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const dummyPosts = [
        {
            _id: "dummy1",
            placeName: "The Hidden Gems of Kyoto",
            location: "Kyoto, Japan",
            description:
                "Walking through the Arashiyama Bamboo Grove at sunrise is a spiritual experience. The way the light filters through the towering stalks is simply magical. The sound of rustling leaves combined with the early morning mist creates an atmosphere of pure tranquility.",
            imageUrl:
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
            tips: "Go before 7 AM to avoid the massive crowds and get perfect photos. Also, wear comfortable shoes as there's a lot of walking involved.",
            userName: "Aisha Chen",
            userImage: null,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "dummy2",
            placeName: "Street Food Tour in Bangkok",
            location: "Bangkok, Thailand",
            description:
                "From spicy Pad Thai to sweet Mango Sticky Rice, the street food scene in Bangkok is unparalleled. We spent 4 hours just eating through the Yaowarat Night Market. The energy is infectious and the flavors are bold.",
            imageUrl:
                "https://unsplash.com/photos/two-auto-rickshaw-on-the-street--y3sidWvDxg",
            tips: "Look for the stalls with the longest queues—that's where the locals eat! Don't be afraid to try things you don't recognize.",
            userName: "Marco Rossi",
            userImage: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            _id: "dummy3",
            placeName: "Sunset at Oia",
            location: "Santorini, Greece",
            description:
                "The classic white walls and blue domes look even better in person during the golden hour. A bit touristy but absolutely worth the trip at least once. The view over the caldera as the sun dips below the horizon is something you'll never forget.",
            imageUrl:
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000",
            tips: "Dinner reservations at restaurants with views need to be made weeks in advance. Try to find a spot at the old castle for the best free view.",
            userName: "Sarah Jenkins",
            userImage: null,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
    ];

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCommunityPosts();
    }, [navigate]);

    const fetchCommunityPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/community/posts`);
            const data = await response.json();
            if (data.success) {
                setPosts([...data.posts, ...dummyPosts]);
            } else {
                setPosts(dummyPosts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts(dummyPosts);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyTrip = (e, post) => {
        e.stopPropagation();
        setIsCopying(true);

        // Simulating the API call to copy trip
        setTimeout(() => {
            setIsCopying(false);
            alert(
                `Great! "${post.placeName}" has been copied to your personal trips.`
            );
            // In a real app, we would redirect to the newly created trip or itinerary builder
            // navigate(`/itinerary/edit/${newId}`);
        }, 1200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingPost
                ? `${API_URL}/community/posts/${editingPost._id}`
                : `${API_URL}/community/posts`;
            const method = editingPost ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    editingPost
                        ? formData
                        : {
                            ...formData,
                            userId: user._id,
                            userName: user.name || user.username,
                            userImage: user.profileImage,
                        }
                ),
            });

            const data = await response.json();

            if (data.success) {
                setFormData({
                    placeName: "",
                    location: "",
                    description: "",
                    imageUrl: "",
                    tips: "",
                });
                setShowForm(false);
                setEditingPost(null);
                fetchCommunityPosts();
            } else {
                alert(data.message || "Failed to save post");
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Error saving post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            placeName: post.placeName,
            location: post.location,
            description: post.description,
            imageUrl: post.imageUrl || "",
            tips: post.tips || "",
        });
        setShowForm(true);
    };

    const handleDeletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`${API_URL}/community/posts/${postId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                fetchCommunityPosts();
                setSelectedPost(null);
            } else {
                alert(data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const filteredPosts = posts
        .filter(
            (post) =>
                post.placeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "newest")
                return new Date(b.createdAt) - new Date(a.createdAt);
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Minimalist Navigation */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                GlobeTrotter
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate("/my-trips")}
                                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
                            >
                                My Trips
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/profile")}
                                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
                            >
                                Profile
                            </button>

                            <div className="relative ml-2">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold hover:bg-red-700 transition overflow-hidden shadow-md ring-2 ring-white"
                                >
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || "U"
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                                <p className="text-sm font-bold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
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
                {/* Hero / Header Section */}
                <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 mb-10 text-center shadow-2xl shadow-red-200/50 relative overflow-hidden border border-red-500/20">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
                            Community Stories
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">
                            Explore the world through{" "}
                            <span className="text-red-200">other's eyes</span>
                        </h2>
                        <p className="text-base md:text-lg text-red-50 mb-8 md:mb-10 leading-relaxed font-medium opacity-90">
                            Join our global community of passionate travelers. Share your
                            adventures, discover hidden gems, and get inspired for your next
                            journey.
                        </p>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-white text-red-600 px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 font-bold uppercase tracking-wider shadow-2xl shadow-black/10 flex items-center gap-3 mx-auto group text-sm md:text-base w-full md:w-auto justify-center"
                        >
                            {showForm ? (
                                <X size={20} />
                            ) : (
                                <Plus
                                    size={20}
                                    className="group-hover:rotate-90 transition-transform"
                                />
                            )}
                            {showForm ? "Cancel Sharing" : "Share Your Story"}
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="md:col-span-3 relative group">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by destination, place name or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Filter
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={16}
                            />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm font-bold text-gray-700 appearance-none cursor-pointer text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSortBy("newest");
                            }}
                            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                            title="Reset filters"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Post Submission Form */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-8 mb-12 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Share your experience
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    Help others discover new places
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Place Name
                                    </label>
                                    <div className="relative">
                                        <Plane
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={18}
                                        />
                                        <input
                                            type="text"
                                            required
                                            value={formData.placeName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, placeName: e.target.value })
                                            }
                                            placeholder="e.g. Eiffel Tower"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={18}
                                        />
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, location: e.target.value })
                                            }
                                            placeholder="e.g. Paris, France"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Experience Description
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Tell us what makes this place special..."
                                    rows={4}
                                    className="w-full bg-gray-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-red-500/20 transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Photo URL
                                    </label>
                                    <div className="relative">
                                        <Camera
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={18}
                                        />
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) =>
                                                setFormData({ ...formData, imageUrl: e.target.value })
                                            }
                                            placeholder="https://..."
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Key Travel Tip
                                    </label>
                                    <div className="relative">
                                        <Info
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={18}
                                        />
                                        <input
                                            type="text"
                                            value={formData.tips}
                                            onChange={(e) =>
                                                setFormData({ ...formData, tips: e.target.value })
                                            }
                                            placeholder="Share one helpful tip..."
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingPost(null);
                                        setFormData({
                                            placeName: "",
                                            location: "",
                                            description: "",
                                            imageUrl: "",
                                            tips: "",
                                        });
                                    }}
                                    className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-red-600 text-white px-10 py-3 rounded-2xl hover:bg-red-700 transition font-bold shadow-lg shadow-red-100 disabled:opacity-50"
                                >
                                    {submitting
                                        ? editingPost
                                            ? "Updating..."
                                            : "Sharing..."
                                        : editingPost
                                            ? "Update Post"
                                            : "Post to Community"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-bold">Discovering stories...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No matching stories
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">
                            Try adjusting your search or filters to find what you are looking
                            for.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(
                            (post) =>
                                post._id !== "placeholder" && (
                                    <div
                                        key={post._id}
                                        onClick={() => setSelectedPost(post)}
                                        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                                    >
                                        {/* Post Image */}
                                        <div className="relative h-64 overflow-hidden bg-gray-100 group">
                                            {/* Fallback Background (always there) */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200">
                                                <Camera size={48} />
                                            </div>

                                            <img
                                                src={
                                                    post.imageUrl ||
                                                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000"
                                                }
                                                alt={post.placeName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10"
                                                onError={(e) => {
                                                    e.target.style.opacity = "0";
                                                }}
                                            />

                                            {/* Overlays (Z-index 20 to be above image) */}
                                            <div className="absolute top-6 right-6 z-20 flex gap-2">
                                                {post.userId === user._id && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(post);
                                                            }}
                                                            className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-blue-600 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                                                            title="Edit Post"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePost(post._id);
                                                            }}
                                                            className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                                                            title="Delete Post"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M3 6h18" />
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert("Link copied to clipboard!");
                                                    }}
                                                    className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                                                >
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-6 left-6 z-20">
                                                <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <MapPin size={14} className="text-red-400" />
                                                    {post.location}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Body */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                                                    {post.placeName}
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 leading-relaxed font-medium mb-6 line-clamp-3">
                                                {post.description}
                                            </p>

                                            {/* Copy Trip Action Button - Visible on card */}
                                            <button
                                                onClick={(e) => handleCopyTrip(e, post)}
                                                className="mt-auto mb-6 w-full py-3.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-100 hover:border-red-100 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 group/btn"
                                            >
                                                <Copy
                                                    size={18}
                                                    className="group-hover/btn:scale-110 transition-transform"
                                                />
                                                <span>Copy Trip to My Plans</span>
                                            </button>

                                            {/* Footer / User Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-600 font-black overflow-hidden shadow-inner border border-red-50">
                                                    {post.userImage ? (
                                                        <img
                                                            src={post.userImage}
                                                            alt={post.userName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg">
                                                            {post.userName?.charAt(0).toUpperCase() || "U"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">
                                                        {post.userName}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                                            {new Date(post.createdAt).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                )}

                {/* Detailed Post Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                            onClick={() => setSelectedPost(null)}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-4 md:top-6 right-4 md:right-6 z-30 p-2.5 md:p-3 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl text-gray-900 shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-100/50"
                            >
                                <X size={20} className="md:w-6 md:h-6" />
                            </button>

                            {/* Left Side: Image */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-hidden shrink-0">
                                <img
                                    src={
                                        selectedPost.imageUrl ||
                                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000"
                                    }
                                    alt={selectedPost.placeName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Right Side: Details */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-12">
                                <div className="space-y-8">
                                    {/* User and Date */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black overflow-hidden shadow-lg shadow-red-200">
                                                {selectedPost.userImage ? (
                                                    <img
                                                        src={selectedPost.userImage}
                                                        alt={selectedPost.userName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xl">
                                                        {selectedPost.userName?.charAt(0).toUpperCase() ||
                                                            "U"}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-lg leading-tight">
                                                    {selectedPost.userName}
                                                </p>
                                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                                        {new Date(
                                                            selectedPost.createdAt
                                                        ).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-5 py-2.5 bg-red-50 rounded-2xl text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                            <MapPin size={16} />
                                            {selectedPost.location}
                                        </div>
                                    </div>

                                    {/* Place and Description */}
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                                            {selectedPost.placeName}
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                            {selectedPost.description}
                                        </p>
                                    </div>

                                    {/* Tips Section */}
                                    {selectedPost.tips && (
                                        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-5">
                                            <div className="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-2">
                                                    Pro Travel Tip
                                                </h4>
                                                <p className="text-gray-600 font-medium leading-relaxed italic">
                                                    "{selectedPost.tips}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Section */}
                                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={(e) => handleCopyTrip(e, selectedPost)}
                                            disabled={isCopying}
                                            className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-wide text-xs flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-red-200 disabled:opacity-70 disabled:grayscale whitespace-nowrap"
                                        >
                                            {isCopying ? (
                                                <span className="animate-pulse">Copying trip...</span>
                                            ) : (
                                                <>
                                                    <Copy size={18} />
                                                    Copy Entire Trip
                                                </>
                                            )}
                                        </button>
                                        <button className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-400 rounded-2xl font-bold uppercase tracking-wide text-xs flex items-center justify-center gap-2.5 transition-all duration-300 whitespace-nowrap">
                                            <Share2 size={18} />
                                            Share Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CommunityPage;
