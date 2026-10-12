import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';
import { Entry, EntryWithoutId, NewPatient, NonSensitivePatient, Patient } from '../types';

const getNonSensitivePatients = (): NonSensitivePatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const findById = (id: string): Patient | undefined => patients.find((p) => p.id === id);

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
  const newEntry = { id: uuid(), ...entry };
  patient.entries.push(newEntry);
  return newEntry;
};

export default { getNonSensitivePatients, findById, addPatient, addEntry };
