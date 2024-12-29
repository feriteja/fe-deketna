"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { compressImage, convertToWebP } from "@/utils/imageConverterWebp";

// ✅ Zod Schema for Validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
  stock: z.number().min(1, { message: "Stock must be greater than 0" }),
  image: z.instanceof(File).optional(), // Ensure `File` is uploaded
});

type FormSchema = z.infer<typeof formSchema>;

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const accessToken = localStorage.getItem("access_token");
  const [image, setImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  // ✅ Handle File Drop
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
      setValue("image", acceptedFiles[0]); // Update the form value
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // ✅ Submit Handler
  const onSubmit = async (data: FormSchema) => {
    try {
      if (!data.image) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      const compressedFile = await compressImage(data.image!);
      const webpImage = await convertToWebP(compressedFile);

      const imagename = data.image.name.split(".")[0];
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("image", webpImage, `${imagename}.webp`); // Attach file

      await axios.post("http://localhost:8080/admin/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSuccess("Product added successfully!");
      reset(); // Clear the form
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
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
          {/* {imageFile && <img src={imageFile.} alt="Preview" />} */}
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
          {loading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
