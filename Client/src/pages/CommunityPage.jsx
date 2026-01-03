import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const CommunityPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        placeName: "",
        location: "",
        description: "",
        imageUrl: "",
        tips: "",
    });
    const [submitting, setSubmitting] = useState(false);

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
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/community/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user._id,
                    userName: user.name || user.username,
                    userImage: user.profileImage,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Post shared successfully!");
                setFormData({
                    placeName: "",
                    location: "",
                    description: "",
                    imageUrl: "",
                    tips: "",
                });
                setShowForm(false);
                fetchCommunityPosts();
            } else {
                alert(data.message || "Failed to share post");
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Error sharing post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-2xl font-bold text-gray-900 hover:text-red-600 transition"
                        >
                            GlobeTrotter
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/my-trips")}
                                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
                            >
                                My Trips
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/profile")}
                                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                                Travel <span className="text-red-600">Stories</span>
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Discover inspiration from our global community of explorers
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 font-bold uppercase tracking-wider shadow-lg shadow-red-200 hover:scale-105 active:scale-95"
                        >
                            {showForm ? "Close Form" : "Share Your Story"}
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by destination, place or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-gray-700 cursor-pointer shadow-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSortBy("newest");
                                }}
                                className="px-6 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm uppercase"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Share Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                            Share Your Experience
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Place Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Place Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.placeName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, placeName: e.target.value })
                                    }
                                    placeholder="e.g., Eiffel Tower, Grand Canyon"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    placeholder="e.g., Paris, France"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Share your experience about this place..."
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Photo URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, imageUrl: e.target.value })
                                    }
                                    placeholder="Paste image link here"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                {formData.imageUrl && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Travel Tips
                                </label>
                                <textarea
                                    value={formData.tips}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tips: e.target.value })
                                    }
                                    placeholder="Share any helpful tips for other travelers..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-md"
                                >
                                    {submitting ? "Sharing..." : "Share Post"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    disabled={submitting}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                        Community Posts
                    </h2>
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="text-gray-600 font-semibold">
                                Loading posts...
                            </div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300 p-16 text-center">
                            <p className="text-gray-500 mb-4">No posts yet</p>
                            <p className="text-sm text-gray-400">
                                Be the first to share your travel experience!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300"
                                >
                                    {/* Image */}
                                    {post.imageUrl ? (
                                        <div className="h-56 overflow-hidden bg-gray-100">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.placeName}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.parentElement.innerHTML =
                                                        '<div class="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-gray-400 font-semibold">No Image</div>';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-56 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                            <span className="text-gray-400 font-semibold">
                                                No Image
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {post.placeName}
                                        </h3>
                                        <p className="text-sm text-red-600 font-semibold mb-3">
                                            📍 {post.location}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {post.description}
                                        </p>

                                        {post.tips && (
                                            <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-4">
                                                <p className="text-xs font-semibold text-red-800 mb-1 uppercase tracking-wide">
                                                    Travel Tip
                                                </p>
                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                    {post.tips}
                                                </p>
                                            </div>
                                        )}

                                        {/* User Info */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                                {post.userImage ? (
                                                    <img
                                                        src={post.userImage}
                                                        alt={post.userName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                            e.target.parentElement.innerHTML = `<span class="text-white font-semibold">${post.userName?.charAt(0)?.toUpperCase() || "U"
                                                                }</span>`;
                                                        }}
                                                    />
                                                ) : (
                                                    post.userName?.charAt(0)?.toUpperCase() || "U"
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {post.userName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CommunityPage;
