import { cookies } from "next/headers";
import EditProductForm from "./pageForm";

export default async function AddProductPage({ params }: { params: any }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies
  const { id } = await params;

  const response = await fetch(`http://localhost:8080/admin/product/${id}`, {
    method: "GET", // Explicitly specify the HTTP method
    cache: "no-store", // Ensure no caching
    headers: {
      "Content-Type": "application/json", // Ensure JSON format
      Authorization: `Bearer ${token}`, // Use an environment variable for the token
    },
  });

  const data = await response.json();

  return <EditProductForm data={data.data} />;
}
