import type {Metadata} from "next";
import "./globals.css";

import {Lexend, Outfit} from "next/font/google";
import {UserAuthContextProvider} from "../context/UserContext";
import Image from "next/image";
const lexend = Lexend({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-Lexend",
});
const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-Outfit",
});

export const metadata: Metadata = {
    title: "WebTrack - Website Analytics Tool",
    description:
        "Track your website's performance and insights with WebTrack. Get detailed analytics, user behavior reports, and traffic analysis in just a few clicks.",
    keywords: [
        "website analytics",
        "free website analytics tool",
        "free analytics dashboard for developers",
        "easy-to-use web analytics",
        "website traffic analysis",
        "analytics dashboard",

        "user behavior tracking",
        "simple website tracker",
        "website performance analyzer",
        "site performance monitoring",
    ],
    // Open Graph (OG) Tags
    openGraph: {
        title: "WebTrack - Website Analytics Tool",
        description:
            "Track your website's performance and insights with WebTrack. Get detailed analytics, user behavior reports, and traffic analysis in just a few clicks.",
        url: "https://webtrack.vercel.app", // Replace with your actual URL
        images: [
            {
                url: "https://res.cloudinary.com/dthrirmoj/image/upload/v1732532368/WebTrack_jxeh3o.svg",
                width: 1200,
                height: 630,
                alt: "WebTrack Preview Image",
            },
        ],
        siteName: "WebTrack",
    },
    // Twitter Card Tags
    twitter: {
        card: "summary_large_image",
        title: "WebTrack - Website Analytics Tool",
        description:
            "Track your website's performance and insights with WebTrack. Get detailed analytics, user behavior reports, and traffic analysis in just a few clicks.",
        images: ["https://res.cloudinary.com/dthrirmoj/image/upload/v1732532384/Group_1_ifzcbd.svg"],
        creator: "@Twts_RahulB",
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    themeColor: "#1E293B",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "https://webtrack.vercel.app",
    },
    viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} ${lexend.variable} antialiased bg-black text-white`}>
                <UserAuthContextProvider>{children}</UserAuthContextProvider>
            </body>
        </html>
    );
}
