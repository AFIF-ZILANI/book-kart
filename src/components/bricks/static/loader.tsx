import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
                {/* Outer circle */}
                <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-[spin_1s_linear_infinite]" />

                {/* Middle circle */}
                <div className="absolute w-[75%] h-[75%] top-[12.5%] left-[12.5%] border-4 border-transparent border-t-purple-500 rounded-full animate-[spin_1.2s_linear_reverse_infinite]" />

                {/* Inner circle */}
                <div className="absolute w-[50%] h-[50%] top-[25%] left-[25%] border-4 border-transparent border-t-teal-500 rounded-full animate-[spin_1.5s_linear_infinite]" />

                {/* Center dot */}
                <div className="absolute w-[15%] h-[15%] top-[42.5%] left-[42.5%] bg-gray-600 rounded-full animate-pulse" />
            </div>
        </div>
    );
};

export default Loader;
