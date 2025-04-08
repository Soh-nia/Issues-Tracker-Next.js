'use server';

import prisma from '@/lib/prisma';
import { patchIssueSchema, issueSchema } from '@/app/validationSchemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

export async function createIssue(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = issueSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Issue.',
        };
    }

    const { title, description, status } = validatedFields.data;
    try {
        await prisma.issue.create({
            data: {
                title,
                description,
                status: status || 'OPEN',
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Create Issue.',
        };
    }

    revalidatePath('/dashboard/issues/list');
    redirect('/dashboard/issues/list');

    return { message: 'Issue Created Successfully.' };
}

export async function updateIssue(id: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = patchIssueSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        assignedToUserId: formData.get('assignedToUserId') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Issue.',
        };
    }

    const { title, description, status, assignedToUserId } = validatedFields.data;

    if (assignedToUserId) {
        const user = await prisma.user.findUnique({
            where: { id: assignedToUserId },
        });
        if (!user) return { message: 'Invalid user.' };
    }

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) },
    });

    if (!issue) return { message: 'Invalid issue' };

    try {
        await prisma.issue.update({
            where: { id: issue.id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                assignedToUserId: assignedToUserId === '' ? null : assignedToUserId,
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Update Issue.',
        };
    }

    revalidatePath('/dashboard/issues/list');
    redirect('/dashboard/issues/list');
}

export async function deleteIssue(id: string): Promise<State> {
    try {
        const issue = await prisma.issue.findUnique({
            where: { id: parseInt(id) },
        });

        if (!issue) {
            return {
                message: 'Invalid issue',
            };
        }

        await prisma.issue.delete({
            where: { id: issue.id },
        });

        revalidatePath('/dashboard/issues/list');
        return { message: null };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Delete Issue.',
        };
    }
}

export async function getUsers() {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    return users;
}