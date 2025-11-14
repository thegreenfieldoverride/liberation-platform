import React, { useState } from 'react';
import { UserChoice, Constraint } from '../types/insight-engine';

interface ChoiceDefinitionProps {
  onNext: (choice: UserChoice) => void;
  existingChoice?: UserChoice;
}

export const ChoiceDefinition: React.FC<ChoiceDefinitionProps> = ({ 
  onNext, 
  existingChoice 
}) => {
  const [statusQuo, setStatusQuo] = useState(existingChoice?.statusQuo || '');
  const [greenfieldPull, setGreenfieldPull] = useState(existingChoice?.greenfieldPull || '');
  const [constraints, setConstraints] = useState<string[]>(
    existingChoice?.constraints.map(c => c.description) || ['']
  );

  const addConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };

  const removeConstraint = (index: number) => {
    if (constraints.length > 1) {
      setConstraints(constraints.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    const filteredConstraints = constraints.filter(c => c.trim() !== '');
    
    if (!statusQuo.trim() || !greenfieldPull.trim() || filteredConstraints.length === 0) {
      return;
    }

    const choice: UserChoice = {
      id: existingChoice?.id || `choice-${Date.now()}`,
      statusQuo: statusQuo.trim(),
      greenfieldPull: greenfieldPull.trim(),
      constraints: filteredConstraints.map((desc, index): Constraint => ({
        id: `constraint-${index}-${Date.now()}`,
        description: desc.trim(),
        category: 'uncategorized'
      })),
      createdAt: existingChoice?.createdAt || new Date()
    };

    onNext(choice);
  };

  const isValid = statusQuo.trim() && greenfieldPull.trim() && constraints.some(c => c.trim());

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Define Your Paths
        </h1>
        <p className="text-lg text-gray-600">
          Start by clearly defining your two possible directions
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Quo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Status Quo Path
          </label>
          <p className="text-sm text-gray-500 mb-3">
            What happens if you continue on your current path?
          </p>
          <textarea
            value={statusQuo}
            onChange={(e) => setStatusQuo(e.target.value)}
            placeholder="e.g., Stay at my corporate marketing job, continue climbing the ladder..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Greenfield Pull */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Greenfield Path
          </label>
          <p className="text-sm text-gray-500 mb-3">
            What's calling to you? What would you do if constraints didn't exist?
          </p>
          <textarea
            value={greenfieldPull}
            onChange={(e) => setGreenfieldPull(e.target.value)}
            placeholder="e.g., Open my own nightclub, start a creative agency, become a freelancer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Constraints */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's Holding You Back?
          </label>
          <p className="text-sm text-gray-500 mb-3">
            List the constraints, fears, or obstacles that make this choice difficult
          </p>
          
          <div className="space-y-3">
            {constraints.map((constraint, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  placeholder="e.g., No savings, Fear of failure, Family responsibilities..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {constraints.length > 1 && (
                  <button
                    onClick={() => removeConstraint(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addConstraint}
              className="text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg text-sm font-medium"
              type="button"
            >
              + Add Another Constraint
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-6">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Next: Categorize Constraints
          </button>
        </div>
      </div>
    </div>
  );
};