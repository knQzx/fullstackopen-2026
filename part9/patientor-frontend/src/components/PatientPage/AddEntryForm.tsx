import { SyntheticEvent, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Diagnosis, EntryFormValues, HealthCheckRating } from "../../types";

type EntryType = EntryFormValues["type"];

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: EntryFormValues) => Promise<boolean>;
  error?: string;
}

const AddEntryForm = ({ diagnoses, onSubmit, error }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const buildEntry = (): EntryFormValues => {
    const base = { description, date, specialist, diagnosisCodes };
    switch (type) {
      case "HealthCheck":
        return { ...base, type, healthCheckRating };
      case "OccupationalHealthcare":
        return {
          ...base,
          type,
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd ? { startDate: sickLeaveStart, endDate: sickLeaveEnd } : undefined,
        };
      case "Hospital":
        return { ...base, type, discharge: { date: dischargeDate, criteria: dischargeCriteria } };
    }
  };

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const ok = await onSubmit(buildEntry());
    if (ok) {
      setDescription("");
      setDate("");
      setSpecialist("");
      setDiagnosisCodes([]);
    }
  };

  const onCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box sx={{ border: "1px dashed", padding: 2, marginY: 2 }}>
      <Typography variant="h6">New entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submit}>
        <InputLabel>Type</InputLabel>
        <Select fullWidth value={type} onChange={({ target }) => setType(target.value as EntryType)}>
          <MenuItem value="HealthCheck">Health check</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational healthcare</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
        <TextField label="Description" fullWidth margin="dense" value={description} onChange={({ target }) => setDescription(target.value)} />
        <InputLabel>Date</InputLabel>
        <Input type="date" fullWidth value={date} onChange={({ target }) => setDate(target.value)} />
        <TextField label="Specialist" fullWidth margin="dense" value={specialist} onChange={({ target }) => setSpecialist(target.value)} />
        <InputLabel>Diagnosis codes</InputLabel>
        <Select multiple fullWidth value={diagnosisCodes} onChange={onCodesChange}>
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} {d.name}
            </MenuItem>
          ))}
        </Select>

        {type === "HealthCheck" && (
          <>
            <InputLabel>Health check rating</InputLabel>
            <Select
              fullWidth
              value={healthCheckRating}
              onChange={({ target }) => setHealthCheckRating(Number(target.value) as HealthCheckRating)}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical risk</MenuItem>
            </Select>
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField label="Employer" fullWidth margin="dense" value={employerName} onChange={({ target }) => setEmployerName(target.value)} />
            <InputLabel>Sick leave start</InputLabel>
            <Input type="date" fullWidth value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)} />
            <InputLabel>Sick leave end</InputLabel>
            <Input type="date" fullWidth value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)} />
          </>
        )}

        {type === "Hospital" && (
          <>
            <InputLabel>Discharge date</InputLabel>
            <Input type="date" fullWidth value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} />
            <TextField
              label="Discharge criteria"
              fullWidth
              margin="dense"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
          Add
        </Button>
      </form>
    </Box>
  );
};

export default AddEntryForm;
