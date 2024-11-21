"use client";
import {redirect} from "next/navigation";
import Link from "next/link";
import Header from "../_components/Header";
import useUser from "../../hooks/useUser";
import type {User} from "@supabase/supabase-js";
import Websites from "./websites";
import {useEffect} from "react";

const Dashboard = () => {
    const [user] = useUser();
    // Assert that user is of type User
    const currentUser = user as User;
    useEffect(() => {
        if (!user) return;
        if (user === "no user") redirect("/auth");
    }, [user]);

    return (
        <>
            <main className="bg-black min-h-screen h-full w-full relative  flex flex-col items-center justify-center font-Outfit font-light tracking-wide">
                {/* Header of the Dashboard page */}
                <Header />

                <div className="w-full items-start justify-start flex flex-col min-h-screen">
                    <div className="w-full items-center justify-end flex px-4 sm:px-10 py-6 border-b border-white/5 z-40">
                        <Link href={"/add"} prefetch aria-label="Add new Website Button for Analytics">
                            <button className="button">+ add website</button>
                        </Link>
                    </div>
                    <Websites currentUserId={currentUser.id} />
                </div>
            </main>
        </>
    );
};

export default Dashboard;
