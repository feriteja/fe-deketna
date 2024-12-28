// components/HeaderClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Input } from "./ui/input";
import { logoutAction } from "@/actions/authAction";

interface HeaderProps {
  token: string | null;
}

export default function HeaderClient({ token }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-50 shadow-sm">
      <div className="text-xl  font-bold">Deketna</div>
      {/* Search Bar */}
      <SearchBar />
      <div className="flex space-x-4  items-center justify-center p-2  divide-x-2 ">
        <CartButton />

        <ConditionalAuthState token={token} />
      </div>
    </header>
  );
}

// Search Bar Component
function SearchBar() {
  return (
    <Input
      type="text"
      placeholder="Cari di Deketna"
      className=" w-1/3 border-[1px] focus-visible:ring-transparent focus-visible:border-green-500 border-slate-400"
    />
  );
}

// Cart Button Component
function CartButton() {
  return (
    <Link href={"/cart"}>
      <AiOutlineShoppingCart className="" size={24} />
    </Link>
  );
}

function ConditionalAuthState({ token }: { token: string | null }) {
  const [authToken, setAuthToken] = useState<string | null>(token);
  const router = useRouter();

  const logoutHandle = async () => {
    localStorage.removeItem("access_token");

    await logoutAction();

    setAuthToken(null);

    router.refresh();
  };
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken && !authToken) {
      setAuthToken(savedToken);
    }
  }, [authToken]);
  return (
    <>
      {authToken ? (
        <button onClick={logoutHandle} className="  p-2 rounded-md">
          Logout
        </button>
      ) : (
        <div className="space-x-2 p-1">
          <Link
            href={"/login"}
            className="bg-white p-2 rounded-md text-green-500 font-bold border-[1px] border-green-500"
          >
            Login
          </Link>
          <Link
            href={"/register"}
            className="bg-green-500 p-2 rounded-md text-white font-bold"
          >
            Register
          </Link>
        </div>
      )}
    </>
  );
}
