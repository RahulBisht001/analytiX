"use client";
import {ChangeEvent, useState, useEffect} from "react";
import {redirect, useRouter} from "next/navigation";
import useUser from "../../hooks/useUser";

import {supabase} from "@/config/SUPABASE_CLIENT";
import type {User} from "@supabase/supabase-js";

import SyntaxHighlighter from "react-syntax-highlighter";
import {irBlack} from "react-syntax-highlighter/dist/esm/styles/hljs";

import {ArrowRight, Copy, Check, ArrowLeft} from "lucide-react";

const AddPage = () => {
    const [step, setStep] = useState<number>(1);
    const [website, setWebsite] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [check, setCheck] = useState<boolean>(false);

    const [isCopied, setIsCopied] = useState<boolean>(false);

    const [user] = useUser();

    useEffect(() => {
        if (!user) return;
        if (user === "no user") redirect("/auth");
    }, [user]);

    const currentUser = user as User;
    const router = useRouter();

    const handleAddWebsite = async (): Promise<void> => {
        /** If after trimming the leading and trailing spaces
         *  we only get empty string that's mean user only added spaces
         * in the input field so we will throw an error for this.
         *
         * chutiya user.
         */
        if (website.trim() === "" || loading) {
            alert("abe chutiye");
            return;
        }
        setLoading(true);

        const {data, error} = await supabase
        .from("websites")
        .insert([{website_name: website.trim(), user_id: currentUser.id}])
        .select();
        setLoading(false);
        setError("");
        setStep(2);
    };

    const checkDomainAddedBefore = async (): Promise<void> => {
        const domain: string = website.trim().toLowerCase();
        const userId = currentUser.id;

        setCheck(true);

        const {data, error} = await supabase
        .from("websites")
        .select("id")
        .eq("website_name", domain)
        .eq("user_id", userId)
        .single();

        if (error) {
            console.log("Error checking domain:", error); // optional error handling
            setError(error.message);
        }

        setCheck(false);
        if (data == null) {
            setError("");
            handleAddWebsite();
        } else {
            setError("domain already added");
        }
    };

    const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setWebsite(e.target.value.trim().toLowerCase());
    };

    const handleCopy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(codeString);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000); // Reset the copied state after 3 seconds
        } catch (error: any) {
            console.error("Failed to copy!", error.message);
        }
    };

    useEffect(() => {
        const regex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;
        if (
            website.trim().includes("www.") ||
            website.trim().includes("http") ||
            website.trim().includes("http://") ||
            website.trim().includes("https://") ||
            website.trim().includes("://") ||
            website.trim().includes(":") ||
            website.trim().includes("/")
        ) {
            setError("please enter the domain only. ie:(google.com)");
        } else {
            setError("");
        }
    }, [website]);

    const codeString = `  
    
    <script defer data-domain="${website}"
        src="${process.env.NEXT_PUBLIC_WEBSITE_NAME}/tracking-script.js">
    </script>
    
    //  this is the WebTrack tracking script for your app.

`;

    return (
        <>
            <main className="font-Lexend bg-black">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-white/50 absolute top-5 left-4 flex gap-1 items-center group hover:text-white/90"
                >
                    <ArrowLeft
                        size={18}
                        className="transform transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    <span className="text-sm sm:text-base">dashboard</span>
                </button>

                <section className="w-full min-h-screen flex flex-col items-center justify-center">
                    {/* logo of the website */}
                    <h1 className="text-white/80 text-2xl sm:text-4xl tracking-wider">WebTrack</h1>

                    <div className="flex flex-col items-center justify-center p-12 w-full z-0 border-y border-white/5 bg-black text-white mt-10">
                        {step === 1 ? (
                            <>
                                <div className="w-full flex flex-col items-center justify-center space-y-10">
                                    <span className="w-full lg:w-[50%] group">
                                        <p className="text-white/40 pb-4 group-hover:text-white smooth">Domain Name</p>
                                        <input
                                            type="text"
                                            placeholder="enter the domain name"
                                            className="input"
                                            aria-label="Input field for domain name input"
                                            value={website}
                                            onChange={(e) => handleWebsiteChange(e)}
                                        />
                                        {error ? (
                                            <p className="text-xs text-red-500 pt-2 font-normal">{error}</p>
                                        ) : (
                                            <p className="text-xs text-white/20 pt-2 font-normal">
                                                enter the domain / subdomain without {"www / http"}
                                            </p>
                                        )}
                                    </span>
                                    {error === "" && (
                                        <button
                                            onClick={checkDomainAddedBefore}
                                            className={`button flex items-center gap-1${
                                                loading || check ? "cursor-not-allowed !bg-[#0c0c0c]" : ""
                                            }`}
                                            disabled={loading}
                                        >
                                            {loading || check ? (
                                                <>
                                                    <svg
                                                        className="w-5 h-5 mr-2 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    {loading ? <span>adding. . .</span> : <span>checking. . .</span>}
                                                </>
                                            ) : (
                                                <span>add website</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full items-center justify-center flex flex-col space-y-10">
                                    <span className="w-full lg:w-[50%] relative">
                                        <button
                                            onClick={handleCopy}
                                            className="button absolute top-2 right-2 bg-transparent text-white !p-2 rounded focus:outline-none"
                                            aria-label="Copy code to clipboard"
                                        >
                                            {isCopied ? <Check size={20} color="#1bee34" /> : <Copy size={20} />}
                                        </button>
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={irBlack}
                                            className="rounded-lg border border-white/10 !text-sm"
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>

                                        <p className="text-xs text-white/30 font-light pt-2">
                                            paste this snippet in the{" "}
                                            <strong className="text-red-600">{"<head>"}</strong> tag of the your app.
                                        </p>
                                    </span>

                                    <button
                                        onClick={() => router.push(`/w/${website.trim()}`)}
                                        className="button flex gap-2 items-center group"
                                    >
                                        <span>Check insights</span>
                                        <ArrowRight
                                            size={20}
                                            className="transform transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default AddPage;
