import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { isNotNumber } from './utils';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNotNumber(height) || isNotNumber(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  try {
    res.json({
      weight: Number(weight),
      height: Number(height),
      bmi: calculateBmi(Number(height), Number(weight)),
    });
  } catch {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises) || isNotNumber(target) || daily_exercises.some(isNotNumber)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  res.json(calculateExercises(daily_exercises.map(Number), Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
