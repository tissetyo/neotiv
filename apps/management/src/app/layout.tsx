import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Neotiv Management Panel",
  description: "Administrative dashboard for the Neotiv hospitality platform",
};

import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Profile fetch (optional for root, but useful for Navbar)
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {user && <Navbar userEmail={user.email!} role={profile?.role || 'staff'} />}
        <div className={user ? "pt-16" : ""}>
          {children}
        </div>
      </body>
    </html>
  );
}
