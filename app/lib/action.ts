'use server'

import prisma from '@/lib/prisma';
import { issueSchema } from '@/app/validationSchemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
        title?: string[];
        description?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createIssue(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = issueSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Issue.',
        };
    }

    // Prepare data for insertion into the database
    const { title, description, status } = validatedFields.data;
    try {
        await prisma.issue.create({
            data: {
                title,
                description,
                status: status || "OPEN",
            },
        });
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to Create Issue.",
        };
    }

    revalidatePath('/dashboard/issues/list');
    redirect('/dashboard/issues/list');

    return { message: "Issue Created Successfully." };
}