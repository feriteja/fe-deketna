import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  image_url: string;
  name: string;
  stock: number;
  price: number;
  category: {
    name: string;
  };
  seller: {
    name: string;
  };
}

interface ProductListPageProps {
  searchParams: Promise<{ page?: string }>;
  params: any;
}

export default async function ProductListPage({
  searchParams,
  params,
}: ProductListPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = 25;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  const response = await fetch(
    `http://localhost:8080/admin/products?page=${currentPage}&limit=${limit}`,
    {
      method: "GET", // Explicitly specify the HTTP method
      cache: "no-store", // Ensure no caching
      headers: {
        "Content-Type": "application/json", // Ensure JSON format
        Authorization: `Bearer ${token}`, // Use an environment variable for the token
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();

  const products: Product[] = data.data || [];
  const totalPages: number = data.pagination.totalPages || 1;

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Seller Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>
                <Image
                  src={product.image_url}
                  height={40}
                  width={40}
                  alt={product.name}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>{product.seller.name}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  <Link href={`/admin/edit-product/${product.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          {currentPage !== 1 && (
            <>
              <PaginationItem aria-disabled>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`?page=${currentPage - 1}`}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationLink
              href={`?page=${currentPage}`}
              isActive
              className="font-bold text-lg"
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink href={`?page=${currentPage + 1}`}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis className="h-2" />
              </PaginationItem>
            </>
          )}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink href={`?page=${totalPages}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={`?page=${currentPage + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
