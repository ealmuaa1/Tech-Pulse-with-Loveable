import React from "react";

const mockTrends = [
  {
    id: 1,
    title: "Edge AI",
    summary: "AI running on local devices instead of the cloud.",
    image: "https://via.placeholder.com/300",
    category: "AI/ML",
  },
  {
    id: 2,
    title: "WebAssembly",
    summary: "Run code at near-native speed in web browsers.",
    image: "https://via.placeholder.com/300",
    category: "Frontend",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Tech Trends</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {mockTrends.map((trend) => (
          <div
            key={trend.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={trend.image}
              alt={trend.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-4">{trend.title}</h3>
            <p className="text-gray-600">{trend.summary}</p>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 mt-2 inline-block rounded">
              {trend.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
