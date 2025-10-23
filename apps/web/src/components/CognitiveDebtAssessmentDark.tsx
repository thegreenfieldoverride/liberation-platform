'use client';

import React from 'react';

export interface CognitiveDebtAssessmentDarkProps {
  onResult?: (result: any) => void;
  className?: string;
}

export function CognitiveDebtAssessmentDark({ className }: CognitiveDebtAssessmentDarkProps) {
  return (
    <div className={className}>
      <div className="text-center p-8 border border-gray-700 rounded-lg bg-gray-900">
        <h2 className="text-2xl font-bold text-white mb-4">Cognitive Debt Assessment</h2>
        <p className="text-gray-300 mb-4">
          Coming Soon! This tool will help you measure the hidden mental costs of corporate burnout.
        </p>
        <p className="text-sm text-gray-500">
          Currently being rebuilt for enhanced liberation capabilities.
        </p>
      </div>
    </div>
  );
}