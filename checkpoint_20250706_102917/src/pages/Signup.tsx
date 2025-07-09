import React from "react";

export default function Signup() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
