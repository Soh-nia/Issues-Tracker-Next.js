'use server';

import prisma from '@/lib/prisma';
import { patchIssueSchema, issueSchema } from '@/app/validationSchemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

export interface MinimalUser {
    id: string;
    name: string | null;
    email: string | null;
}

export async function createIssue(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session?.user?.id) {
        return {
            message: 'You must be signed in to create an issue.',
        };
    }

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
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });
        if (!user) {
            return {
                message: 'User not found. Cannot create issue.',
            };
        }

        await prisma.issue.create({
            data: {
                title,
                description,
                status: status || 'OPEN',
                createdByUserId: session.user.id,
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

export async function updateIssue(
    id: string,
    redirectTo: string | undefined,
    prevState: State,
    formData: FormData
): Promise<State> {
    const session = await auth();
    if (!session?.user?.id) {
        return {
            message: 'You must be signed in to update an issue.',
        };
    }

    const validatedFields = patchIssueSchema.safeParse({
        title: formData.get('title') || undefined,
        description: formData.get('description') || undefined,
        status: formData.get('status') || undefined,
        assignedToUserId: formData.get('assignedToUserId') === '' ? null : formData.get('assignedToUserId') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Issue.',
        };
    }

    const { title, description, status, assignedToUserId } = validatedFields.data;

    // Check if there's anything to update
    if (!title && !description && !status && assignedToUserId === undefined) {
        return { message: 'No fields provided to update.' };
    }

    const issue = await prisma.issue.findFirst({
        where: {
            id: parseInt(id),
            createdByUserId: session.user.id,
        },
    });

    if (!issue) {
        return { message: 'Issue not found or you do not have permission to update it.' };
    }

    if (assignedToUserId && assignedToUserId !== session.user.id) {
        return { message: 'You can only assign this issue to yourself.' };
    }

    try {
        await prisma.issue.update({
            where: { id: issue.id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(assignedToUserId !== undefined && { assignedToUserId }),
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Update Issue.',
        };
    }

    revalidatePath('/dashboard/issues/list');
    revalidatePath(`/dashboard/issues/${id}`);

    if (redirectTo) {
        redirect(redirectTo);
    }

    return { message: null };
}

export async function deleteIssue(id: string): Promise<State> {
    const session = await auth();
    if (!session?.user?.id) {
        return {
            message: 'You must be signed in to delete an issue.',
        };
    }

    const issue = await prisma.issue.findFirst({
        where: {
            id: parseInt(id),
            createdByUserId: session.user.id,
        },
    });

    if (!issue) {
        return {
            message: 'Issue not found or you do not have permission to delete it.',
        };
    }

    try {
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

export async function getCurrentUser(): Promise<MinimalUser | null> {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, name: true, email: true },
        });
        return user;
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' });
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        console.log('FormData received:', Object.fromEntries(formData));
        await signIn('credentials', formData);
        return 'Login successful';
    } catch (error) {
        console.error('Authenticate error:', error);
        if (error instanceof AuthError) {
            console.log('AuthError type:', error.type, 'Message:', error.message);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                case 'CallbackRouteError':
                    const causeMessage = error.cause?.err?.message || error.message;
                    if (causeMessage.includes('No user found') || causeMessage.includes('Invalid password')) {
                        return 'Invalid credentials.';
                    }
                    return `Callback error: ${causeMessage}`;
                default:
                    return `Something went wrong: ${error.message}`;
            }
        }
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            return undefined;
        }
        return 'Unexpected error occurred.';
    }
}