// components/Header.server.tsx
import { cookies } from "next/headers";
import HeaderClient from "./Header.client";

export default async function HeaderServer() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  return <HeaderClient token={token} />;
}
