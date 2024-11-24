"use client";
import { useEffect, useState } from "react";
import { supabase } from "../config/SUPABASE_CLIENT";
import type { User } from "@supabase/supabase-js";

//todo ---> check the chatgpt discussion about making Auth Context for global state management to optimize the performance

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
