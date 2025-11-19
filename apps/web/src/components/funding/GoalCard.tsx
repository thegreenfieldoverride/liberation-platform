'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * GoalCard - Card for displaying funding goals (Marathon items)
 */

interface GoalCardProps {
  icon: LucideIcon;
  iconColor: 'blue' | 'amber' | 'purple' | 'emerald';
  title: string;
  goal: number;
  current?: number;
  description: string;
  className?: string;
}

const iconColorMap = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

const progressColorMap = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
};

export function GoalCard({
  icon: Icon,
  iconColor,
  title,
  goal,
  current = 0,
  description,
  className = '',
}: GoalCardProps) {
  const progressPercentage = Math.min(100, (current / goal) * 100);

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-emerald-700 font-mono">
            Goal: ${goal.toLocaleString()} / month
          </p>
          {current > 0 && (
            <p className="text-xs text-slate-500 font-mono mt-1">
              Current: ${current.toLocaleString()} / month
            </p>
          )}
        </div>
        <div className={`p-2 ${iconColorMap[iconColor]} rounded-lg flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4">{description}</p>

      {/* Progress Bar (if current funding provided) */}
      {current > 0 && (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColorMap[iconColor]} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
