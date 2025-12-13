'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Course } from '../types';

interface RecentCoursesProps {
    courses: Course[];
}

export default function RecentCourses({ courses }: RecentCoursesProps) {
    return (
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
                <Link
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    View all
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="divide-y divide-gray-200">
                {courses.map((course) => (
                    <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                                <p className="text-sm text-gray-600">{course.students} students enrolled</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                Active
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Course Progress</span>
                                <span className="font-medium text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
