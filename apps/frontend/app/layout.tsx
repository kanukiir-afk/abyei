import "../styles/globals.css";
import React from "react";
import Providers from "../components/Providers";

export const metadata = {
  title: "Abyei Students in Rwanda — Musanze",
  description: "Community website for Abyei Students in Rwanda in Musanze"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
