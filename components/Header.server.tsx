// components/Header.server.tsx
import { cookies } from "next/headers";
import HeaderClient from "./Header.client";

export default async function HeaderServer() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  let profile;
  if (token) {
    const response = await fetch(`http://localhost:8080/profile`, {
      method: "GET", // Explicitly specify the HTTP method
      cache: "no-cache", // Ensure no caching
      headers: {
        "Content-Type": "application/json", // Ensure JSON format
        Authorization: `Bearer ${token}`, // Use an environment variable for the token
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    profile = await response.json();
  }

  return <HeaderClient token={token} profile={profile} />;
}
