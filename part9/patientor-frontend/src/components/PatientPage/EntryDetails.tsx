import { Box, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Diagnosis, Entry, HealthCheckRating } from "../../types";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const ratingColor = (rating: HealthCheckRating) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "yellow";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
    default:
      return assertNever(rating);
  }
};

const TypeSpecific = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Typography variant="body2">
          discharge {entry.discharge.date}: {entry.discharge.criteria}
        </Typography>
      );
    case "OccupationalHealthcare":
      return (
        <Typography variant="body2">
          employer: {entry.employerName}
          {entry.sickLeave && ` (sick leave ${entry.sickLeave.startDate} - ${entry.sickLeave.endDate})`}
        </Typography>
      );
    case "HealthCheck":
      return <FavoriteIcon sx={{ color: ratingColor(entry.healthCheckRating) }} />;
    default:
      return assertNever(entry);
  }
};

const typeIcon = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <LocalHospitalIcon />;
    case "OccupationalHealthcare":
      return <WorkIcon />;
    case "HealthCheck":
      return <MedicalServicesIcon />;
    default:
      return assertNever(entry);
  }
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
  const diagnosisName = (code: string) => diagnoses.find((d) => d.code === code)?.name;

  return (
    <Box sx={{ border: "1px solid", borderRadius: 2, padding: 1, marginBottom: 1 }}>
      <Typography>
        {entry.date} {typeIcon(entry)} {entry.type === "OccupationalHealthcare" && entry.employerName}
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnosisName(code)}
            </li>
          ))}
        </ul>
      )}
      <TypeSpecific entry={entry} />
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

export default EntryDetails;
