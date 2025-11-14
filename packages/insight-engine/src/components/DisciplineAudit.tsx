import { useState } from 'react';
import { UserChoice, Constraint, ConstraintCategory } from '../types/insight-engine';

interface DisciplineAuditProps {
  choice: UserChoice;
  onNext: (updatedChoice: UserChoice) => void;
  onBack: () => void;
}

export const DisciplineAudit: React.FC<DisciplineAuditProps> = ({ 
  choice, 
  onNext, 
  onBack 
}) => {
  const [constraints, setConstraints] = useState<Constraint[]>(choice.constraints);

  const updateConstraintCategory = (constraintId: string, category: ConstraintCategory) => {
    setConstraints(prev => 
      prev.map(constraint => 
        constraint.id === constraintId 
          ? { ...constraint, category }
          : constraint
      )
    );
  };

  const handleNext = () => {
    const updatedChoice: UserChoice = {
      ...choice,
      constraints
    };
    onNext(updatedChoice);
  };

  const categorizedCount = constraints.filter(c => c.category !== 'uncategorized').length;
  const allCategorized = categorizedCount === constraints.length;

  const truthCount = constraints.filter(c => c.category === 'truth').length;
  const problemCount = constraints.filter(c => c.category === 'problem').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          The Discipline Audit
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          For each constraint, decide: Is this a <strong>Truth to Accommodate</strong> or a <strong>Problem to Solve</strong>?
        </p>
        
        {/* Progress indicator */}
        <div className="bg-gray-200 rounded-full h-2 max-w-md mx-auto mb-6">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(categorizedCount / constraints.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {categorizedCount} of {constraints.length} constraints categorized
        </p>
      </div>

      {/* Explanation Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            💎 Truth to Accommodate
          </h3>
          <p className="text-blue-800 mb-3">
            Non-negotiable realities you must work around. These require creative bridge-building, not elimination.
          </p>
          <div className="text-sm text-blue-700">
            <strong>Examples:</strong> Having young children, visa restrictions, physical limitations, family obligations
          </div>
          {truthCount > 0 && (
            <div className="mt-3 text-sm font-medium text-blue-900">
              {truthCount} truth{truthCount !== 1 ? 's' : ''} identified
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-900 mb-3">
            🔧 Problem to Solve
          </h3>
          <p className="text-red-800 mb-3">
            Temporary obstacles that can be addressed, reduced, or eliminated with time and strategy.
          </p>
          <div className="text-sm text-red-700">
            <strong>Examples:</strong> Lack of savings, missing skills, imposter syndrome, unclear business plan
          </div>
          {problemCount > 0 && (
            <div className="mt-3 text-sm font-medium text-red-900">
              {problemCount} problem{problemCount !== 1 ? 's' : ''} identified
            </div>
          )}
        </div>
      </div>

      {/* Constraint Categorization */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Categorize Your Constraints
        </h2>
        
        {constraints.map((constraint, index) => (
          <div key={constraint.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-800 flex-1">
                  {constraint.description}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => updateConstraintCategory(constraint.id, 'truth')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  constraint.category === 'truth'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💎</span>
                  <span className="font-semibold">Truth to Accommodate</span>
                  {constraint.category === 'truth' && (
                    <span className="text-blue-600 ml-auto">✓</span>
                  )}
                </div>
                <p className="text-sm opacity-75">
                  This is a reality I need to work around
                </p>
              </button>
              
              <button
                onClick={() => updateConstraintCategory(constraint.id, 'problem')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  constraint.category === 'problem'
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔧</span>
                  <span className="font-semibold">Problem to Solve</span>
                  {constraint.category === 'problem' && (
                    <span className="text-red-600 ml-auto">✓</span>
                  )}
                </div>
                <p className="text-sm opacity-75">
                  This is an obstacle I can address over time
                </p>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!allCategorized}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Generate Bridge Blueprint →
        </button>
      </div>
      
      {!allCategorized && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Please categorize all constraints to continue
        </p>
      )}
    </div>
  );
};