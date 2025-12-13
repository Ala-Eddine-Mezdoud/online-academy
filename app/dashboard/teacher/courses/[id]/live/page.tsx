'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/app/lib/courses.client';
import { Video, Copy, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CourseTeachPage() {
    const params = useParams();
    const id = Number(params.id);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [meetLink, setMeetLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getCourseById(id);
                setCourse(data);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const generateLink = () => {
        setIsGenerating(true);
        // Simulate API call delay
        setTimeout(() => {
            setMeetLink(`https://meet.google.com/${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}`);
            setIsGenerating(false);
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(meetLink);
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

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
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <Link href={`/dashboard/teacher/courses/${id}`} className="text-sm text-blue-600 hover:underline mb-2 inline-block">
                            &larr; Back to Course
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Class: {course.title}</h1>
                        <p className="text-gray-500">Get everything ready to go live for your students.</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Step 1: Generate Link */}
                    <div className={`transition-opacity duration-300 ${submitted ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                            <h2 className="text-lg font-semibold text-gray-800">Generate Meeting Link</h2>
                        </div>

                        <div className="ml-11">
                            {!meetLink ? (
                                <button
                                    onClick={generateLink}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-blue-400"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Video className="w-5 h-5" />
                                            Generate Google Meet Link
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                                    <div className="flex items-center gap-3 text-green-800">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Link Generated Ready!</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <div className="bg-white border border-green-200 px-3 py-2 rounded text-gray-600 font-mono text-sm flex-grow">
                                            {meetLink}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 hover:bg-green-100 rounded text-green-700 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                        <a
                                            href={meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-green-100 rounded text-green-700 transition-colors"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Submit/Go Live */}
                    <div className={`transition-opacity duration-300 ${!meetLink ? 'opacity-40 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${submitted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>2</div>
                            <h2 className="text-lg font-semibold text-gray-800">Go Live</h2>
                        </div>

                        <div className="ml-11">
                            {submitted ? (
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-center">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">You are Live!</h3>
                                    <p className="text-blue-700 mb-4">Your students have been notified and can join the class.</p>
                                    <a href={meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        Join Meeting Now <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                    <p className="text-gray-600 mb-4">
                                        Once you have verified the meeting link, click below to notify students and start the session.
                                    </p>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!meetLink}
                                        className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Start Class Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
