export function calculate(expression) {
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/');

  const tokens = normalized.match(/(\d+\.?\d*|\.\d+|[+\-*/])/g);
  if (!tokens || tokens.length === 0) {
    throw new Error('Empty expression');
  }

  function applyOp(op, a, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) throw new Error('Division by zero');
        return a / b;
      default: throw new Error(`Unknown operator: ${op}`);
    }
  }

  function precedence(op) {
    if (op === '*' || op === '/') return 2;
    if (op === '+' || op === '-') return 1;
    return 0;
  }

  const output = [];
  const opStack = [];

  for (const token of tokens) {
    const num = parseFloat(token);
    if (!isNaN(num) && token.match(/^[\d.]+$/)) {
      output.push(num);
    } else {
      while (
        opStack.length > 0 &&
        precedence(opStack[opStack.length - 1]) >= precedence(token)
      ) {
        const op = opStack.pop();
        const b = output.pop();
        const a = output.pop();
        output.push(applyOp(op, a, b));
      }
      opStack.push(token);
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop();
    const b = output.pop();
    const a = output.pop();
    if (a === undefined || b === undefined) throw new Error('Invalid expression');
    output.push(applyOp(op, a, b));
  }

  if (output.length !== 1) throw new Error('Invalid expression');

  const result = output[0];
  return parseFloat(result.toPrecision(12)).toString();
}
