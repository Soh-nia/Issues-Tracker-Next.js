import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

// Define type for Google profile
interface GoogleProfile {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
}

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

                return { id: user.id, name: user.name, email: user.email, image: user.image || null };
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google" && profile?.email) {
                // Check if user exists, create if not
                let user = await prisma.user.findUnique({
                    where: { email: profile.email },
                });

                const googleProfile = profile as GoogleProfile;

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            id: googleProfile.sub || undefined,
                            name: googleProfile.name || (googleProfile.email ? googleProfile.email.split('@')[0] : 'User'),
                            email: googleProfile.email,
                            image: googleProfile.picture,
                        },
                    });
                } else if (!user.image && googleProfile.picture) {
                    // Update image if user exists but has no image
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { image: googleProfile.picture },
                    });
                }

                // Ensure Account entry exists
                const existingAccount = await prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: "google",
                            providerAccountId: account.providerAccountId,
                        },
                    },
                });

                if (!existingAccount) {
                    await prisma.account.create({
                        data: {
                            userId: user.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        },
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string;
                session.user.image = token.image as string | null;
            }
            return session;
        },
    },
});