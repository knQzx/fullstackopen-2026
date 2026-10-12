import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Diagnosis, EntryFormValues, Gender, Patient } from "../../types";
import patientService from "../../services/patients";
import { errorMessage } from "../../utils";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const genderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (id) {
      void patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient || !id) {
    return <div>loading...</div>;
  }

  const addEntry = async (values: EntryFormValues): Promise<boolean> => {
    try {
      const entry = await patientService.addEntry(id, values);
      setPatient({ ...patient, entries: (patient.entries ?? []).concat(entry) });
      setError(undefined);
      return true;
    } catch (e: unknown) {
      setError(errorMessage(e));
      return false;
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        {patient.name} {genderIcon(patient.gender)}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      <AddEntryForm diagnoses={diagnoses} onSubmit={addEntry} error={error} />

      <Typography variant="h6">entries</Typography>
      {(patient.entries ?? []).map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;
