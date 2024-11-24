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
                url: "https://res.cloudinary.com/dthrirmoj/image/upload/c_thumb,w_200,g_face/v1732476248/Screenshot_2024-11-25_005124_idy4tk.png", // Replace with your preview image URL
                width: 1200,
                height: 630,
                alt: "WebTrack Preview Image", // Alt text for the image
            },
        ],
        siteName: "WebTrack",
    },
    // Twitter Card Tags
    twitter: {
        card: "summary_large_image", // Use 'summary_large_image' for larger images
        title: "WebTrack - Website Analytics Tool",
        description:
            "Track your website's performance and insights with WebTrack. Get detailed analytics, user behavior reports, and traffic analysis in just a few clicks.",
        images: "https://res.cloudinary.com/dthrirmoj/image/upload/c_thumb,w_200,g_face/v1732476247/Screenshot_2024-11-25_005103_fgo36r.png", // Replace with your image URL
    },
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
