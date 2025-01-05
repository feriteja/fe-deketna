"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Add Product", path: "/admin/add-product" },
    { name: "List Product", path: "/admin/list-product" },
    { name: "List Order", path: "/admin/order" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block p-2 rounded-md hover:bg-gray-200 ${
                pathname === item.path ? "bg-gray-300" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
