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

/** Resume: PDF or Word, up to 2 MB. Photo: passport-size JPG or PNG, up to 200 KB. */
export const RESUME_MAX_BYTES = 2 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
export const PHOTO_MAX_BYTES = 200 * 1024;
export const PHOTO_TYPES: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

export const RESUME_HINT = "PDF or Word file (.pdf, .doc, .docx), maximum 2 MB.";
export const PHOTO_HINT = "Passport-size photo, JPG or PNG, maximum 200 KB.";
export const RESUME_TOO_BIG = "This file is larger than 2 MB. Please upload your resume within 2 MB.";
export const PHOTO_TOO_BIG = "This photo is larger than 200 KB. Please upload a photo within 200 KB.";
export const RESUME_WRONG_TYPE = "The resume must be a PDF or Word file (.pdf, .doc, .docx), within 2 MB.";
export const PHOTO_WRONG_TYPE = "The photo must be a JPG or PNG image, within 200 KB.";

export type ApplicationResult = { ok: true; ref: string } | { ok: false; errors?: Record<string, string>; message?: string } | undefined;
