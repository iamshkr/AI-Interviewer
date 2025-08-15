// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div>
     
//     </div>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center drop-shadow-lg">
        Welcome to <span className="text-primary">AI Interviewer</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl mb-8 text-center opacity-90 max-w-xl">
        Your AI-powered interview preparation assistant.  
        Practice smarter, not harder.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/dashboard")}
        >
          Sign In
        </Button>

        <Button
          className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/dashboard")}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}



