import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import patientService from '../services/patientService';
import { NewPatientSchema, toNewEntry } from '../utils';
import { Entry, NewPatient, NonSensitivePatient, Patient } from '../types';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res: Response<Patient | { error: string }>) => {
  const patient = patientService.findById(req.params.id);
  if (!patient) {
    res.status(404).send({ error: 'patient not found' });
    return;
  }
  res.send(patient);
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

router.post('/:id/entries', (req, res: Response<Entry | { error: string }>, next) => {
  const patient = patientService.findById(req.params.id);
  if (!patient) {
    res.status(404).send({ error: 'patient not found' });
    return;
  }

  try {
    const addedEntry = patientService.addEntry(patient, toNewEntry(req.body));
    res.json(addedEntry);
  } catch (error: unknown) {
    next(error);
  }
});

router.use(errorMiddleware);

export default router;
