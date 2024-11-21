import type {Metadata} from "next";
import "./globals.css";

import {Lexend, Poppins, Outfit} from "next/font/google";
const lexend = Lexend({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-Lexend",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-Poppins",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-Outfit",
});

export const metadata: Metadata = {
    title: "WebTrack",
    description: "Get your website analytics in just few clicks",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${outfit.variable} ${poppins.variable} ${lexend.variable} antialiased bg-black text-white`}
            >
                {children}
            </body>
        </html>
    );
}
