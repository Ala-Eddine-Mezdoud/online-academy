'use client';

import { useState, useEffect } from 'react';
import { getAllCourses } from '@/app/lib/courses.client';
import Link from 'next/link';


export default function CoursesPage() {


  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData] = await Promise.all([
        getAllCourses(),
      ]);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);




  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-8">
      <div className='mb-8'>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
      </div>


      <div className="bg-white rounded-lg ">

        <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* courses cards */}
          {courses.map((course) => (
            <div key={course.id} className="relative flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden border border-gray-300 p-4 ">

              <Link href={`/dashboard/teacher/courses/${course.id}`} className="block flex-grow cursor-pointer">
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-md">
                  {/* Placeholder for course image */}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                </div>
              </Link>

              <div className="p-4 border-t border-gray-200 flex gap-2">
                <Link href={`/dashboard/teacher/courses/${course.id}/live`} className="block w-full">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out">
                    Teach Now!
                  </button>
                </Link>
                <Link href={`/dashboard/teacher/courses/${course.id}`} className="block w-full">
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out">
                    Details
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>


    </div>
  );
}
