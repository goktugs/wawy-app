import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "wavy-app",
  description: "Campaign matching engine"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
