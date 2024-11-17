"use client";

import {useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import GoogleLogo from "../../../public/images/google.png";
import GithubLogo from "../../../public/images/github.png";

// import {createClient} from "../../utils/supabase/client";
// import type {User, SupabaseClient} from "@supabase/supabase-js";
import type {User} from "@supabase/supabase-js";
import {supabase} from "@/config/SUPABASE_CLIENT";

const Auth = () => {
    // const supabase: SupabaseClient = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            const {data}: {data: {user: User | null}} = await supabase.auth.getUser();
            if (data && data.user) {
                router.push("/"); // Use Next.js router to redirect
            }
        };
        fetchUser();
    }, [router, supabase]);

    const handleGoogleAuth = async (): Promise<void> => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };
    const handleGithubAuth = async (): Promise<void> => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <>
            <section className="bg-black text-white items-center justify-center flex gap-14 flex-col w-full min-h-screen font-Lexend">
                <header>
                    <h1 className="text-3xl">Howdy👋 from dataRoc8</h1>
                </header>

                <main>
                    <div className="flex gap-4">
                        <button
                            onClick={handleGoogleAuth}
                            className="button flex gap-3 items-center justify-center"
                            aria-label="Sign in with Google"
                        >
                            <Image src={GoogleLogo} alt="Google Logo" width={25} height={25} />
                            <span>Signin with Google</span>
                        </button>

                        <button
                            onClick={handleGithubAuth}
                            className="button flex gap-3 items-center justify-center"
                            aria-label="Sign in with Github"
                        >
                            <Image src={GithubLogo} alt="Github Logo" width={25} height={25} />
                            <span>Signin with Github</span>
                        </button>
                    </div>
                </main>
            </section>
        </>
    );
};

export default Auth;
