"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { registerAction } from "@/actions/authAction";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form behavior

    // Client-Side Validation
    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await registerAction(formData);

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        router.push("/");
      } else {
        setError(result.error || "Login failed");
        toast({
          title: "Login Failed",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-[#00aa5b]">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#00aa5b] hover:bg-[#008a4b]"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?
            <Link href="/login" className="text-[#00aa5b] hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
