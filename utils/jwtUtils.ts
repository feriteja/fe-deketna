// utils/jwtUtils.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  [key: string]: any;
}

export function getUserRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
