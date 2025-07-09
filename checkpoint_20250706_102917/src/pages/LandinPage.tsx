import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to TechPulse</h1>
      <p className="text-lg mb-6">
        Catch up with tech trends & learn new skills in 5-minute gamified
        sprints.
      </p>
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
      >
        Explore Trends
      </Link>
    </div>
  );
}
