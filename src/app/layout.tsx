import type {Metadata} from "next";
import "./globals.css";

import {Lexend, Outfit} from "next/font/google";
import {UserAuthContextProvider} from "../context/UserContext";
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
            <body className={`${outfit.variable} ${lexend.variable} antialiased bg-black text-white`}>
                <UserAuthContextProvider>{children}</UserAuthContextProvider>
            </body>
        </html>
    );
}
