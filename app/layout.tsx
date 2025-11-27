import type { Metadata } from "next";
import "./globals.css";

const siteTitle = "CapCut Utility V3";
const siteDescription =
  "Patch CapCut exports in one click. Auto-detects your install, closes CapCut safely, patches both watermark and root DLLs, and keeps backups so you can switch ON/OFF safely.";
const siteKeywords = [
  "CapCut",
  "CapCut Utility",
  "CapCut patcher",
  "CapCut watermark",
  "CapCut export",
  "CapCut DLL",
  "CapCut utility V3",
  "CapCut crack toggle",
];

export const metadata: Metadata = {
  metadataBase:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
      : undefined,
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "CapCut Utility",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 256,
        height: 256,
        alt: "CapCut Utility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "software",
  icons: {
    icon: [{ rel: "icon", url: "/icon.png", sizes: "any" }],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CapCut Utility",
  url:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "https://capcut-utility.example",
  description: siteDescription,
  keywords: siteKeywords.join(", "),
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        (typeof process !== "undefined" &&
        process.env.NEXT_PUBLIC_BASE_URL
          ? process.env.NEXT_PUBLIC_BASE_URL
          : "https://capcut-utility.example") + "/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="min-h-screen bg-[#0b0f1a] text-[#e8edf7] antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
