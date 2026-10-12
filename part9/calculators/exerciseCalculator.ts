import { isNotNumber } from './utils';

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((h) => h > 0).length;
  const average = periodLength === 0 ? 0 : dailyHours.reduce((sum, h) => sum + h, 0) / periodLength;

  let rating = 1;
  let ratingDescription = 'bad';
  if (average >= target) {
    rating = 3;
    ratingDescription = 'great, target reached';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (args: string[]): { target: number; dailyHours: number[] } => {
  if (args.length < 4) throw new Error('usage: npm run calculateExercises <target> <hours...>');

  const values = args.slice(2);
  if (values.some(isNotNumber)) throw new Error('provided values were not numbers');

  return {
    target: Number(values[0]),
    dailyHours: values.slice(1).map(Number),
  };
};

if (require.main === module) {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let message = 'Something bad happened.';
    if (error instanceof Error) {
      message += ' Error: ' + error.message;
    }
    console.log(message);
  }
}
