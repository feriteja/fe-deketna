"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await axios.post("http://localhost:8080/signin", {
      email,
      password,
    });

    const token = response?.data?.data?.Token;
    if (token) {
      (await cookies()).set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      return { success: true };
    } else {
      return { success: false, error: response.data.message || "Login failed" };
    }
  } catch (error: any) {
    console.error("Login error:", error.response.data.error.message);
    return {
      success: false,
      error: error.response.data.error.message || "Login failed",
    };
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await axios.post("http://localhost:8080/register", {
      email,
      password,
    });

    const token = response?.data?.data?.Token;
    if (token) {
      (await cookies()).set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.message || "Register failed",
      };
    }
  } catch (error: any) {
    console.error("Register error:", error.response.data.error.message);
    return {
      success: false,
      error: error.response.data.error.message || "Register failed",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  return { success: true };
}
