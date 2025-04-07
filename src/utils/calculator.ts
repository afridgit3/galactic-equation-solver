
// Calculator utility functions

// Convert degrees to radians
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

// Factorial function
const factorial = (n: number): number => {
  if (n < 0) throw new Error("Cannot calculate factorial of negative number");
  if (n === 0 || n === 1) return 1;
  if (n > 170) throw new Error("Number too large for factorial");
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Tokenize the expression
const tokenize = (expression: string): string[] => {
  const tokens: string[] = [];
  let currentToken = '';
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if ('0123456789.'.includes(char)) {
      currentToken += char;
    } else {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
      
      if (char === ' ') continue;
      
      // Handle multi-character function names
      if (/[a-z]/i.test(char)) {
        let functionName = char;
        while (i + 1 < expression.length && /[a-z]/i.test(expression[i + 1])) {
          functionName += expression[i + 1];
          i++;
        }
        tokens.push(functionName);
      } else {
        tokens.push(char);
      }
    }
  }
  
  if (currentToken) {
    tokens.push(currentToken);
  }
  
  return tokens;
};

// Helper function to check if a token is an operator
const isOperator = (token: string): boolean => {
  return ['+', '-', '*', '/', '^', '%'].includes(token);
};

// Helper function to get operator precedence
const getPrecedence = (operator: string): number => {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/' || operator === '%') return 2;
  if (operator === '^') return 3;
  return 0;
};

// Convert infix notation to Reverse Polish Notation (RPN)
const toRPN = (tokens: string[]): string[] => {
  const output: string[] = [];
  const operatorStack: string[] = [];
  
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      // If token is a number, add it to the output queue
      output.push(token);
    } else if (token === '(') {
      // If token is a left parenthesis, push it onto the stack
      operatorStack.push(token);
    } else if (token === ')') {
      // If token is a right parenthesis, pop operators to output until left parenthesis
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop()!);
      }
      
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === '(') {
        operatorStack.pop(); // Remove the left parenthesis
        
        // If there's a function token at the top of the stack, pop it to output
        if (operatorStack.length > 0 && !isOperator(operatorStack[operatorStack.length - 1]) && operatorStack[operatorStack.length - 1] !== '(') {
          output.push(operatorStack.pop()!);
        }
      }
    } else if (isOperator(token)) {
      // If token is an operator, handle precedence
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        isOperator(operatorStack[operatorStack.length - 1]) &&
        getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(operatorStack.pop()!);
      }
      
      operatorStack.push(token);
    } else {
      // If token is a function name, push it onto the stack
      operatorStack.push(token);
    }
  }
  
  // Pop any remaining operators to the output
  while (operatorStack.length > 0) {
    output.push(operatorStack.pop()!);
  }
  
  return output;
};

// Evaluate the RPN expression
const evaluateRPN = (rpn: string[], isDegreeMode: boolean): number => {
  const stack: number[] = [];
  
  for (const token of rpn) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else if (isOperator(token)) {
      if (stack.length < 2) throw new Error("Invalid expression");
      
      const b = stack.pop()!;
      const a = stack.pop()!;
      
      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        case '%':
          stack.push((a * b) / 100);
          break;
      }
    } else {
      // Function evaluation
      switch (token) {
        case 'sin':
          if (stack.length < 1) throw new Error("Invalid expression");
          const sinValue = stack.pop()!;
          stack.push(Math.sin(isDegreeMode ? toRadians(sinValue) : sinValue));
          break;
          
        case 'cos':
          if (stack.length < 1) throw new Error("Invalid expression");
          const cosValue = stack.pop()!;
          stack.push(Math.cos(isDegreeMode ? toRadians(cosValue) : cosValue));
          break;
          
        case 'tan':
          if (stack.length < 1) throw new Error("Invalid expression");
          const tanValue = stack.pop()!;
          const tanRadians = isDegreeMode ? toRadians(tanValue) : tanValue;
          
          // Check for invalid tan values (multiples of π/2)
          if (Math.abs(Math.cos(tanRadians)) < 1e-10) {
            throw new Error("Tangent undefined at this value");
          }
          
          stack.push(Math.tan(tanRadians));
          break;
          
        case 'log':
          if (stack.length < 1) throw new Error("Invalid expression");
          const logValue = stack.pop()!;
          if (logValue <= 0) throw new Error("Cannot take log of non-positive number");
          stack.push(Math.log10(logValue));
          break;
          
        case 'ln':
          if (stack.length < 1) throw new Error("Invalid expression");
          const lnValue = stack.pop()!;
          if (lnValue <= 0) throw new Error("Cannot take ln of non-positive number");
          stack.push(Math.log(lnValue));
          break;
          
        case 'sqrt':
          if (stack.length < 1) throw new Error("Invalid expression");
          const sqrtValue = stack.pop()!;
          if (sqrtValue < 0) throw new Error("Cannot take square root of negative number");
          stack.push(Math.sqrt(sqrtValue));
          break;
          
        case 'cbrt':
          if (stack.length < 1) throw new Error("Invalid expression");
          const cbrtValue = stack.pop()!;
          stack.push(Math.cbrt(cbrtValue));
          break;
          
        case 'factorial':
          if (stack.length < 1) throw new Error("Invalid expression");
          const factValue = stack.pop()!;
          if (factValue < 0) throw new Error("Cannot calculate factorial of negative number");
          if (!Number.isInteger(factValue)) throw new Error("Factorial requires integer");
          stack.push(factorial(factValue));
          break;
          
        case 'abs':
          if (stack.length < 1) throw new Error("Invalid expression");
          const absValue = stack.pop()!;
          stack.push(Math.abs(absValue));
          break;
          
        default:
          throw new Error(`Unknown function: ${token}`);
      }
    }
  }
  
  if (stack.length !== 1) throw new Error("Invalid expression");
  
  return stack[0];
};

// Main evaluation function
export const evaluate = (expression: string, isDegreeMode: boolean): number => {
  try {
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    return evaluateRPN(rpn, isDegreeMode);
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error("Calculation error");
  }
};
