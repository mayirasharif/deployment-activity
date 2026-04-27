
import { calculate } from "./calculate.js";

export const handler = async (event) => {
  const { a, b } = JSON.parse(event.body);

  const result = calculate(a, b);

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};
