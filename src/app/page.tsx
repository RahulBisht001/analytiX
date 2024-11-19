import Link from "next/link";
import Script from "next/script";

export default function Home() {
    return (
        <>
            <main className="bg-black min-h-svh flex flex-col items-center justify-center font-Outfit">
                <div className="cursor hidden lg:block"></div>
                <div className="max-w-5xl text-center flex flex-col">
                    <h1 className="text-5xl sm:text-8xl font-semibold lg:font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 inline-block leading-[50px]">
                        Your Website's Analytics Simplified
                    </h1>

                    <p className="mt-10 px-5 text-base sm:text-lg text-violet-500 tracking-wider font-normal">
                        Measure performance, master growth
                    </p>

                    <div className="mt-5 flex justify-center gap-5">
                        <Link href="/auth" prefetch>
                            <p className="button !bg-violet-500 !text-black !font-normal">Get Started</p>
                        </Link>
                        <Link href="/dashboard" prefetch>
                            <p className="button !bg-transparent">Go To Dashboard</p>
                        </Link>
                    </div>
                </div>
                <Script strategy="lazyOnload">
                    {`
                    
                    const cursor = document.querySelector(".cursor");
                    
                    // Mouse movement event for desktop
                    const moveCursorMouse = (e) => {
                        let x = e.pageX;
                        let y = e.pageY;
                        cursor.style.top = y + "px";
                        cursor.style.left = x + "px";
                    };

                    // Touch movement event for mobile

                    const moveCursorTouch = (e) => {
                        // Prevent default to avoid scrolling when moving cursor
                        e.preventDefault();
                        const touch = e.touches[0]; // First touch point
                        let x = touch.clientX;
                        let y = touch.clientY;
                        cursor.style.top = y + "px";
                        cursor.style.left = x + "px";
                    };

                    // Add event listeners for both mouse and touch

                    document.addEventListener("mousemove", moveCursorMouse);
                    document.addEventListener("touchmove", moveCursorTouch, { passive: false });

                    // Cleanup the event listeners
                    return () => {
                        document.removeEventListener("mousemove", moveCursorMouse);
                        document.removeEventListener("touchmove", moveCursorTouch);
                    };         
            `}
                </Script>
            </main>
        </>
    );
}
