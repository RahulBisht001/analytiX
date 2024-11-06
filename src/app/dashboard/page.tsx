"use client";
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import Link from "next/link";
import Header from "../_components/Header";
import useUser from "../../hooks/useUser";
import {supabase} from "@/config/SUPABASE_CLIENT";
import type {User} from "@supabase/supabase-js";

// Define the interface for the website object
interface Website {
    id: string; // Assuming 'id' is a string, change to number if necessary
    created_at: string; // Change the type based on your database schema
    website_name: string;
    user_id: string; // Assuming user_id is also a string
}

const Dashboard = () => {
    const [user] = useUser();
    // Assert that user is of type User
    const currentUser = user as User;

    const [loading, setLoading] = useState<boolean>(true);
    const [websites, setWebsites] = useState<Website[]>([]);

    useEffect(() => {
        if (!user) return;
        if (user === "no user") redirect("/auth");

        fetchWebsitesOfUser();
    }, [user]);

    const fetchWebsitesOfUser = async () => {
        const {data, error} = await supabase
        .from("websites")
        .select()
        .eq("user_id", currentUser?.id)
        .order("created_at", {ascending: false});

        // alert(data);
        console.log(data);

        if (error) {
            console.error(error.message);
            alert("Some error occured!");
        }

        if (data) {
            setLoading(false);
            setWebsites(data);
        }
    };

    return (
        <>
            <main className="bg-black min-h-screen h-full w-full relative  flex flex-col items-center justify-center font-Lexend">
                {/* Header of the Dashboard page */}
                <Header />

                <div className="w-full items-start justify-start flex flex-col min-h-screen">
                    <div className="w-full items-center justify-end flex px-4 sm:px-10 py-6 border-b border-white/5 z-40">
                        <Link href={"/add"} prefetch aria-label="Add new Website Button for Analytics">
                            <button className="button !font-normal">+ Add Website</button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10 p-6 z-40">
                        {/* Map all the websites here */}
                        {loading ? (
                            <p className="text-white">Wait while we fetch the data</p>
                        ) : (
                            websites &&
                            websites.map((website: any, index: Number) => {
                                return (
                                    <Link href={`/w/${website?.website_name}`} key={website.id + "#"}>
                                        <div className="border border-white/5 rounded-md py-12 px-6 text-white bg-black w-full cursor-pointer smooth hover:border-white/20 hover:bg-[#050505]">
                                            <h2>{website?.website_name}</h2>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
