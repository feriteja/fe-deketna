// app/(main)/layout.tsx

import { ReactNode } from "react";
import HeaderServer from "@/components/Header.server";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="main-layout">
      <HeaderServer />
      <div className="main-content">{children}</div>
    </div>
  );
}
