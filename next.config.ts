import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: [
			"lh3.googleusercontent.com", // Google user images
			"avatars.githubusercontent.com", // GitHub user images
		],
	},
};

export default nextConfig;
