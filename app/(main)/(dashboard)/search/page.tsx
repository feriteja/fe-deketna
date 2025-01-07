// app/dashboard/page.tsx

import { fetchProducts } from "@/actions/productAction";
import ClientDashboard from "../pageClientSide";

// ✅ Server-Side Function to Fetch Initial Data
async function getInitialProducts(keyword: string) {
  try {
    const initialData = await fetchProducts(1, keyword);
    return initialData;
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
    return { data: [], pagination: { page: 1, totalPages: 1, isNext: false } };
  }
}

// ✅ Main Dashboard Component
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const { q } = await searchParams;

  const initialData = await getInitialProducts(q);

  return <ClientDashboard initialData={initialData} keyword={q} />;
}
