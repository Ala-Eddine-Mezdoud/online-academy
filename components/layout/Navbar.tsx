'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isCoursePage = pathname.startsWith('/course');
    const isTeacherPage = pathname.startsWith('/teacher');
    const isAboutPage = pathname === '/about';
    const isContactPage = pathname === '/contact';

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <a href="/" className="text-2xl font-bold text-[#0C86D8]">
                            EduConnect
                        </a>
                    </div>
                    
                    <div className="flex">
                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <a
                                href="/"
                                className={isHomePage 
                                    ? "border-blue-500 font-['Open Sans'] inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-900 h-full"
                                    : "border-transparent hover:border-gray-300 hover:text-blue-600 inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-700 h-full"
                                }
                            >
                                Home
                            </a>
                            <a
                                href="/course"
                                className={isCoursePage 
                                    ? "border-blue-500 font-['Open Sans'] inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-900 h-full"
                                    : "border-transparent hover:border-gray-300 hover:text-blue-600 inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-700 h-full"
                                }
                            >
                                Courses
                            </a>
                            <a
                                href="/teacher"
                                className={isTeacherPage 
                                    ? "border-blue-500 font-['Open Sans'] inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-900 h-full"
                                    : "border-transparent hover:border-gray-300 hover:text-blue-600 inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-700 h-full"
                                }
                            >
                                Teachers
                            </a>
                            <a
                                href="/about"
                                className={isAboutPage 
                                    ? "border-blue-500 font-['Open Sans'] inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-900 h-full"
                                    : "border-transparent hover:border-gray-300 hover:text-blue-600 inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-700 h-full"
                                }
                            >
                                About Us
                            </a>
                            <a
                                href="/contact"
                                className={isContactPage 
                                    ? "border-blue-500 font-['Open Sans'] inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-900 h-full"
                                    : "border-transparent hover:border-gray-300 hover:text-blue-600 inline-flex items-center px-1 border-b-2 text-sm font-medium text-gray-700 h-full"
                                }
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {/* Log In */}
                        <a
                            href="/login"
                            className="w-[73px] h-[40px] px-3 flex items-center justify-center
                                        font-['Open Sans'] text-[14px] leading-[22px] font-medium
                                        text-blue-600
                                        bg-transparent
                                        rounded-[6px]
                                        border-[1.5px] border-blue-600
                                        transition-all duration-200
                                        hover:-translate-y-1
                                        hover:bg-blue-50"
                        >
                            Log In
                        </a>

                        {/* Sign Up */}
                        <a
                            href="/signup"
                            className="w-[83px] h-[40px] px-3 flex items-center justify-center
                                        font-['Open Sans'] text-[14px] leading-[22px] font-medium
                                        text-white
                                        bg-gradient-to-r from-blue-600 to-[#0C86D8]
                                        rounded-[6px]
                                        border-none
                                        transition-all duration-200
                                        hover:-translate-y-1
                                        hover:from-blue-700 hover:to-[#0C86D8]"
                        >
                            Sign Up
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
                <div className="sm:hidden bg-white border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <a
                            href="/"
                            className={isHomePage
                                ? "block px-4 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-500"
                                : "block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                            }
                        >
                            Home
                        </a>
                        <a
                            href="/course"
                            className={isCoursePage
                                ? "block px-4 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-500"
                                : "block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                            }
                        >
                            Courses
                        </a>
                        <a
                            href="/teacher"
                            className={isTeacherPage
                                ? "block px-4 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-500"
                                : "block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                            }
                        >
                            Teachers
                        </a>
                        <a
                            href="/about"
                            className={isAboutPage
                                ? "block px-4 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-500"
                                : "block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                            }
                        >
                            About Us
                        </a>
                        <a
                            href="/contact"
                            className={isContactPage
                                ? "block px-4 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-500"
                                : "block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                            }
                        >
                            Contact
                        </a>

                        {/* Mobile Buttons */}
                        <div className="px-4 pt-4 pb-6 space-y-3">
                            <a
                                href="/login"
                                className="w-full h-[40px] px-3 flex items-center justify-center
                                   font-['Open Sans'] text-[14px] font-medium
                                   text-blue-600 bg-transparent
                                   border-[1.5px] border-blue-600 rounded-[6px]
                                   transition-all duration-200
                                   hover:bg-blue-50"
                            >
                                Log In
                            </a>
                            <a
                                href="/signup"
                                className="w-full h-[40px] px-3 flex items-center justify-center
                                   font-['Open Sans'] text-[14px] font-medium
                                   text-white
                                   bg-gradient-to-r from-blue-600 to-[#0C86D8]
                                   rounded-[6px]
                                   transition-all duration-200
                                   hover:from-blue-700 hover:to-[#0C86D8]"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}