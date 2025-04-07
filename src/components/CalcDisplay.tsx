
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalcDisplayProps {
  input: string;
  result: string;
  mode: string;
  memory: boolean;
  history: string[];
}

export const CalcDisplay: React.FC<CalcDisplayProps> = ({ 
  input, 
  result,
  mode,
  memory,
  history
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="bg-[hsl(var(--calc-display))] p-4 text-white">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <div className="flex space-x-2">
          <span className={cn(
            "px-1 rounded", 
            memory ? "bg-[hsl(var(--calc-btn-memory))] text-white" : ""
          )}>
            {memory ? "M" : ""}
          </span>
          <button 
            onClick={() => setShowHistory(prev => !prev)} 
            className="hover:text-white transition-colors"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>
        <div>{mode}</div>
      </div>
      
      {showHistory && history.length > 0 && (
        <ScrollArea className="h-24 mb-2 bg-[hsl(var(--calc-bg))] rounded p-2">
          {history.map((item, index) => (
            <div key={index} className="text-right text-sm mb-1 text-gray-300">
              {item}
            </div>
          ))}
        </ScrollArea>
      )}
      
      <div className="text-right">
        <div className="text-xl text-gray-400 min-h-6">{result && input !== result ? result : ''}</div>
        <div className="text-3xl font-semibold break-all">{input}</div>
      </div>
    </div>
  );
};
