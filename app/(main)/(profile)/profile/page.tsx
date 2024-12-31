import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  if (!token) return redirect("/login");

  const response = await fetch("http://localhost:8080/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const data = await response.json();
  const profile: ProfileType = data.data;

  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Image
            src={profile.image_url || "/deketna-maskot.webp"}
            alt="Avatar"
            width={80}
            height={80}
            className=" rounded-full border"
          />
          <div>
            <p className="text-lg font-medium">{profile.name}</p>
            <p className="text-gray-600">{profile.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
