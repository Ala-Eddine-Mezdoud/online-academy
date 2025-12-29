"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCourseById } from "@/app/lib/courses.client";
import {
  Video,
  Copy,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createSession } from "@/app/lib/live_sessions.client";

export default function CourseTeachPage() {
  const params = useParams();
  const id = Number(params.id);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meetLink, setMeetLink] = useState("");
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
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const generateLink = () => {
    setIsGenerating(true);
    // Generate a random room name for Jitsi
    const roomName = `OnlineAcademy-${course?.title?.replace(/\s+/g, "-") || "Class"}-${Math.random().toString(36).substring(7)}`;
    setTimeout(() => {
      setMeetLink(`https://meet.jit.si/${roomName}`);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetLink);
  };

  const handleSubmit = async () => {
    if (!meetLink || !course) return;

    try {
      setIsGenerating(true);
      await createSession({
        course_id: id,
        session_link: meetLink,
        session_title: `Live Session: ${course.title}`,
        start_time: new Date().toISOString(),
        teacher_id: course.teacher_id,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error publishing session:", error);
      alert("Failed to publish the session. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
            <Link
              href={`/dashboard/teacher/courses/${id}`}
              className="text-sm text-blue-600 hover:underline mb-2 inline-block"
            >
              &larr; Back to Course
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Start Class: {course.title}
            </h1>
            <p className="text-gray-500">
              Get everything ready to go live for your students.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Step 1: Generate Link */}
          <div
            className={`transition-opacity duration-300 ${submitted ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Generate Meeting Link
              </h2>
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
                      Generate Jitsi Meet Link
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-3 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Link Generated Ready!</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="bg-white border border-green-200 px-3 py-2 rounded text-gray-600 font-mono text-sm flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                        {meetLink}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-green-100 rounded text-green-700 transition-colors shrink-0"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <a
                        href={meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-green-100 rounded text-green-700 transition-colors shrink-0"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide mb-1">
                        Important: Administrator Setup
                      </p>
                      <p className="text-sm">
                        You must click the "Open in new tab" icon above and{" "}
                        <strong>log in to Jitsi</strong> before publishing this
                        link. If you don't log in first, you will not have
                        administrator rights for the meeting.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Submit/Go Live */}
          <div
            className={`transition-opacity duration-300 ${!meetLink ? "opacity-40 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${submitted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
              >
                2
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Go Live</h2>
            </div>

            <div className="ml-11">
              {submitted ? (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    You are Live!
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Your students have been notified and can join the class.
                  </p>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Join Meeting Now <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-600 mb-4">
                    Once you have verified the meeting link, click below to
                    notify students and start the session.
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={!meetLink || isGenerating}
                    className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Start Class Session & Publish
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
