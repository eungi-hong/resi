import type { Metadata } from "next";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { DemoRoleSwitcher } from "@/components/DemoRoleSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "resi",
  description: "Youth health literacy AI associate for Singapore"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="container topbar-inner">
              <Link className="brand" href="/" aria-label="resi home">
                <span className="brand-mark"><HeartPulse size={19} /></span>
                <span>resi</span>
              </Link>
              <nav className="nav" aria-label="Main navigation">
                <Link href="/youth">Youth</Link>
                <Link href="/parent">Parent</Link>
                <Link href="/admin">Admin</Link>
                <Link href="/demo/personalization">Demo</Link>
                <Link href="/login">Login</Link>
              </nav>
              <DemoRoleSwitcher />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
