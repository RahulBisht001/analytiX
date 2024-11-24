"use client";
import {createContext, useEffect, useState} from "react";
import {supabase} from "../config/SUPABASE_CLIENT";
import type {User} from "@supabase/supabase-js";

/**
 * This interface shows our Auth Context Props
 * either there will be a User or null
 * and while we will fetch the user there will
 * be a loading state
 */

interface UserAuthContextProps {
    user: User | null;
    loading: boolean;
}

export const UserAuthContext = createContext<UserAuthContextProps | undefined>(undefined);

export const UserAuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const {data, error} = await supabase.auth.getUser();

            if (error) {
                console.log("Error fetching user:", error.message);
                setUser(null);
            } else {
                setUser(data.user || null);
            }
            setLoading(false);
        };

        fetchUser();

        // listen to the Auth state change event such as logout
        const {data: listener} = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    return <UserAuthContext.Provider value={{user, loading}}>{children}</UserAuthContext.Provider>;
};
