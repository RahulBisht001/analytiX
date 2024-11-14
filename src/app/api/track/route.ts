import { supabase } from "@/config/SUPABASE_CLIENT";
import { NextResponse } from "next/server";

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: Request) {
	return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: Request) => {
	const res = await req.json();
	const { domain, url, event } = res;

	console.log(domain, url, event);

	if (!url.includes(domain)) {
		return NextResponse.json(
			{
				success: false,
				error:
					"The script points to a different domain than the current url. Make sure they match",
			},
			{ headers: corsHeaders }
		);
	}

	console.log("Event", event === "session_start");
	if (event === "session_start") {
		await supabase.from("visits").insert([
			{
				website_id: domain,
			},
		]);
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
