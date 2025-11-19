'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * CampaignCard - Reusable dark hero card for campaigns, features, or special announcements
 * 
 * Usage:
 * - Funding campaigns (primary use case)
 * - Feature announcements
 * - Tool launches
 * - Special projects
 */

interface CampaignCardProps {
  title: string;
  description: string | React.ReactNode;
  status?: string;
  statusColor?: 'emerald' | 'blue' | 'purple' | 'orange';
  progress?: {
    current: number;
    goal: number;
    label?: string;
  };
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
    onClick?: () => void;
  };
  footer?: string | React.ReactNode;
  glowColor?: 'emerald' | 'blue' | 'purple' | 'orange';
  className?: string;
}

const colorMap = {
  emerald: {
    glow: 'bg-emerald-500',
    status: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    progress: 'bg-emerald-500',
    progressText: 'text-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900',
  },
  blue: {
    glow: 'bg-blue-500',
    status: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    progress: 'bg-blue-500',
    progressText: 'text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-400 text-white',
  },
  purple: {
    glow: 'bg-purple-500',
    status: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    progress: 'bg-purple-500',
    progressText: 'text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-400 text-white',
  },
  orange: {
    glow: 'bg-orange-500',
    status: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    progress: 'bg-orange-500',
    progressText: 'text-orange-400',
    button: 'bg-orange-500 hover:bg-orange-400 text-white',
  },
};

export function CampaignCard({
  title,
  description,
  status,
  statusColor = 'emerald',
  progress,
  action,
  footer,
  glowColor = 'emerald',
  className = '',
}: CampaignCardProps) {
  const colors = colorMap[glowColor];
  const ActionIcon = action?.icon;

  const progressPercentage = progress
    ? Math.min(100, (progress.current / progress.goal) * 100)
    : 0;

  return (
    <div className={`bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden ${className}`}>
      {/* Gradient Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${colors.glow} opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          {status && (
            <span className={`px-3 py-1 ${colors.status} text-xs font-bold uppercase tracking-wide rounded-full border self-start`}>
              {status}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="text-slate-300 mb-8 max-w-xl">
          {typeof description === 'string' ? (
            <p dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            description
          )}
        </div>

        {/* Progress Bar */}
        {progress && (
          <>
            <div className={`mb-2 flex justify-between text-sm font-mono ${colors.progressText}`}>
              <span>
                ${progress.current.toLocaleString()} raised
              </span>
              <span>${progress.goal.toLocaleString()} goal</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full mb-8 overflow-hidden">
              <div
                className={`h-full ${colors.progress} transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </>
        )}

        {/* Action Button */}
        {action && (
          <a
            href={action.href}
            onClick={action.onClick}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center justify-center w-full md:w-auto px-8 py-4 ${colors.button} font-bold rounded-lg transition-all transform hover:scale-[1.02] gap-2`}
          >
            {ActionIcon && <ActionIcon className="w-5 h-5" />}
            {action.label}
          </a>
        )}

        {/* Footer Note */}
        {footer && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
            {typeof footer === 'string' ? (
              <p className="text-xs text-slate-400">{footer}</p>
            ) : (
              footer
            )}
          </div>
        )}
      </div>
    </div>
  );
}
