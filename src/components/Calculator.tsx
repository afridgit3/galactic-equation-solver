
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CalcButton } from './CalcButton';
import { CalcDisplay } from './CalcDisplay';
import { evaluate } from '@/utils/calculator';

const Calculator = () => {
  const [input, setInput] = useState<string>('0');
  const [result, setResult] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);
  const [isInDegreeMode, setIsInDegreeMode] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleNumberInput(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorInput(key);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '.') {
        handleDecimal();
      } else if (key === '(' || key === ')') {
        handleParenthesis(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  const handleNumberInput = (num: string) => {
    setInput(prev => {
      if (prev === '0' || prev === 'Error') return num;
      return prev + num;
    });
  };

  const handleOperatorInput = (operator: string) => {
    if (input === 'Error') {
      setInput(operator);
      return;
    }

    // Check if the last character is an operator and replace it
    const lastChar = input.slice(-1);
    if (['+', '-', '*', '/', '^'].includes(lastChar)) {
      setInput(input.slice(0, -1) + operator);
    } else {
      setInput(input + operator);
    }
  };

  const handleEquals = () => {
    if (input === 'Error' || input === '') return;

    try {
      const calculatedResult = evaluate(input, isInDegreeMode);
      setResult(String(calculatedResult));
      setHistory(prev => [...prev, `${input} = ${calculatedResult}`]);
      setInput(String(calculatedResult));
    } catch (error) {
      setInput('Error');
      toast({
        title: "Calculation Error",
        description: "Invalid expression",
        variant: "destructive"
      });
    }
  };

  const handleClear = () => {
    setInput('0');
    setResult('');
  };

  const handleAllClear = () => {
    setInput('0');
    setResult('');
    setHistory([]);
  };

  const handleDelete = () => {
    if (input === 'Error') {
      setInput('0');
      return;
    }
    
    setInput(prev => {
      if (prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleDecimal = () => {
    if (input === 'Error') {
      setInput('0.');
      return;
    }
    
    // Check if the last number already has a decimal point
    const parts = input.split(/[+\-*/^()]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleParenthesis = (bracket: string) => {
    if (input === 'Error') {
      setInput(bracket);
      return;
    }
    
    setInput(input + bracket);
  };

  const handleScientificFunction = (func: string) => {
    if (input === 'Error') {
      setInput(`${func}(`);
      return;
    }
    
    setInput(input + `${func}(`);
  };

  const handleMemoryOperation = (operation: string) => {
    if (input === 'Error') return;

    try {
      switch (operation) {
        case 'MC':
          setMemory(0);
          toast({
            title: "Memory Cleared",
          });
          break;
        case 'MR':
          setInput(String(memory));
          break;
        case 'M+':
          const currentValuePlus = Number(evaluate(input, isInDegreeMode));
          setMemory(memory + currentValuePlus);
          toast({
            title: "Added to Memory",
            description: `Memory: ${memory + currentValuePlus}`
          });
          break;
        case 'M-':
          const currentValueMinus = Number(evaluate(input, isInDegreeMode));
          setMemory(memory - currentValueMinus);
          toast({
            title: "Subtracted from Memory",
            description: `Memory: ${memory - currentValueMinus}`
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Memory Operation Error",
        description: "Could not perform the operation",
        variant: "destructive"
      });
    }
  };

  const toggleMode = () => {
    setIsInDegreeMode(prev => !prev);
    toast({
      title: `Switched to ${!isInDegreeMode ? 'Degree' : 'Radian'} Mode`,
    });
  };

  return (
    <div className="flex flex-col bg-[hsl(var(--calc-bg))] rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-auto">
      <CalcDisplay 
        input={input} 
        result={result}
        mode={isInDegreeMode ? 'DEG' : 'RAD'} 
        memory={memory !== 0}
        history={history}
      />
      
      <div className="grid grid-cols-5 gap-2 p-3">
        {/* Mode and Memory Row */}
        <button 
          onClick={toggleMode}
          className={cn("calc-btn calc-btn-memory col-span-1", {
            "ring-2 ring-white": !isInDegreeMode
          })}
        >
          {isInDegreeMode ? "DEG" : "RAD"}
        </button>
        <button onClick={() => handleMemoryOperation('MC')} className="calc-btn calc-btn-memory">MC</button>
        <button onClick={() => handleMemoryOperation('MR')} className="calc-btn calc-btn-memory">MR</button>
        <button onClick={() => handleMemoryOperation('M+')} className="calc-btn calc-btn-memory">M+</button>
        <button onClick={() => handleMemoryOperation('M-')} className="calc-btn calc-btn-memory">M-</button>

        {/* Scientific Functions Row 1 */}
        <CalcButton onClick={() => handleScientificFunction('sin')} className="calc-btn-operator">sin</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('cos')} className="calc-btn-operator">cos</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('tan')} className="calc-btn-operator">tan</CalcButton>
        <CalcButton onClick={handleAllClear} className="calc-btn-clear">AC</CalcButton>
        <CalcButton onClick={handleClear} className="calc-btn-clear">C</CalcButton>

        {/* Scientific Functions Row 2 */}
        <CalcButton onClick={() => handleScientificFunction('log')} className="calc-btn-operator">log</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('ln')} className="calc-btn-operator">ln</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('^')} className="calc-btn-operator">x^y</CalcButton>
        <CalcButton onClick={() => handleParenthesis('(')} className="calc-btn-operator">(</CalcButton>
        <CalcButton onClick={() => handleParenthesis(')')} className="calc-btn-operator">)</CalcButton>

        {/* Scientific Functions Row 3 */}
        <CalcButton onClick={() => handleScientificFunction('sqrt')} className="calc-btn-operator">√</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('cbrt')} className="calc-btn-operator">∛</CalcButton>
        <CalcButton onClick={() => setInput(prev => {
          if (prev === '0' || prev === 'Error') return '3.14159';
          return prev + '3.14159';
        })} className="calc-btn-operator">π</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('%')} className="calc-btn-operator">%</CalcButton>
        <CalcButton onClick={handleDelete} className="calc-btn-clear">⌫</CalcButton>

        {/* Number Pad and Basic Operations */}
        <CalcButton onClick={() => handleNumberInput('7')} className="calc-btn-number">7</CalcButton>
        <CalcButton onClick={() => handleNumberInput('8')} className="calc-btn-number">8</CalcButton>
        <CalcButton onClick={() => handleNumberInput('9')} className="calc-btn-number">9</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('/')} className="calc-btn-operator">÷</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('factorial')} className="calc-btn-operator">n!</CalcButton>

        <CalcButton onClick={() => handleNumberInput('4')} className="calc-btn-number">4</CalcButton>
        <CalcButton onClick={() => handleNumberInput('5')} className="calc-btn-number">5</CalcButton>
        <CalcButton onClick={() => handleNumberInput('6')} className="calc-btn-number">6</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('*')} className="calc-btn-operator">×</CalcButton>
        <CalcButton onClick={() => setInput(prev => {
          if (prev === '0' || prev === 'Error') return '2.71828';
          return prev + '2.71828';
        })} className="calc-btn-operator">e</CalcButton>

        <CalcButton onClick={() => handleNumberInput('1')} className="calc-btn-number">1</CalcButton>
        <CalcButton onClick={() => handleNumberInput('2')} className="calc-btn-number">2</CalcButton>
        <CalcButton onClick={() => handleNumberInput('3')} className="calc-btn-number">3</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('-')} className="calc-btn-operator">−</CalcButton>
        <CalcButton onClick={() => handleScientificFunction('abs')} className="calc-btn-operator">|x|</CalcButton>

        <CalcButton onClick={() => handleNumberInput('0')} className="calc-btn-number col-span-2">0</CalcButton>
        <CalcButton onClick={handleDecimal} className="calc-btn-number">.</CalcButton>
        <CalcButton onClick={() => handleOperatorInput('+')} className="calc-btn-operator">+</CalcButton>
        <CalcButton onClick={handleEquals} className="calc-btn-equals">=</CalcButton>
      </div>
    </div>
  );
};

export default Calculator;
