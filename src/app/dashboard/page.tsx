"use client";
import {useEffect} from "react";
import {redirect} from "next/navigation";
import Link from "next/link";
import Header from "../_components/Header";
import useUser from "../hooks/useUser";

const Dashboard = () => {
    const [user] = useUser();

    useEffect(() => {
        if (!user) return;
        if (user === "no user") redirect("/auth");
    }, [user]);
    return (
        <>
            <main className="bg-black min-h-screen h-full w-full relative  flex flex-col items-center justify-center font-Lexend">
                {/* Header of the Dashboard page */}
                <Header />

                <div className="w-full items-start justify-start flex flex-col min-h-screen">
                    <div className="w-full items-center justify-end flex px-4 sm:px-10 py-6 border-b border-white/5 z-40">
                        <Link href={"/add"} prefetch aria-label="Add new Website Button for Analytics">
                            <button className="button font-normal">+ Add Website</button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10 p-6 z-40">
                        {/* Map all the websites here */}
                        {/* {websites.map((website: String, index: Number) => {
                            return (
                                <>
                                    <Link href={`/w/${website.website_name}`} key={website.id}>
                                        <div className="border border-white/5 rounded-md py-12 px-6 text-white bg-black w-full cursor-pointer smooth hover:border-white/20 hover:bg-[#050505]">
                                            <h2>{website.website_name}</h2>
                                        </div>
                                    </Link>
                                </>
                            );
                        })} */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
