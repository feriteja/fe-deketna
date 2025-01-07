// components/HeaderClient.tsx
"use client";

import { logoutAction } from "@/actions/authAction";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRouter as useRouter2 } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import { useCart } from "@/hooks/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import SearchCard from "./SearchCard";
import { refreshSearch } from "@/actions/productAction";

interface HeaderProps {
  token: string | null;
  profile: any;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  seller_id: number;
  seller_name: string;
}

export default function HeaderClient({ token }: HeaderProps) {
  const { reloadCart } = useCart();
  useEffect(() => {
    reloadCart();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-slate-50 shadow-sm">
      <Link href={"/"}>
        <div className="text-2xl font-bold">Deketna</div>
      </Link>
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
  const [search, setSearch] = useState("");
  const [productPriview, setProductPriview] = useState<Product[]>([]);
  const debouncedSearch = useDebounce(search, 800); // 500ms debounce delay
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const cardClikHandler = (id: number) => {
    setSearch("");
    setProductPriview([]);
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    if (debouncedSearch) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Call your API with debouncedSearch
      fetch(
        `http://localhost:8080/products?search_product=${debouncedSearch}`,
        {
          signal: abortControllerRef.current.signal,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setProductPriview(data.data);
        })
        .catch((e) => {
          if (e.name === "AbortError") {
            console.error("Fetch aborted");
          } else {
            console.error("Error:", e);
          }
        });
    }
  }, [debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form behavior

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSearch("");
    setProductPriview([]);
    // refreshSearch();

    router.push(`/search?q=${search}`);
  };

  return (
    <div className="w-1/3 relative">
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus={false} // Explicitly disable autofocus
          type="text"
          value={search}
          placeholder="Cari di Deketna"
          onChange={(e) => setSearch(e.target.value)}
          className=" w-full border-[1px] focus-visible:ring-transparent focus-visible:border-green-500 border-slate-400"
        />
      </form>
      {productPriview.length > 0 && (
        <div className="absolute z-50 right-0 left-0 mt-1 shadow-md px-2 py-1 space-y-1 divide-y-2  bg-white">
          {productPriview &&
            productPriview
              ?.slice(0, 3)
              .map((product) => (
                <SearchCard
                  key={product.id}
                  onClick={() => cardClikHandler(product.id)}
                  product={product}
                />
              ))}
        </div>
      )}
    </div>
  );
}

// Cart Button Component
function CartButton() {
  const { cartItems } = useCart();

  return (
    <Link href={"/cart"} className="relative ">
      <div className="absolute -right-2 -top-2 bg-red-600 rounded-xl text-xs font-bold text-white bg-opacity-70 px-1">
        {cartItems.length > 0 && cartItems.length}
      </div>
      <AiOutlineShoppingCart className="" size={24} />
    </Link>
  );
}

function ConditionalAuthState({ token }: { token: string | null }) {
  const [authToken, setAuthToken] = useState<string | null>(token);
  const router = useRouter();
  const { clearItemsCart } = useCart();

  const logoutHandle = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cart");

    await logoutAction();
    clearItemsCart();
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
          <DropdownMenuUser logoutHandle={logoutHandle} />
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

export function DropdownMenuUser({
  logoutHandle,
}: {
  logoutHandle: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex py-1 px-2 outline-none">
          <div className="relative h-full w-10 ">
            <Image
              src={"/deketna-maskot.webp"}
              alt="profile image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <Link href={"/orders"}>
            <DropdownMenuItem className="cursor-pointer">
              Order
            </DropdownMenuItem>
          </Link>
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
