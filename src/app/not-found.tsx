import Link from "next/link";

const NotFound = () => {
    return (
        <>
            <div className="font-Outfit" aria-label="Error 404 page">
                <div className="w-full min-h-svh flex flex-col items-center justify-center z-40 text-white/90 gap-5">
                    <p className="text-xl text-center text-wrap mx-4"> Bhai yahan kuch nahi hai. Wapas chala jaa! 😞</p>
                    <Link href="/" className="button">
                        Back to Home
                    </Link>

                    <p className="text-7xl lg:text-9xl text-white/20 font-bold text-center">Error 404</p>
                </div>
            </div>
        </>
    );
};

export default NotFound;
