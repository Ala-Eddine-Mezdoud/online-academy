'use client';

import React from 'react';
import { Users } from 'lucide-react';

export default function StudentsContent() {
    return (
        <div className="p-8">
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Students Management</h3>
                <p className="text-gray-600">Your students content will appear here</p>
            </div>
        </div>
    );
}
