"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {supabase} from "@/config/SUPABASE_CLIENT";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {Trash} from "lucide-react";

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
    const [page, setPage] = useState<number>(1);
    const pageSize = 8;

    useEffect(() => {
        fetchWebsitesOfUser();
    }, [currentUserId, page]);

    const fetchWebsitesOfUser = async () => {
        console.log("Hii");
        const {data, error} = await supabase
        .from("websites")
        .select()
        .eq("user_id", currentUserId)
        .order("created_at", {ascending: false})
        .range((page - 1) * pageSize, page * pageSize - 1); // Fetches records from index 0 to 7 (8 records)

        if (error) {
            console.error(error.message);
            alert("Some error occured!");
        }

        if (data) {
            setLoading(false);
            setWebsites(data);
        }
    };

    const deleteWebsite = async (websiteId: string) => {
        // Confirm before deletion
        const confirmation = confirm("Are you sure you want to delete this website?");
        if (!confirmation) return;

        const {error} = await supabase
        .from("websites") // The table you're working with
        .delete()
        .eq("id", websiteId); // Condition to delete the website with the given id

        if (error) {
            console.error("Error deleting website:", error.message);
            alert("There was an error deleting the website.");
        } else {
            alert("Website deleted successfully!");

            fetchWebsitesOfUser();
            // Optionally, trigger a re-fetch of websites or update the UI state
        }
    };

    function formatTimeStamps(date: string) {
        // Step 1: create new Date
        const timestamp = new Date(date);

        // Step 2: Format the Date object into a human-readable format
        const formattedTimeStamp = timestamp.toLocaleString();
        return formattedTimeStamp;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10 p-6 z-40">
                {/* Map all the websites here */}
                {loading ? (
                    <p className="text-white text-center">Wait while we fetch the data</p>
                ) : (
                    websites &&
                    websites.map((website: any, index: Number) => {
                        return (
                            <Link href={`/w/${website?.website_name}`} key={website.id + "#"}>
                                <div className="relative border border-white/10 rounded-md py-12 px-6 text-white bg-black w-full cursor-pointer smooth hover:border-white/20 hover:bg-[#050505]">
                                    <h2>{website?.website_name}</h2>
                                    <h4 className="absolute bottom-2 right-2 text-[10px] italic font-light text-white/40">
                                        {formatTimeStamps(website?.created_at)}
                                    </h4>
                                    {/* Delete Button */}
                                    <button
                                        className="absolute top-2 right-2 text-white/40 hover:text-red-500 text-sm"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent the link navigation
                                            deleteWebsite(website.id);
                                            // Call the delete function
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) setPage(page - 1); // Go to previous page
                            }}
                        />
                    </PaginationItem>

                    {/* Page Number Links (Dynamic page numbers) */}
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(1); // Jump to first page
                            }}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (websites.length === pageSize) {
                                    setPage(page + 1); // Go to next page
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
};

export default Websites;
