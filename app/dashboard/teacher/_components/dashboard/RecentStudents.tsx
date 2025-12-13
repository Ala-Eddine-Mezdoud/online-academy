'use client';

import React from 'react';
import type { Student } from '../types';

interface RecentStudentsProps {
    students: Student[];
}

export default function RecentStudents({ students }: RecentStudentsProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {students.map((student) => (
                    <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{student.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                <p className="text-xs text-gray-500 truncate">{student.course}</p>
                            </div>
                        </div>
                        <div className="ml-13">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-green-500 h-1.5 rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
