"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs"; // Import UserButton
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { motion } from "framer-motion"; // Import for animations
import logo from "@/public/logo.svg";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter for navigation
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      imageUrl: user?.imageUrl,
    });
    console.log(result);
  };

  const handleGetStarted = () => {
    if (user) {
      // If the user is signed in, navigate to their workspace
      router.push("/dashboard");
    } else {
      // If not signed in, navigate to the sign-in page
      router.push("/sign-in");
    }
  };

  const path = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col items-center text-gray-800">
      {/* Header Section */}
      <header className="flex justify-between items-center w-full max-w-screen-xl px-8 py-4 animate-fadeIn">
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Image src={logo} alt="Logo" width={40} height={40} />
          </motion.div>
          <span className="text-2xl font-semibold">AI-Pdf-Notes</span>
        </div>
        <nav className="flex items-center space-x-8 text-gray-700">
          {["Features", "Solution", "Testimonials", "Blog"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-900 transition duration-300">
              {item}
            </a>
          ))}
          <Button
            onClick={handleGetStarted}
            className={`ml-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition duration-300 ${
              path === "/dashboard/sign-up" && "bg-slate-100"
            }`}
          >
            Get Started
          </Button>
          {/* UserButton for Clerk Authentication */}
          <div className="ml-4">
            {user ? (
              <UserButton />
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gray-700 text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition duration-300">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-6 mt-12 space-y-8">
        <motion.h1
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Simplify <span className="text-red-500">PDF</span> <span className="text-blue-500">Note-Taking</span>
          <br />
          with AI-Powered
        </motion.h1>
        <p className="text-lg text-gray-600 mb-8 max-w-lg">
          Elevate your note-taking experience with our AI-powered PDF app. Seamlessly extract key insights, summaries,
          and annotations from any PDF with just a few clicks.
        </p>
        <div className="flex space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition duration-300">
              Get Started
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gray-200 text-black rounded-full px-6 py-3 shadow-md hover:shadow-lg transition duration-300">
              Learn More
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer Features Section */}
      <footer className="flex justify-center items-center w-full py-6 bg-white border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center px-4 md:px-0">
          {[
            { title: "Lowest Price", description: "Affordable options for everyone." },
            { title: "Fastest on the Market", description: "Lightning-fast results." },
            { title: "Most Loved", description: "Join our happy community." }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="p-4 bg-gray-50 rounded-lg shadow-sm transition duration-300 hover:bg-gray-100"
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <h3 className="font-semibold text-gray-800 text-base">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}
