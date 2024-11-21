"use client";
import {redirect} from "next/navigation";
import Link from "next/link";
import Header from "../_components/Header";
import Websites from "./websites";
import {useAuth} from "../../hooks/useAuth";

const Dashboard = () => {
    const {user: currentUser, loading} = useAuth();

    if (loading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center z-40 text-white/90 font-Outfit text-xl xs:text-base tracking-wide">
                Loading . . . .
            </div>
        );
    }

    if (!currentUser) {
        redirect("/auth");
        return null; // Avoid rendering anything after redirection
    }
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
                    <Websites currentUserId={currentUser ? currentUser.id : null} />
                </div>
            </main>
        </>
    );
};

export default Dashboard;
