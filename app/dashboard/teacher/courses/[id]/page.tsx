'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/app/lib/courses.client';
import { getEnrollmentsWithStudentsByCourse } from '@/app/lib/enrollments.client';
import { Users, Clock, DollarSign, BookOpen, Video, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CourseDetailsPage() {
    const params = useParams();
    const id = Number(params.id);
    const [course, setCourse] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [courseData, enrollmentsData] = await Promise.all([
                    getCourseById(id),
                    getEnrollmentsWithStudentsByCourse(id)
                ]);
                setCourse(courseData);
                // Extract profiles from enrollments
                const studentsData = enrollmentsData?.map((enrollment: any) => ({
                    ...enrollment.profiles,
                    enrollment_date: enrollment.created_at,
                    progress: enrollment.progress
                })) || [];
                setStudents(studentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl text-gray-800">Course not found</h2>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.num_weeks} weeks</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {course.price}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {students.length} students</span>
                    </div>
                </div>
                <Link href={`/dashboard/teacher/courses/${id}/live`}>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                        <Video className="w-5 h-5" />
                        Teach Now
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Course Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            About this Course
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {course.description || "No description provided."}
                        </p>
                        {course.overview && (
                            <div className="mt-6">
                                <h3 className="text-md font-medium text-gray-900 mb-2">Overview</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.overview}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Enrolled Students */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Enrolled Students ({students.length})
                        </h2>

                        <div className="space-y-4">
                            {students.length > 0 ? (
                                students.map((student: any, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                            {student.avatar_url ? (
                                                <Image
                                                    src={student.avatar_url}
                                                    alt={student.full_name || 'Student'}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm">
                                                    {student.full_name?.[0] || 'S'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{student.full_name || 'Unknown Student'}</p>
                                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No students enrolled yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
