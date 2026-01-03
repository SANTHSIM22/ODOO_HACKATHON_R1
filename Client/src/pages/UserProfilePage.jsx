import { Link } from "react-router-dom";
// If Navbar doesn't exist or isn't suitable, I'll create a simple one or omit it for now based on the file list I saw earlier (Navbar.jsx wasn't in the list in step 8, wait, I queried components in step 6 and it said 3 children, step 8 list_dir only showed subdirs/files count, let me check step 14 I tried to view Navbar.jsx and it failed).
// Okay, LandingPage has a header. I will duplicate the header for now or create a simpler one.
// Let's create a standalone page first.

const UserProfilePage = () => {
    // Mock data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        image: "https://via.placeholder.com/150",
    };

    const preplannedTrips = [
        { id: 1, title: "Paris Adventure", image: "https://via.placeholder.com/300x200" },
        { id: 2, title: "Tokyo Explore", image: "https://via.placeholder.com/300x200" },
        { id: 3, title: "NYC Getaway", image: "https://via.placeholder.com/300x200" },
    ];

    const previousTrips = [
        { id: 4, title: "London Trip", image: "https://via.placeholder.com/300x200" },
        { id: 5, title: "Berlin Tour", image: "https://via.placeholder.com/300x200" },
        { id: 6, title: "Rome Holiday", image: "https://via.placeholder.com/300x200" },
    ];

    return (
        <div className="min-h-screen bg-brand-pale font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-brand-light">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-brand-dark hover:text-brand-medium transition">
                        GlobalTrotter
                    </Link>
                    <div className="space-x-4">
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-brand-medium hover:text-brand-dark font-medium transition"
                        >
                            Dashboard
                        </Link>
                        <button className="px-4 py-2 text-brand-medium hover:text-brand-dark font-medium transition">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full px-4 sm:px-6 lg:px-8 py-10">

                {/* User Info Section */}
                <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-brand-light flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="flex-shrink-0">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-brand-medium shadow-md">
                            <img src={user.image} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="flex-grow w-full md:w-auto">
                        <div className="border border-brand-light rounded-xl p-6 relative bg-white h-full min-h-[192px] flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-brand-dark mb-2">{user.name}</h2>
                            <p className="text-gray-600 mb-1"><span className="font-semibold">Email:</span> {user.email}</p>
                            <p className="text-gray-600 mb-4"><span className="font-semibold">Phone:</span> {user.phone}</p>

                            <button className="absolute top-4 right-4 text-sm bg-brand-pale text-brand-dark px-3 py-1 rounded-full hover:bg-brand-light transition font-medium">
                                Edit
                            </button>
                        </div>
                    </div>
                </section>

                {/* Preplanned Trips */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand-medium inline-block pb-1">Preplanned Trips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {preplannedTrips.map(trip => (
                            <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-brand-light flex flex-col">
                                <div className="h-48 overflow-hidden">
                                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover transition transform hover:scale-105" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">{trip.title}</h4>
                                    <div className="mt-auto">
                                        <button className="w-full py-2 bg-white border border-brand-dark text-brand-dark rounded-lg hover:bg-brand-dark hover:text-white transition font-medium">
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Previous Trips */}
                <section>
                    <h3 className="text-2xl font-bold text-brand-dark mb-6 border-b-2 border-brand-medium inline-block pb-1">Previous Trips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {previousTrips.map(trip => (
                            <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-brand-light flex flex-col">
                                <div className="h-48 overflow-hidden">
                                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover transition transform hover:scale-105" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">{trip.title}</h4>
                                    <div className="mt-auto">
                                        <button className="w-full py-2 bg-white border border-brand-dark text-brand-dark rounded-lg hover:bg-brand-dark hover:text-white transition font-medium">
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default UserProfilePage;
