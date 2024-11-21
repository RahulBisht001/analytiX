import React from "react";

const Loader = () => {
    return (
        <>
            <section className="font-Outfit flex flex-col gap-10 justify-center items-center">
                <svg version="1.1" viewBox="0 0 64 64" width="1em" xmlns="http://www.w3.org/2000/svg" id="spinner">
                    <circle
                        className="path-gradient"
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#sGD)"
                        strokeWidth="6"
                    />
                    <path
                        className="path-solid"
                        d="M 32,4 A 28 28,0,0,0,32,60"
                        fill="none"
                        stroke="#000"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="sGD" gradientUnits="userSpaceOnUse" x1="32" y1="0" x2="32" y2="64">
                            <stop stopColor="#000" offset="0.1" stopOpacity="0" className="stop1" />
                            <stop stopColor="#000" offset=".9" stopOpacity="1" className="stop2" />
                        </linearGradient>
                    </defs>
                    <animateTransform
                        values="0,0,0;360,0,0"
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1000ms"
                    />
                    --&gt;
                </svg>
                <p>Thoda sa ruk ja bhai 🥹</p>
            </section>
        </>
    );
};

export default Loader;
