/**
 * A small, safe mathematical expression evaluator.
 *
 * Input is tokenised, converted to postfix with the shunting-yard algorithm,
 * and evaluated from a stack. Nothing is ever passed to eval() or the Function
 * constructor, so the worst a hostile expression can do is produce an error.
 */

export type AngleMode = "deg" | "rad";

export class ExpressionError extends Error {
  /** Character offset where the problem was found, when known. */
  position: number | undefined;

  constructor(message: string, position?: number) {
    super(message);
    this.name = "ExpressionError";
    this.position = position;
  }
}

type TokenType = "number" | "operator" | "function" | "paren" | "separator" | "constant";

interface Token {
  type: TokenType;
  value: string;
  position: number;
}

const OPERATORS: Record<string, { precedence: number; rightAssociative: boolean; arity: 2 }> = {
  "+": { precedence: 1, rightAssociative: false, arity: 2 },
  "-": { precedence: 1, rightAssociative: false, arity: 2 },
  "*": { precedence: 2, rightAssociative: false, arity: 2 },
  "/": { precedence: 2, rightAssociative: false, arity: 2 },
  "%": { precedence: 2, rightAssociative: false, arity: 2 },
  "^": { precedence: 4, rightAssociative: true, arity: 2 },
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  "π": Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
};

const FUNCTION_NAMES = [
  "sin", "cos", "tan", "asin", "acos", "atan",
  "sinh", "cosh", "tanh",
  "log", "ln", "log2", "log10",
  "sqrt", "cbrt", "abs", "exp",
  "floor", "ceil", "round", "sign",
] as const;

type FunctionName = (typeof FUNCTION_NAMES)[number];

const IDENTIFIER_START = /[a-zπ]/i;
const IDENTIFIER_PART = /[a-z0-9π]/i;

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function tokenise(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];

    if (char === " " || char === "\t") {
      index += 1;
      continue;
    }

    if (isDigit(char) || (char === "." && isDigit(input[index + 1] ?? ""))) {
      let end = index;
      let seenDot = false;
      let seenExponent = false;

      while (end < input.length) {
        const current = input[end];
        if (isDigit(current)) {
          end += 1;
        } else if (current === "." && !seenDot && !seenExponent) {
          seenDot = true;
          end += 1;
        } else if ((current === "e" || current === "E") && !seenExponent && isExponent(input, end)) {
          seenExponent = true;
          end += input[end + 1] === "+" || input[end + 1] === "-" ? 2 : 1;
        } else {
          break;
        }
      }

      tokens.push({ type: "number", value: input.slice(index, end), position: index });
      index = end;
      continue;
    }

    if (IDENTIFIER_START.test(char)) {
      let end = index;
      while (end < input.length && IDENTIFIER_PART.test(input[end])) end += 1;

      const raw = input.slice(index, end);
      const lower = raw.toLowerCase();

      if ((FUNCTION_NAMES as readonly string[]).includes(lower)) {
        tokens.push({ type: "function", value: lower, position: index });
      } else if (lower in CONSTANTS) {
        tokens.push({ type: "constant", value: lower, position: index });
      } else {
        throw new ExpressionError(`“${raw}” is not a function or constant this calculator knows.`, index);
      }
      index = end;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char, position: index });
      index += 1;
      continue;
    }

    if (char === "!") {
      tokens.push({ type: "operator", value: "!", position: index });
      index += 1;
      continue;
    }

    if (char === "×") {
      tokens.push({ type: "operator", value: "*", position: index });
      index += 1;
      continue;
    }

    if (char === "÷") {
      tokens.push({ type: "operator", value: "/", position: index });
      index += 1;
      continue;
    }

    if (char === "−") {
      tokens.push({ type: "operator", value: "-", position: index });
      index += 1;
      continue;
    }

    if (char in OPERATORS) {
      tokens.push({ type: "operator", value: char, position: index });
      index += 1;
      continue;
    }

    throw new ExpressionError(`“${char}” cannot be used in an expression.`, index);
  }

  return tokens;
}

function isExponent(input: string, index: number): boolean {
  const next = input[index + 1];
  if (next === undefined) return false;
  if (isDigit(next)) return true;
  return (next === "+" || next === "-") && isDigit(input[index + 2] ?? "");
}

/**
 * Marks unary minus and plus by rewriting them, and inserts implicit
 * multiplication so 2(3+4) and 3π behave the way people expect.
 */
