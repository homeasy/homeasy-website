/**
 * The page-specific questions on the four solution enquiry forms (PRD §10.2 B2B, §10.3 government).
 * Name, mobile, email, organisation, city, message and consent come from EnquiryFormBase itself.
 */
import type { ExtraField } from "@/lib/enquiries/schema";

export const DESIGNER_FIELDS: ExtraField[] = [
  { name: "projects_per_year", label: "Projects per year", type: "select", options: ["1 to 5", "6 to 15", "16 to 30", "More than 30"] },
];

export const BUILDER_FIELDS: ExtraField[] = [
  { name: "project_type", label: "Project type", type: "select", options: ["Residential", "Office", "Retail", "Hostel or PG", "Other"], required: true },
  { name: "project_size", label: "Number of units or area (sq ft)", type: "text", placeholder: "For example: 48 flats", required: true },
  { name: "project_stage", label: "Project stage", type: "select", options: ["Under construction", "Finishing", "Ready to move", "Occupied"] },
];

export const ELECTRICIAN_FIELDS: ExtraField[] = [
  { name: "experience_years", label: "Years of experience", type: "number", placeholder: "For example: 8", required: true },
];

export const GOVERNMENT_FIELDS: ExtraField[] = [
  { name: "designation", label: "Designation", type: "text", required: true },
  {
    name: "building_type",
    label: "Building type",
    type: "select",
    options: ["Government quarters", "Hostel", "Office", "School or college", "Hospital or health centre", "Guest house", "Other"],
    required: true,
  },
  { name: "scale", label: "Approximate scale", type: "text", placeholder: "For example: 2 buildings, 120 rooms" },
  { name: "timeline", label: "Timeline", type: "select", options: ["Within 3 months", "3 to 6 months", "6 to 12 months", "Not decided yet"] },
];
