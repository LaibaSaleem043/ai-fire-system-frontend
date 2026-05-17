"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { WebSocketHandler } from "./websocket-handler";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token && !isAuthPage) {
      router.push("/login");
    }
  }, [pathname, isAuthPage, router]);

  // Prevent hydration mismatch by not rendering layout-dependent parts until mounted
  if (!mounted) {
    return (
      <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="top-right" closeButton richColors />
      <WebSocketHandler />
      <div className="flex min-h-screen">
        {!isAuthPage && <Sidebar />}
        <main className={cn(
          "flex-1 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-slate-950 to-slate-950",
          !isAuthPage ? "ml-64 p-8" : "w-full"
        )}>
          {children}
        </main>
      </div>
    </>
  );
}
