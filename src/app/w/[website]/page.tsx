"use client";
import {useEffect, useState} from "react";
import {redirect, useParams} from "next/navigation";
import Header from "@/app/_components/Header";
import useUser from "@/hooks/useUser";
import type {User} from "@supabase/supabase-js";
import {supabase} from "@/config/SUPABASE_CLIENT";
import Loader from "@/app/_components/Loader";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

interface PageView_Type {
    id: number;
    created_at: string;
    domain: string | null;
    page: string | null;
}

interface Visit_Type {
    id: number;
    created_at: string;
    website_id: string | null;
    source: string | null;
}

interface CustomEvent_Type {
    id: number;
    created_at: string;
    event_name: string | null;
    website_id: string | null;
    message: string | null;
}

interface GroupPage_Type {
    page: string;
    visits: number;
}

interface GroupSource_Type {
    source: string;
    visits: number;
}
interface GroupedCustomEvent_Type {
    event_name: string;
    count: number;
}

const WebsitePage = () => {
    const [user] = useUser();
    const currentUser = user as User;

    const {website} = useParams();

    const [loading, setLoading] = useState<boolean>(true);

    const [pageViews, setPageViews] = useState<PageView_Type[]>([]);
    const [groupedPageViews, setGroupedPageViews] = useState<GroupPage_Type[]>([]);

    const [totalVisits, setTotalVisits] = useState<Visit_Type[]>([]);
    const [groupedPageSources, setGroupedPageSources] = useState<GroupSource_Type[]>([]);

    const [customEvents, setCustomEvents] = useState<CustomEvent_Type[]>([]);
    const [groupedCustomEvents, setGroupedCustomEvents] = useState<GroupedCustomEvent_Type[]>([]);
    const [activeCustomEventTab, setActiveCustomEventTab] = useState<string>("");

    useEffect(() => {
        if (!currentUser) return;

        if (currentUser.role != "authenticated") redirect("/auth");

        const checkWebsiteForCurrentUser = async (): Promise<void> => {
            const {data, error} = await supabase
            .from("websites")
            .select()
            .eq("website_name", website)
            .eq("user_id", currentUser.id);

            if (error) {
                console.log(error.message);
                redirect("/dashboard");
            }

            if (!data || data.length === 0) {
                redirect("/dashboard");
            }

            setTimeout(() => {
                fetchWebsiteAnalytics();
            }, 500);
        };

        checkWebsiteForCurrentUser();
    }, [currentUser]);

    const fetchWebsiteAnalytics = async () => {
        setLoading(true);

        try {
            const [viewsResponse, visitsResponse, customEventResponse] = await Promise.all([
                supabase.from("page_views").select().eq("domain", website),
                supabase.from("visits").select().eq("website_id", website),
                supabase.from("events").select().eq("website_id", website),
            ]);

            const views = viewsResponse.data;
            const visits = visitsResponse.data;
            const customEventsData = customEventResponse.data;

            setPageViews(views ?? []);
            setGroupedPageViews(groupPageViews_func(views ?? []));
            setTotalVisits(visits ?? []);
            setGroupedPageSources(groupPageSources_func(visits ?? []));
            setCustomEvents(customEventsData ?? []);
            // grouping the customEvent by name
            // setGroupedCustomEvents(
            //     customEventsData?.reduce((acc, event) => {
            //         acc[event.event_name] = (acc[event.event_name] || 0) + 1;
            //         return acc;
            //     }, {})
            // );
            // Group the custom events by event_name and count the occurrences
            const groupedEvents = customEventsData?.reduce((acc: GroupedCustomEvent_Type[], event) => {
                if (event.event_name) {
                    // Check if the event_name already exists in the accumulator
                    const existingEvent = acc.find((e) => e.event_name === event.event_name);
                    if (existingEvent) {
                        existingEvent.count += 1;
                    } else {
                        acc.push({event_name: event.event_name, count: 1});
                    }
                }
                return acc;
            }, []); // Start with an empty array
            setGroupedCustomEvents(groupedEvents ?? []);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    function groupPageViews_func(pageViews: PageView_Type[]): GroupPage_Type[] {
        const groupedPageViews: {[key: string]: number} = {};

        pageViews.forEach(({page}) => {
            /**
             * * Note ---
             * Extract the path from the page URL by removing the protocol
             * and hostname using a regular expression, Here we are using path
             * as key for groupedPageViews Object which are dynamic
             */

            const path = page && page.replace(/^(?:\/\/|[^/]+)*\//, "");

            /**
             * * Note ---
             * now here in the below line we are actually creating a dynamic key
             * in the object if it doesn't exist and incrementing the value by 1
             * if it exists and if it doesn't exist it will create a new key
             * and set the value to 1
             */
            if (path != null) {
                groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
            }
        });

        /**
         * * Note ---
         *
         * Why we are doing this --> object to Array conversion
         * Although it is not required always but in our case its our need as we want
         * to apply filtering options on it & js has built in methods like map, filter etc
         * which makes it extremely easy to work with array.
         */

        const res: GroupPage_Type[] = Object.keys(groupedPageViews).map((path) => ({
            page: path,
            visits: groupedPageViews[path],
        }));

        console.log("groupedPageViews", res);
        return res;
    }

    function groupPageSources_func(visits: Visit_Type[]): GroupSource_Type[] {
        const groupedPageSources: {[key: string]: number} = {};

        visits.forEach(({source}) => {
            if (source) {
                groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
            }
        });

        const res: GroupSource_Type[] = Object.keys(groupedPageSources).map((source) => ({
            source: source,
            visits: groupedPageSources[source],
        }));

        return res;
    }

    /**
     * This abbreviateNumber function will handle the numbers in more flexible and
     * readable way for example if the number is greater than 1000 then it will
     * convert it to 1K, 1M, 1B etc.
     *
     * it will help us in making the ui cleaner otherwise due to large number it may
     * break the UI
     */

    function abbreviateNumber(num: number) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + " M";
        } else if (num >= 1000) {
            return (num / 1000000).toFixed(1) + " K";
        }
        return num.toString();
    }

    function formatTimeStamps(date: string) {
        // Step 1: create new Date
        const timestamp = new Date(date);

        // Step 2: Format the Date object into a human-readable format
        const formattedTimeStamp = timestamp.toLocaleString();
        return formattedTimeStamp;
    }

    return (
        <>
            <main className="bg-black text-white min-h-screen w-full flex flex-grow flex-col items-center justify-center font-Outfit">
                <Header />
                {loading ? (
                    <div className="w-full relative text-white flex flex-grow justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {pageViews?.length === 0 && !loading ? (
                            <div className="w-full flex flex-col flex-grow justify-center items-center space-y-6 z-40 relative px-4">
                                <div className="z-40 lg:w-3/5 w-full flex flex-col items-center justify-center bg-black border border-white/10 py-12 px-8 text-white space-y-4 rounded-xl relative">
                                    <div className="animate-pulse flex items-center justify-center gap-3">
                                        <p className="bg-green-500 rounded-full p-2" />
                                        <p className="tracking-wider">waiting for first page view ¯\_(ツ)_/¯ </p>
                                    </div>

                                    <button onClick={() => window.location.reload()} className="button !tracking-wider">
                                        Refresh Page
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="z-40 w-[95%] md:w-3/4 lg:w-3/4 min-h-screen py-6 border-x border-white/5 flex flex-col items-center justify-start">
                                <div className="w-full flex justify-center items-center">
                                    <Tabs
                                        defaultValue="General"
                                        className="w-full flex flex-col items-center justify-center"
                                    >
                                        <div className="w-full px-4 flex items-start justify-start">
                                            <TabsList className="w-fit bg-white/5 mb-4 border border-white/10 ">
                                                <TabsTrigger value="General" className="text-white/90">
                                                    General
                                                </TabsTrigger>
                                                <TabsTrigger value="Custom Events" className="text-white/90">
                                                    Custom Events
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="General" className="w-full">
                                            <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                                                <div className="bg-black border border-white/10 rounded-xl text-white text-center">
                                                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5 rounded-t-xl">
                                                        Total Visits
                                                    </p>

                                                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505] rounded-xl">
                                                        {abbreviateNumber(totalVisits.length)}
                                                    </p>
                                                </div>

                                                <div className="bg-black border border-white/10 rounded-xl text-white text-center">
                                                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5 rounded-t-xl">
                                                        Page Views
                                                    </p>

                                                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505] rounded-xl">
                                                        {abbreviateNumber(pageViews.length)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center bg-black mt-10 border-y border-white/10 lg:gap-10">
                                                {/*  -------- Top Page  --------*/}

                                                <div className="flex flex-col bg-black z-40 h-full w-full lg:border-r border-t lg:border-t-0 border-white/5">
                                                    <h1 className="label"> Top Pages</h1>
                                                    {groupedPageViews.map((view, index) => (
                                                        <div
                                                            key={index}
                                                            className="text-white w-full flex items-center justify-between px-6 py-4 border-b border-white/5"
                                                        >
                                                            <p>/{view.page}</p>
                                                            <p>{abbreviateNumber(view.visits)}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* -------- Top Sources ------ */}

                                                <div className="flex flex-col bg-black z-40 h-full w-full lg:border-l border-t lg:border-t-0 border-white/5">
                                                    <h1 className="label relative">
                                                        Top Visit Sources
                                                        <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                                                            add ?utm={"{source}"} to track
                                                        </p>
                                                    </h1>
                                                    {groupedPageSources.map(
                                                        (pageSource: GroupSource_Type, index: number) => (
                                                            <div
                                                                key={index}
                                                                className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/5 flex"
                                                            >
                                                                <p>/{pageSource.source}</p>
                                                                <p>{abbreviateNumber(pageSource.visits)}</p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>
                                        {/* ----------------   Custom Events   ------------------- */}
                                        <TabsContent value="Custom Events" className="w-full">
                                            {groupedCustomEvents && groupedCustomEvents.length > 0 ? (
                                                <Carousel className="w-full px-4">
                                                    <CarouselContent>
                                                        {groupedCustomEvents.map((grouped_event, index) => (
                                                            <CarouselItem key={index} className="basis-1/2">
                                                                <div
                                                                    className={`bg-black smooth group hover:border-white/10 text-white text-center border ${
                                                                        activeCustomEventTab ===
                                                                        grouped_event.event_name
                                                                            ? "border-white/10"
                                                                            : "border-white/5 cursor-pointer"
                                                                    } `}
                                                                    onClick={() =>
                                                                        setActiveCustomEventTab(
                                                                            grouped_event.event_name
                                                                        )
                                                                    }
                                                                >
                                                                    <p
                                                                        className={`text-white/70 font-medium py-8 w-full group-hover:border-white/10 smooth text-center border-b 
                                                                                ${
                                                                                    activeCustomEventTab ===
                                                                                    grouped_event.event_name
                                                                                        ? "border-white/10"
                                                                                        : "border-white/5 cursor-pointer"
                                                                                }`}
                                                                    >
                                                                        {grouped_event.event_name}
                                                                    </p>
                                                                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                                                        {grouped_event.count}
                                                                    </p>
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="hidden lg:block" />
                                                    <CarouselNext className="hidden lg:block" />
                                                </Carousel>
                                            ) : (
                                                <section className="px-4 flex flex-col justify-center items-center">
                                                    <p>Oops ! &nbsp; &nbsp;No Custom Events Created</p>
                                                    <p className="text-sm text-white/40 mt-5">
                                                        Please check the api docs for creating custom events
                                                    </p>
                                                </section>
                                            )}

                                            {/* -------------  display events with messages ---------- */}
                                            <div className="items-center justify-center bg-black mt-12 w-full border-y border-white/5 relative">
                                                {activeCustomEventTab !== "" && (
                                                    <button
                                                        className="button absolute right-0 z-50"
                                                        onClick={() => setActiveCustomEventTab("")}
                                                    >
                                                        all
                                                    </button>
                                                )}
                                                <div className="flex flex-col bg-black z-40 h-full w-full">
                                                    {customEvents
                                                    .filter((item) =>
                                                        activeCustomEventTab
                                                            ? item.event_name === activeCustomEventTab
                                                            : item
                                                    )
                                                    .map((event: CustomEvent_Type) => (
                                                        <div
                                                            key={event.id}
                                                            className={`text-white w-full items-start justify-start px-6 py-12 border-b border-white/5 flex flex-col relative`}
                                                        >
                                                            <p className="text-white/70 font-light pb-3">
                                                                {event.event_name}
                                                            </p>
                                                            <p className="">{event.message}</p>
                                                            <p className="italic absolute right-2 bottom-2 text-xs text-white/50">
                                                                {formatTimeStamps(event.created_at)}
                                                                {/* This created_at is the timestamp of the event */}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    );
};

export default WebsitePage;
