import { isNotNumber } from './utils';

export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0) {
    throw new Error('height and weight must be positive');
  }

  const bmi = weight / (height / 100) ** 2;

  if (bmi < 16) return 'Underweight (severe thinness)';
  if (bmi < 17) return 'Underweight (moderate thinness)';
  if (bmi < 18.5) return 'Underweight (mild thinness)';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese (class I)';
  if (bmi < 40) return 'Obese (class II)';
  return 'Obese (class III)';
};

const parseArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length !== 4) throw new Error('usage: npm run calculateBmi <height cm> <weight kg>');
  if (isNotNumber(args[2]) || isNotNumber(args[3])) throw new Error('provided values were not numbers');

  return {
    height: Number(args[2]),
    weight: Number(args[3]),
  };
};

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let message = 'Something bad happened.';
    if (error instanceof Error) {
      message += ' Error: ' + error.message;
    }
    console.log(message);
  }
}
