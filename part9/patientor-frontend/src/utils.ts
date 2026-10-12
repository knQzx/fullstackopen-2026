import axios from "axios";

export const errorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    const data: unknown = e.response?.data;
    if (typeof data === "string") {
      return data.replace("Something went wrong. Error: ", "");
    }
    if (data && typeof data === "object" && "error" in data) {
      const error = data.error;
      if (Array.isArray(error)) {
        return error
          .map((issue: { path?: string[]; message?: string }) => `${issue.path?.join(".") ?? ""}: ${issue.message ?? ""}`)
          .join(", ");
      }
      if (typeof error === "string") {
        return error;
      }
    }
    return "Unrecognized axios error";
  }
  return "Unknown error";
};
