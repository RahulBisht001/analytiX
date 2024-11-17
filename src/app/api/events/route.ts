import { supabase } from "@/config/SUPABASE_CLIENT";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface RequestBody {
	name: string;
	domain: string;
	description: string;
}

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS(request: Request) {
	return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
	try {
		const authHeader = (await headers()).get("authorization");
		const { name, domain, description } = (await req.json()) as RequestBody;

		if (authHeader && authHeader.startsWith("Bearer ")) {
			const apiKey = authHeader.split(" ")[1];

			console.log("api_key is", apiKey);
			const { data, error } = await supabase
				.from("users")
				.select()
				.eq("api", apiKey);

			if (error) {
				console.log(error.code);
				console.log(error.cause);
				console.log(error.message);
			}

			if (data && data.length > 0) {
				if (name.trim() === "" || domain.trim() === "") {
					return NextResponse.json(
						{ error: "name or domain fields must not be empty." },
						{
							status: 400,
							headers: corsHeaders,
						}
					);
				} else {
					const { data: eventData, error: eventError } = await supabase
						.from("events")
						.insert({
							event_name: name.toLowerCase(),
							website_id: domain,
							message: description,
						});

					if (eventError) {
						return NextResponse.json(
							{ error: eventError.message },
							{
								status: 400,
								headers: corsHeaders,
							}
						);
					} else {
						return NextResponse.json(
							{ message: "Event created successfully." },
							{
								status: 201,
								headers: corsHeaders,
							}
						);
					}
				}
			} else {
				return NextResponse.json(
					{ error: "Unauthorized - Invalid API Key" },
					{
						status: 401,
						headers: corsHeaders,
					}
				);
			}
		}
	} catch (error: any) {
		console.log(error.message);
	}
}
