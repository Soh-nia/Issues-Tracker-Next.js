import { z } from "zod";

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required.").max(255),
    description: z
        .string()
        .min(1, "Description is required.")
        .max(65535),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).default("OPEN"),
});

export const patchIssueSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required.")
        .max(255)
        .optional(),
    description: z
        .string()
        .min(1, "Description is required.")
        .max(65535)
        .optional(),
    assignedToUserId: z
        .string()
        .min(1, "AssignedToUserId is required.")
        .max(255)
        .optional()
        .nullable(),
});

export const userSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(255, "Name must be 255 characters or less."),
    email: z
        .string()
        .min(1, "Email is required.")
        .email("Invalid email format.")
        .max(254, "Email must be 254 characters or less."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(255, "Password must be 255 characters or less.")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number."
        ),
});