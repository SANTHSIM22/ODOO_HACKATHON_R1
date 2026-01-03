import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            🌍 GlobeTrotter
          </h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Personalized
            <span className="block text-indigo-600">Travel Planning</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform the way you plan and experience travel with an
            intelligent, collaborative platform designed to make every journey
            unforgettable.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </Link>
        </div>


        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Overall Vision
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              The overarching vision for{" "}
              <span className="font-semibold text-indigo-600">
                GlobeTrotter
              </span>{" "}
              is to become a personalized, intelligent, and collaborative
              platform that transforms the way individuals plan and experience
              travel. The platform aims to empower users to dream, design, and
              organize trips with ease by offering an end-to-end travel planning
              tool that combines flexibility and interactivity.
            </p>
            <p>
              It envisions a world where users can explore global destinations,
              visualize their journeys through structured itineraries, make
              cost-effective decisions, and share their travel plans within a
              community—making travel planning as exciting as the trip itself.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">✈️</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Dream & Design
            </h4>
            <p className="text-gray-600">
              Explore destinations and create personalized itineraries that
              match your travel dreams.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🗺️</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Visualize Journeys
            </h4>
            <p className="text-gray-600">
              See your entire trip come to life with structured, interactive
              travel plans.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Cost-Effective
            </h4>
            <p className="text-gray-600">
              Make smart decisions with budget tracking and cost optimization
              tools.
            </p>
          </div>
        </div>


        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of travelers who are already planning their dream
            trips
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </main>


      <footer className="bg-white mt-20 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>
            &copy; 2026 GlobeTrotter. Making travel planning as exciting as the
            trip itself.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
