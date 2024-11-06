"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/config/SUPABASE_CLIENT";
import type { User } from "@supabase/supabase-js";

const useUser = (): [User | string] => {
	const [currentUser, setCurrentUser] = useState<User | string>("");

	const catchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		setCurrentUser(user ?? "no user");
	};

	useEffect(() => {
		if (!supabase) return;
		catchUser();
	}, [supabase]);

	return [currentUser];
};

export default useUser;
