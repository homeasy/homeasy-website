/** Job applications: shared by the form and the admin. No server imports. */
export const APPLICATION_STATUSES = [
  { id: "new", label: "New" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "offered", label: "Offered" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Not selected" },
] as const;
export const applicationStatusLabel = (id: string) => APPLICATION_STATUSES.find((s) => s.id === id)?.label ?? id;

export const EXPERIENCE_OPTIONS = ["Student", "Fresher", "Less than 1 year", "1 to 3 years", "More than 3 years"] as const;
export const GENERAL_ROLE = "Other / general application";

/** Resume: PDF or Word, up to 3 MB (the hosting platform refuses request bodies above about 4.5 MB). */
export const RESUME_MAX_BYTES = 3 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export type ApplicationResult = { ok: true; ref: string } | { ok: false; errors?: Record<string, string>; message?: string } | undefined;
