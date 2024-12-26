// components/HeaderClient.tsx
"use client";

import { logoutAction } from "@/actions/authaction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  token: string | null;
}

export default function HeaderClient({ token }: HeaderProps) {
  const [authToken, setAuthToken] = useState<string | null>(token);
  const router = useRouter();

  // Handle login/logout actions
  // Logout function to clear localStorage and cookies
  const logoutHandle = async () => {
    // Clear token from localStorage
    localStorage.removeItem("access_token");

    // Optionally, you can make an API call to the server to remove the cookie
    await logoutAction();

    // Update local state to reflect the logout
    setAuthToken(null);

    // Redirect the user to the login page after logout
    router.refresh();
  };
  // Effect to sync client-side state with localStorage (for session persistence)
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken && !authToken) {
      setAuthToken(savedToken);
    }
  }, [authToken]);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl">Deketna</div>

      <div className="flex space-x-4 items-center">
        {/* Search Bar */}
        <SearchBar />

        {/* Cart Button */}
        <CartButton />

        {/* Conditional Login/Logout Button */}
        {authToken ? (
          <button onClick={logoutHandle} className="bg-red-500 p-2 rounded-md">
            Logout
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-blue-500 p-2 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => (window.location.href = "/register")}
              className="bg-green-500 p-2 rounded-md"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// Search Bar Component
function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search products..."
      className="p-2 rounded"
    />
  );
}

// Cart Button Component
function CartButton() {
  return <button className="bg-yellow-500 p-2 rounded-md">Cart</button>;
}