function normalise(tokens: Token[]): Token[] {
  const out: Token[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const previous = out[out.length - 1];

    // Implicit multiplication covers 2(3+4), 3π and 2sin(30), but deliberately
    // not "2 3" — two bare numbers side by side is a typo, not a product.
    const startsValue =
      token.type === "constant" ||
      token.type === "function" ||
      (token.type === "paren" && token.value === "(");

    const endsValue =
      previous &&
      (previous.type === "number" ||
        previous.type === "constant" ||
        (previous.type === "paren" && previous.value === ")") ||
        (previous.type === "operator" && previous.value === "!"));

    if (startsValue && endsValue) {
      out.push({ type: "operator", value: "*", position: token.position });
    }

    if (token.type === "operator" && (token.value === "-" || token.value === "+")) {
      const isUnary =
        !previous ||
        (previous.type === "operator" && previous.value !== "!") ||
        (previous.type === "paren" && previous.value === "(");

      if (isUnary) {
        out.push({ type: "operator", value: token.value === "-" ? "neg" : "pos", position: token.position });
        continue;
      }
    }

    out.push(token);
  }

  return out;
}

/**
 * Prefix minus sits between multiplication and exponentiation, which is the
 * standard mathematical reading: −3² is −9, while −2 × 3 is −6.
 */
const UNARY_PRECEDENCE = 3;

function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      output.push(token);
      continue;
    }

    if (token.type === "function") {
      stack.push(token);
      continue;
    }

    if (token.type === "operator") {
      if (token.value === "!") {
        // Postfix factorial binds tighter than anything else.
        output.push(token);
        continue;
      }

      const isUnary = token.value === "neg" || token.value === "pos";
      if (isUnary) {
        // A prefix operator has nothing to its left to compete with, so it is
        // pushed without unwinding the stack. That keeps 2^-3 parsing correctly.
        stack.push(token);
        continue;
      }

      const precedence = OPERATORS[token.value].precedence;
      const rightAssociative = OPERATORS[token.value].rightAssociative;

      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (top.type === "paren") break;

        const topIsUnary = top.value === "neg" || top.value === "pos";
        const topPrecedence =
          top.type === "function"
            ? UNARY_PRECEDENCE + 1
            : topIsUnary
              ? UNARY_PRECEDENCE
              : OPERATORS[top.value].precedence;

        if (topPrecedence > precedence || (topPrecedence === precedence && !rightAssociative)) {
          output.push(stack.pop()!);
        } else {
          break;
        }
      }

      stack.push(token);
      continue;
    }

    if (token.value === "(") {
      stack.push(token);
      continue;
    }

    // Closing parenthesis.
    let matched = false;
    while (stack.length > 0) {
      const top = stack.pop()!;
      if (top.type === "paren" && top.value === "(") {
        matched = true;
        break;
      }
      output.push(top);
    }
    if (!matched) {
      throw new ExpressionError("There is a closing bracket with no matching opening bracket.", token.position);
    }
    if (stack.length > 0 && stack[stack.length - 1].type === "function") {
      output.push(stack.pop()!);
    }
  }

  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.type === "paren") {
      throw new ExpressionError("There is an opening bracket that is never closed.", top.position);
    }
    output.push(top);
  }

  return output;
}

function factorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new ExpressionError("Factorial only works on whole numbers of zero or more.");
  }
  if (value > 170) {
    throw new ExpressionError("That factorial is too large to represent.");
  }
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

