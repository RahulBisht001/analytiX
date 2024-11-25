import {Lexend} from "next/font/google";
import Link from "next/link";

const lexend = Lexend({
    subsets: ["latin"],
    display: "swap", // Ensures fallback font is used initially for faster rendering
});

const Logo = () => (
    <Link href="/" className={`flex flex-row items-center justify-center font-bold ${lexend.className}`}>
        <h1 className="text-black text-2xl sm:text-3xl px-[3px] py-0 rounded-md bg-white/80 m-0">W</h1>
        <h1 className="text-white/80 text-2xl sm:text-3xl tracking-wider"> ebTrack</h1>
    </Link>
);

export default Logo;
