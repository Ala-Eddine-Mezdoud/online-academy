'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { TeacherStat } from '../types';

interface StatsCardProps {
    stat: TeacherStat;
}

export default function StatsCard({ stat }: StatsCardProps) {
    const Icon = stat.icon;

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.trend}</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
    );
}