function applyFunction(name: FunctionName, value: number, mode: AngleMode): number {
  const toRadians = (degrees: number) => (mode === "deg" ? (degrees * Math.PI) / 180 : degrees);
  const fromRadians = (radians: number) => (mode === "deg" ? (radians * 180) / Math.PI : radians);

  switch (name) {
    case "sin":
      return Math.sin(toRadians(value));
    case "cos":
      return Math.cos(toRadians(value));
    case "tan": {
      const radians = toRadians(value);
      // cos is never exactly zero in floating point, so check the neighbourhood.
      if (Math.abs(Math.cos(radians)) < 1e-12) {
        throw new ExpressionError("tan is undefined at 90° and its odd multiples.");
      }
      return Math.tan(radians);
    }
    case "asin":
      if (value < -1 || value > 1) throw new ExpressionError("asin is only defined between −1 and 1.");
      return fromRadians(Math.asin(value));
    case "acos":
      if (value < -1 || value > 1) throw new ExpressionError("acos is only defined between −1 and 1.");
      return fromRadians(Math.acos(value));
    case "atan":
      return fromRadians(Math.atan(value));
    case "sinh":
      return Math.sinh(value);
    case "cosh":
      return Math.cosh(value);
    case "tanh":
      return Math.tanh(value);
    case "log":
    case "log10":
      if (value <= 0) throw new ExpressionError("Logarithms are only defined for numbers above zero.");
      return Math.log10(value);
    case "ln":
      if (value <= 0) throw new ExpressionError("Logarithms are only defined for numbers above zero.");
      return Math.log(value);
    case "log2":
      if (value <= 0) throw new ExpressionError("Logarithms are only defined for numbers above zero.");
      return Math.log2(value);
    case "sqrt":
      if (value < 0) throw new ExpressionError("The square root of a negative number is not a real number.");
      return Math.sqrt(value);
    case "cbrt":
      return Math.cbrt(value);
    case "abs":
      return Math.abs(value);
    case "exp":
      return Math.exp(value);
    case "floor":
      return Math.floor(value);
    case "ceil":
      return Math.ceil(value);
    case "round":
      return Math.round(value);
    case "sign":
      return Math.sign(value);
  }
}

function evaluatePostfix(tokens: Token[], mode: AngleMode): number {
  const stack: number[] = [];

  const pop = (): number => {
    const value = stack.pop();
    if (value === undefined) {
      throw new ExpressionError("That expression is incomplete — an operator is missing a number.");
    }
    return value;
  };

  for (const token of tokens) {
    if (token.type === "number") {
      const parsed = Number(token.value);
      if (!Number.isFinite(parsed)) {
        throw new ExpressionError(`“${token.value}” is not a valid number.`, token.position);
      }
      stack.push(parsed);
      continue;
    }

    if (token.type === "constant") {
      stack.push(CONSTANTS[token.value]);
      continue;
    }

    if (token.type === "function") {
      stack.push(applyFunction(token.value as FunctionName, pop(), mode));
      continue;
    }

    switch (token.value) {
      case "neg":
        stack.push(-pop());
        break;
      case "pos":
        stack.push(pop());
        break;
      case "!":
        stack.push(factorial(pop()));
        break;
      case "+": {
        const b = pop();
        stack.push(pop() + b);
        break;
      }
      case "-": {
        const b = pop();
        stack.push(pop() - b);
        break;
      }
      case "*": {
        const b = pop();
        stack.push(pop() * b);
        break;
      }
      case "/": {
        const b = pop();
        if (b === 0) throw new ExpressionError("Division by zero is undefined.");
        stack.push(pop() / b);
        break;
      }
      case "%": {
        const b = pop();
        if (b === 0) throw new ExpressionError("Cannot take a remainder with zero.");
        stack.push(pop() % b);
        break;
      }
      case "^": {
        const exponent = pop();
        const base = pop();
        if (base < 0 && !Number.isInteger(exponent)) {
          throw new ExpressionError("A negative number raised to a fractional power is not a real number.");
        }
        stack.push(base ** exponent);
        break;
      }
      default:
        throw new ExpressionError(`Unsupported operator “${token.value}”.`, token.position);
    }
  }

  if (stack.length === 0) {
    throw new ExpressionError("There is nothing to calculate.");
  }
  if (stack.length > 1) {
    throw new ExpressionError("That expression has numbers with no operator between them.");
  }

  const result = stack[0];
  if (Number.isNaN(result)) {
    throw new ExpressionError("The result is not a number.");
  }
  if (!Number.isFinite(result)) {
    throw new ExpressionError("The result is too large to represent.");
  }

  return result;
}

/** Removes thousands separators that sit between two digits: 1,234 and 1_234. */
function stripDigitSeparators(input: string): string {
  return input.replace(/(?<=\d)[,_](?=\d)/g, "");
}

export function evaluateExpression(input: string, mode: AngleMode = "deg"): number {
  const trimmed = stripDigitSeparators(input.trim());
  if (!trimmed) throw new ExpressionError("Enter an expression to calculate.");
  return evaluatePostfix(toPostfix(normalise(tokenise(trimmed))), mode);
}

/** Formats a result without scientific notation for ordinary magnitudes. */
export function formatResult(value: number): string {
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return String(value);

  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude >= 1e12 || magnitude < 1e-7)) {
    return value.toExponential(9).replace(/\.?0+e/, "e");
  }

  return String(Number(value.toPrecision(12)));
}
