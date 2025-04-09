import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const email = (credentials.email as string).toLowerCase();
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.password) {
                    throw new Error("Password not set for this user");
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error("Invalid password");
                }

                // return { id: user.id, name: user.name, email: user.email };
                return { id: user.id.toString(), name: user.name, email: user.email, image: user.image || null };

            },
        }),
    ],
    session: {
        strategy: "jwt", // Use JWT for session management
    },
    secret: process.env.AUTH_SECRET, // Required for signing JWTs
});