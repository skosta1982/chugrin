export type Resume = {
  name: string;
  title: string;
  location: string;
  summary: string;
  email: string;
  phone: string;
  links: string[];
  experience: { period: string; role: string; company: string; text: string }[];
  skills: string[];
};

export const RESUME_STORAGE_KEY = "resume-data-v1";

export const resumeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name", "title", "location", "summary", "email", "phone", "links", "experience", "skills"],
  properties: {
    name: { type: "string" },
    title: { type: "string" },
    location: { type: "string" },
    summary: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    links: { type: "array", items: { type: "string" } },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["period", "role", "company", "text"],
        properties: {
          period: { type: "string" },
          role: { type: "string" },
          company: { type: "string" },
          text: { type: "string" },
        },
      },
    },
    skills: { type: "array", items: { type: "string" } },
  },
} as const;
