"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { compressImage, convertToWebP } from "@/utils/imageConverterWebp";
import { useRouter } from "next/navigation";

// ✅ Zod Schema for Validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
  stock: z.number().min(1, { message: "Stock must be greater than 0" }),
  category_id: z.number().min(1, { message: "Stock must be greater than 0" }),
  image: z.instanceof(File).optional(), // Ensure `File` is uploaded
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditProductForm({ data }: { data: ProductType }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(data.image_url);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Safely access localStorage on client-side
    const token = localStorage.getItem("access_token");
    setAccessToken(token);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    defaultValues: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
    },
    resolver: zodResolver(formSchema),
  });

  // ✅ Handle File Drop
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
      setValue("image", acceptedFiles[0]); // Update the form value
      setImage(URL.createObjectURL(acceptedFiles[0])); // Update the form value
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onSubmit = async (dataForm: FormSchema) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("name", dataForm.name);
      setValue("name", dataForm.name);
      formData.append("price", String(dataForm.price));
      setValue("price", dataForm.price);
      formData.append("stock", String(dataForm.stock));
      setValue("stock", dataForm.stock);
      formData.append("category_id", String(dataForm.category_id));
      setValue("category_id", dataForm.category_id);
      if (dataForm.image) {
        setValue("image", dataForm.image);
        const compressedFile = await compressImage(dataForm.image!);
        const webpImage = await convertToWebP(compressedFile);

        const imagename = dataForm.image.name.split(".")[0];

        const unixTimestamp = Math.floor(Date.now() / 1000); // Get Unix timestamp in seconds

        formData.append(
          "image",
          webpImage,
          `${unixTimestamp}-${imagename}.webp`
        );
      }

      await axios.put(
        `http://localhost:8080/admin/product/${data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccess("Product edited successfully!");
      reset(); // Clear the form
      setImageFile(null);
      router.replace("/admin/list-product");
    } catch (err: any) {
      console.error(err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            required
            id="name"
            placeholder="Product Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            required
            id="price"
            type="number"
            placeholder="Price"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="price">Cateogry</Label>
          <Input
            required
            id="category_id"
            type="number"
            placeholder="Category id"
            {...register("category_id", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            required
            id="stock"
            type="number"
            placeholder="Stock"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Product Image</Label>
          {image && <img src={image} alt="Preview" />}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {imageFile ? (
              <p className="text-green-500">{imageFile.name}</p>
            ) : isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Editing Product..." : "Edit Product"}
        </Button>
      </form>
    </div>
  );
}
