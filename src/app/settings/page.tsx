"use client";
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import {supabase} from "../../config/SUPABASE_CLIENT";
import Header from "../_components/Header";
import Loader from "../_components/Loader";
import {Check, Copy} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {sunburst} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {useAuth} from "../../hooks/useAuth";

const SettingsPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [APIKey, setAPIKey] = useState<string | null>();
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const {user: currentUser, loading: userLoading} = useAuth();

    useEffect(() => {
        if (userLoading) return;

        // Fetch the API Key when currentUser is available
        getUserAPIKey();
    }, [userLoading]);

    if (userLoading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center z-40 text-white/90 font-Outfit text-xl xs:text-base tracking-wide">
                Loading Settings . . . .
            </div>
        );
    }

    if (userLoading === false && !currentUser) {
        redirect("/auth"); // Perform redirect if the user is not logged in
        return null; // Return null to stop further rendering
    }

    const getUserAPIKey = async () => {
        setLoading(true);
        const {data, error} = await supabase.from("users").select().eq("user_id", currentUser?.id);

        if (error) {
            console.log(error.code);
            console.log(error.cause);
            console.log(error.message);
        }

        if (data && data.length > 0) {
            setAPIKey(data[0].api);
        }
        setLoading(false);
    };

    const handleGenerateAPIKey = async () => {
        if (loading || !currentUser) {
            return;
        }

        setLoading(true);
        const randomString =
            Math.random().toString(36).substring(2, 300) + Math.random().toString(36).substring(2, 300);

        const {data: apiData, error: apiError} = await supabase
        .from("users")
        .insert([{api: randomString, user_id: currentUser.id}]);

        if (apiError) {
            console.log(apiError.code);
            console.log(apiError.cause);
            console.log(apiError.message);
        }
        setAPIKey(randomString);
        setLoading(false);
    };

    const handleCopyAPIKey = async (): Promise<void> => {
        try {
            if (APIKey) {
                await navigator.clipboard.writeText(APIKey);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 3000); // Reset the copied state after 3 seconds
            }
        } catch (error: any) {
            console.error("Failed to copy!", error.message);
        }
    };

    if (!currentUser) {
        <div>
            <div className="w-full min-h-screen flex flex-col items-center justify-center z-40 text-white/90 font-Outfit text-xl xs:text-base tracking-wide">
                Redirecting . . . .
            </div>
        </div>;
    }

    return loading ? (
        <div className="min-h-screen flex justify-center items-center text-white/90">
            <Loader />
        </div>
    ) : (
        <>
            <main className="bg-black text-white/90 min-h-screen w-full flex flex-grow flex-col items-center justify-center font-Outfit">
                <Header />
                <div className="w-full relative flex flex-grow justify-center items-center">
                    {!APIKey && !loading && (
                        <div className="flex flex-col items-center justify-center gap-5 !font-light">
                            <p className="tracking-wide animate-pulse">
                                You don't have API key, so please generate it first !
                            </p>
                            <button className="button !text-white/90" onClick={handleGenerateAPIKey}>
                                Generate API Key
                            </button>
                        </div>
                    )}

                    {APIKey && (
                        <div className="mt-12 border border-white/5 bg-black space-y-12 py-12 w-full lg:w-2/3 md:w-3/4">
                            <div className="space-y-4 px-6">
                                <div className="flex justify-between items-center">
                                    <p>Your API Key is : </p>
                                    <button
                                        onClick={handleCopyAPIKey}
                                        className="button bg-transparent text-white !p-2 rounded focus:outline-none"
                                        aria-label="Copy API key to clipboard"
                                    >
                                        {isCopied ? <Check size={15} color="#1bee34" /> : <Copy size={15} />}
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    disabled
                                    readOnly
                                    name="api_key"
                                    value={APIKey}
                                    className="input-disabled"
                                />
                            </div>

                            <div className="space-y-4 border-t border-white/5 p-6 bg-black">
                                <h1 className="text-white/90">How to create custom events using api?</h1>
                                <div>
                                    <CodeComponent />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default SettingsPage;

const CodeComponent = () => {
    const codeString = `
    const url = "https://webtrack.vercel.app/api/events";
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer {{apiKey}}",
    };

    const eventData = {
        name: "", // *required
        domain: "", // *required
        description: "", // optional
    };

    const sendRequest = async () => {
        axios
        .post(url, eventData, { headers })
        .then()
        .catch((error) => {
            console.error("Error:", error);
        });
    };
`;

    const [isEventCodeCopied, setEventCodeCopied] = useState<boolean>(false);

    const handleEventCodeCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeString);
            setEventCodeCopied(true);
            setTimeout(() => setEventCodeCopied(false), 3000);
            // Reset the copied state after 3 seconds
        } catch (error: any) {
            console.error("Failed to copy!", error.message);
        }
    };
    return (
        <>
            <div className="relative">
                <button
                    onClick={handleEventCodeCopy}
                    className="button absolute top-2 right-2 bg-transparent text-white !p-2 rounded focus:outline-none"
                    aria-label="Copy custom event code to clipboard"
                >
                    {isEventCodeCopied ? <Check size={15} color="#1bee34" /> : <Copy size={15} />}
                </button>
                <SyntaxHighlighter
                    language="javascript"
                    style={sunburst}
                    className="rounded-lg border border-white/10 !text-sm"
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
