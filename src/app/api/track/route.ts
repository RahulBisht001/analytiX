import { supabase } from "@/config/SUPABASE_CLIENT";
import { NextResponse } from "next/server";

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: any) {
	return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: Request) => {
	const res = await req.json();
	const { domain, url, event } = res;

	if (!url.include(domain)) {
		return NextResponse.json(
			{
				success: false,
				error:
					"The script points to a different domain than the current url. Make sure they match",
			},
			{ headers: corsHeaders }
		);
	}

	if (event === "session_start") {
		await supabase
			.from("visits")
			.insert([
				{
					website_id: domain,
					url,
				},
			])
			.select();
	}

	if (event === "pageview") {
		await supabase.from("page_views").insert([
			{
				domain,
				page: url,
			},
		]);
	}

	return NextResponse.json({ res }, { headers: corsHeaders });
};
