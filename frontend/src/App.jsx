import { useState } from 'react';
import './App.css';

const BACKEND_URL = 'http://localhost:3001';

const BUTTONS = [
  { label: 'C',   type: 'clear' },
  { label: 'CE',  type: 'clear' },
  { label: '÷',   type: 'operator' },
  { label: '×',   type: 'operator' },
  { label: '7',   type: 'number' },
  { label: '8',   type: 'number' },
  { label: '9',   type: 'number' },
  { label: '-',   type: 'operator' },
  { label: '4',   type: 'number' },
  { label: '5',   type: 'number' },
  { label: '6',   type: 'number' },
  { label: '+',   type: 'operator' },
  { label: '1',   type: 'number' },
  { label: '2',   type: 'number' },
  { label: '3',   type: 'number' },
  { label: '=',   type: 'equals' },
  { label: '0',   type: 'number', wide: true },
  { label: '.',   type: 'number' },
];

function tokenize(expr) {
  return expr.match(/(\d+\.?\d*|\.\d+|[+\-×÷])/g) || [];
}

export default function App() {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState(false);

  const handleButton = async (label) => {
    if (label === 'C') {
      setExpression('');
      setError(false);
      return;
    }

    if (label === 'CE') {
      setExpression(prev => {
        if (!prev) return '';
        const tokens = tokenize(prev);
        if (tokens.length === 0) return '';
        tokens.pop();
        return tokens.join('');
      });
      setError(false);
      return;
    }

    if (label === '=') {
      if (!expression || error) return;
      try {
        const res = await fetch(`${BACKEND_URL}/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression }),
        });
        const data = await res.json();
        setExpression(data.result);
        setError(data.result === 'Error');
      } catch {
        setExpression('Error');
        setError(true);
      }
      return;
    }

    // If error is showing, clear before appending
    setError(false);
    setExpression(prev => {
      // After a result is displayed, a digit starts fresh; an operator continues
      const isOperator = ['+', '-', '×', '÷'].includes(label);
      const prevIsResult = prev !== '' && !isNaN(parseFloat(prev)) && tokenize(prev).length === 1;
      if (prevIsResult && !isOperator) return label;
      return prev + label;
    });
  };

  return (
    <div className="calculator">
      <div className={`display ${error ? 'display-error' : ''}`}>
        {expression || '0'}
      </div>
      <div className="buttons">
        {BUTTONS.map(({ label, type, wide }) => (
          <button
            key={label}
            className={`btn btn-${type}${wide ? ' btn-wide' : ''}`}
            onClick={() => handleButton(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
