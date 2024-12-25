"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/register", {
        email,
        password,
      });

      const token = response.data?.data?.Token;
      if (token) {
        localStorage.setItem("access_token", token);
        router.replace("/");
      } else {
        throw new Error("Token not found in response.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#00aa5b]">Deketna</h1>
          <p className="text-gray-500">Create Your Account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-2 text-red-700">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border p-2 focus:border-[#00aa5b] focus:ring-[#00aa5b]"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-md border p-2 focus:border-[#00aa5b] focus:ring-[#00aa5b]"
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full rounded-md bg-[#00aa5b] py-2 text-white hover:bg-[#008a4b]"
        >
          Register
        </button>

        {/* Footer Links */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00aa5b] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
