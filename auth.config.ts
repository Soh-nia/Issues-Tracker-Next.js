// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            // Protect /dashboard routes: require login
            if (isOnDashboard && !isLoggedIn) {
                return false;
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;