import type { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
  const title = (
    <b>
      {part.name} {part.exerciseCount}
    </b>
  );

  switch (part.kind) {
    case "basic":
      return (
        <p>
          {title}
          <br />
          <i>{part.description}</i>
        </p>
      );
    case "group":
      return (
        <p>
          {title}
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          {title}
          <br />
          <i>{part.description}</i>
          <br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          {title}
          <br />
          <i>{part.description}</i>
          <br />
          required skills: {part.requirements.join(", ")}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
