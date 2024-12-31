// components/HeaderClient.tsx
"use client";

import { logoutAction } from "@/actions/authAction";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  token: string | null;
  profile: any;
}

export default function HeaderClient({ token, profile }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-50 shadow-sm">
      <Link href={"/"}>
        <div className="text-2xl font-bold">Deketna</div>
      </Link>
      {/* Search Bar */}
      <SearchBar />
      <div className="flex space-x-4  items-center justify-center p-2  divide-x-2 ">
        <CartButton />

        <ConditionalAuthState token={token} profile={profile} />
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

function ConditionalAuthState({
  token,
  profile,
}: {
  token: string | null;
  profile: any;
}) {
  const [authToken, setAuthToken] = useState<string | null>(token);
  const router = useRouter();

  const logoutHandle = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cart");

    await logoutAction();

    setAuthToken(null);

    router.replace("/");
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
        <>
          <DropdownMenuUser profile={profile} logoutHandle={logoutHandle} />
        </>
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

export function DropdownMenuUser({ profile, logoutHandle }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex py-1 px-2 outline-none">
          <div className="relative h-full w-10 ">
            <Image
              src={"/deketna-maskot.webp"}
              alt="profile image"
              fill
              className="object-cover"
            />
          </div>

          <h1>Hallo</h1>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/profile"}>
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">Order</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logoutHandle}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
