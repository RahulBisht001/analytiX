"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {supabase} from "@/config/SUPABASE_CLIENT";

// Define the interface for the website object
interface Website {
    id: string; // Assuming 'id' is a string, change to number if necessary
    created_at: string; // Change the type based on your database schema
    website_name: string;
    user_id: string; // Assuming user_id is also a string
}
interface WebsitesProps {
    currentUserId: string | null; // ID of the authenticated user
}

const Websites = ({currentUserId}: WebsitesProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [websites, setWebsites] = useState<Website[]>([]);

    useEffect(() => {
        fetchWebsitesOfUser();
    }, [currentUserId]);

    const fetchWebsitesOfUser = async () => {
        const {data, error} = await supabase
        .from("websites")
        .select()
        .eq("user_id", currentUserId)
        .order("created_at", {ascending: false})
        .range(0, 7); // Fetches records from index 0 to 7 (8 records)

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
        </>
    );
};

export default Websites;
