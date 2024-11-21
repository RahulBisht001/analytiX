import { useContext } from "react";
import { UserAuthContext } from "@/context/UserContext";

export const useAuth = () => {
	const context = useContext(UserAuthContext);

	if (!context) {
		throw new Error("useAuth must be used within a UserAuthProvider");
	}
	return context;
};
