import Link from "next/link";
import Header from "../_components/Header";
import React from "react";
const Websites = React.lazy(() => import("./websites"));

const Dashboard = () => {
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
                    {/* <Websites currentUserId={currentUser ? currentUser.id : null} /> */}

                    <Websites />
                </div>
            </main>
        </>
    );
};

export default Dashboard;
