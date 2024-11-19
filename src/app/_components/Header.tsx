import Link from "next/link";
import Image from "next/image";
import {ArrowRightIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator} from "@radix-ui/react-dropdown-menu";
import useUser from "../../hooks/useUser";
import type {User} from "@supabase/supabase-js";
import {supabase} from "@/config/SUPABASE_CLIENT";
import {redirect, usePathname} from "next/navigation";

import appLogo from "../../../public/images/dataroc8.svg";

const Header = () => {
    const [user] = useUser();
    if (user === "no user") return <></>;
    // Assert that user is of type User
    const currentUser = user as User;

    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();

        redirect("/auth");
    };

    return (
        <>
            <div className="w-full border-b border-white/5 sticky top-0 bg-black z-50 flex items-center justify-between px-4 sm:px-10 py-4 font-Outfit">
                {/* logo of the website */}
                <h1 className="hidden sm:block text-white/80 text-2xl sm:text-3xl tracking-wider font-Lexend font-normal">
                    DataRoc8
                </h1>
                <Image src={appLogo} alt="DataRoc8 Logo" width={40} height={40} className="block lg:hidden" />

                <div className="flex space-x-2 tracking-wider">
                    {/* {pathname !== "/dashboard" && (
                        <div className="items-center flex space-x-4 font-light">
                            <Link
                                href={"/dashboard"}
                                prefetch
                                className="flex items-center justify-center space-x-2 group"
                            >
                                <button className="text-base text-white/60 group-hover:text-white smooth">
                                    Dashboard
                                </button>
                            </Link>
                        </div>
                    )} */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-white outline-none p-0 m-0 border-none font-Outfit font-light">
                            <div className="flex space-x-2 items-center justify-center hover:opacity-50">
                                <p className="text-base">{currentUser?.user_metadata?.full_name.split(" ")[0]}</p>
                                {currentUser && (
                                    <Image
                                        src={currentUser?.user_metadata?.avatar_url}
                                        alt="user"
                                        width={35}
                                        height={35}
                                        aria-label="Profile image of the user"
                                        className="rounded-full border-2 border-gray-500"
                                    />
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0a0a0a] border-white/5 outline-none text-white text-sm  font-Lexend font-light bg-opacity-20 backdrop-blur-md filter">
                            <DropdownMenuLabel className="text-white px-3 py-2 cursor-pointer">
                                Settings
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />

                            <Link href={"/settings"} prefetch>
                                <DropdownMenuItem className="hover:bg-white hover:text-black text-white/60 smooth cursor-pointer rounded-md px-3 py-2 outline-none">
                                    API
                                </DropdownMenuItem>
                            </Link>

                            <Link href={"/settings"} prefetch>
                                <DropdownMenuItem className="hover:bg-white hover:text-black text-white/60 smooth cursor-pointer rounded-md px-3 py-2 outline-none">
                                    Guide
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-white/5" />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="hover:bg-red-500 hover:text-white text-white/60 smooth cursor-pointer rounded-md px-3 py-2 outline-none"
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};

export default Header;
