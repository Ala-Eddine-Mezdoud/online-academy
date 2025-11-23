'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-18 ">
                    {/* Logo and Desktop Menu */}
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-[#A0FAFFFF]">
                            EduConnect
                        </Link>
                    </div>
                    <div className="flex">


                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className="border-blue-500 font-['Open Sans'] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-color-white"
                            >
                                Home
                            </Link>
                            <Link
                                href="/courses"
                                className="border-transparent  hover:border-gray-300 hover:text-[#A0FAFFFF] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-color-white"
                            >
                                Courses
                            </Link>
                            <Link
                                href="/teachers"
                                className="border-transparent hover:border-gray-300 hover:text-[#A0FAFFFF] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Teachers
                            </Link>
                            <Link
                                href="/about"
                                className="border-transparent hover:border-gray-300 hover:text-[#A0FAFFFF] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-color-white"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="border-transparent hover:border-gray-300 hover:text-[#A0FAFFFF] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-color-white"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>


                    <div className="hidden sm:ml-6 sm:flex sm:items-center flex space-x-4">
                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                            {/* Log In */}
                            <Link
                                href=""
                                className="w-[73px] h-[40px] px-3 flex items-center justify-center
                                            font-['Open Sans'] text-[14px] leading-[22px] font-medium
                                            text-white
                                            bg-transparent
                                            rounded-[6px]
                                            border-[1.5px] border-white
                                            transition-all duration-200
                                            hover:-translate-y-1
                                            hover:bg-transparent
                                            active:bg-transparent
                                            disabled:opacity-40n"
                            >
                                Log In
                            </Link>

                            {/* Sign Up */}
                            <Link
                                href=""
                                className="
                                            w-[83px] h-[36px]
                                            px-3
                                            flex items-center justify-center
                                            font-['Open Sans'] text-[14px] leading-[22px] font-medium
                                            text-[#171A1F]
                                            bg-[linear-gradient(66.55deg,#00C2FF_0%,#A0FAFF_33%,#FCF9F8_66%,#C46FFB_100%,#CCCCCC_100%)]
                                            rounded-[6px]
                                            border-none
                                            opacity-100
                                            transition-all duration-200
                                            hover:-translate-y-1
                                            hover:bg-[#0B70D4]
                                            active:bg-[#0A62B9]
                                            disabled:opacity-40"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-black text-white">
                    <div className="pt-2 pb-3 space-y-1">

                        {/* Home */}
                        <Link
                            href="/"
                            className="block px-4 py-2 text-base font-medium hover:bg-gray-800 transition"
                        >
                            Home
                        </Link>

                        {/* Courses */}
                        <Link
                            href="/courses"
                            className="block px-4 py-2 text-base font-medium hover:bg-gray-800 transition"
                        >
                            Courses
                        </Link>

                        {/* Teachers */}
                        <Link
                            href="/teachers"
                            className="block px-4 py-2 text-base font-medium hover:bg-gray-800 transition"
                        >
                            Teachers
                        </Link>

                        {/* About */}
                        <Link
                            href="/about"
                            className="block px-4 py-2 text-base font-medium hover:bg-gray-800 transition"
                        >
                            About Us
                        </Link>

                        {/* Contact */}
                        <Link
                            href="/contact"
                            className="block px-4 py-2 text-base font-medium hover:bg-gray-800 transition"
                        >
                            Contact
                        </Link>

                        {/* Buttons */}
                        <div className="px-4 pt-4 pb-6 space-y-3">

                            {/* Log In Button */}
                            <Link
                                href=""
                                className="w-full h-[40px] px-3 flex items-center justify-center
                               font-['Open Sans'] text-[14px] font-medium
                               text-white bg-transparent
                               border-[1.5px] border-white rounded-[6px]
                               transition-all duration-200
                               hover:-translate-y-1"
                            >
                                Log In
                            </Link>

                            {/* Sign Up Button */}
                            <Link
                                href=""
                                className="w-full h-[40px] px-3 flex items-center justify-center
                               font-['Open Sans'] text-[14px] font-medium
                               text-[#171A1F]
                               bg-[linear-gradient(66.55deg,#00C2FF_0%,#A0FAFF_33%,#FCF9F8_66%,#C46FFB_100%,#CCCCCC_100%)]
                               rounded-[6px]
                               transition-all duration-200
                               hover:-translate-y-1
                               hover:bg-[#0B70D4]
                               active:bg-[#0A62B9]"
                            >
                                Sign Up
                            </Link>

                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
}