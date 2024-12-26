import { setCookie, destroyCookie } from "nookies";

export async function POST(req: Request, res: Response) {
  console.log("caleda api");

  setCookie({ res }, "access_token", "", {
    maxAge: -1,
    path: "/", // Ensure the path matches the one the cookie was set to
    // domain: 'yourdomain.com', // Uncomment and specify if you are using a custom domain
  });

  return new Response("Logged out successfully");
}
