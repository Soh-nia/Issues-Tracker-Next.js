'use client';

import { Lusitana } from 'next/font/google';
import { useActionState, useEffect, useState } from 'react';
import { authenticate } from '@/app/lib/action';
import { useSearchParams, useRouter } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import Link from 'next/link';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'] });

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const authError = searchParams.get('error');
  const [errorMessage, formAction, isCredentialsPending] = useActionState(authenticate, undefined);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/auth/csrf');
        if (!response.ok) {
          console.error('Failed to fetch CSRF token:', response.status, await response.text());
          setGoogleError('Failed to initialize sign-in. Please try again.');
          return;
        }
        const data = await response.json();
        console.log('CSRF Token fetched:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        setGoogleError('Failed to initialize sign-in. Please try again.');
      }
    };
    fetchCsrfToken();
  }, []);

  // Handle Auth.js errors from query params
  useEffect(() => {
    if (authError) {
      console.log('Auth.js error from query:', authError);
      setGoogleError(
        authError === 'MissingCSRF'
          ? 'Security token missing. Please try again.'
          : `Authentication error: ${authError}`
      );
    }
  }, [authError]);

  // Redirect on successful credentials login
  useEffect(() => {
    if (!isCredentialsPending && !errorMessage) {
      router.push(callbackUrl);
    }
  }, [isCredentialsPending, errorMessage, callbackUrl, router]);

  const handleGoogleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    // Do not prevent default; let the form submit to /api/auth/signin/google
    if (!csrfToken) {
      console.error('CSRF token not available');
      setGoogleError('Security token not loaded. Please refresh and try again.');
      event.preventDefault(); // Only prevent if no token
      return;
    }
    setIsGooglePending(true);
    setGoogleError(null);
    console.log('Submitting Google sign-in with CSRF token:', csrfToken);
  };

  return (
    <div className="hero bg-base-200 min-h-screen p-10">
      <div className="hero-content flex-col md:flex-row-reverse">
        <div className="text-center lg:text-left md:w-2/6 hidden md:block md:p-5">
          <h1 className={`text-5xl font-bold text-center ${lusitana.className}`}>Log In!</h1>
          <p className="py-6 text-2xl md:leading-normal text-center">
            <span className={`font-bold text-primary-content ${lusitana.className}`}>Welcome to Issuer!</span>{' '}
            This is an example of an Issue Tracker App, brought to you by Issuer.
          </p>
        </div>
        <div className="card bg-base-100 w-full md:max-w-xl shrink-0 shadow-2xl md:w-4/6 py-10">
          <div className="card-body">
            {(errorMessage || googleError) && (
              <div role="alert" className="alert alert-error mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage || googleError}</span>
              </div>
            )}
            <form action={formAction}>
              <fieldset className="fieldset w-full space-y-4">
                <div>
                  <label htmlFor="email" className="fieldset-label text-lg font-semibold text-base-content">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input input-lg w-full py-1 border-neutral-content"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="fieldset-label text-lg font-semibold text-base-content">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input input-lg w-full py-1 border-neutral-content"
                    placeholder="Password"
                  />
                </div>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <button
                  disabled={isCredentialsPending}
                  className="mt-4 btn items-center border bg-accent rounded-lg px-6 py-3 font-semibold text-accent-content hover:text-base-content transition-colors text-base"
                >
                  <svg
                    aria-label="Email icon"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="black">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  Login {isCredentialsPending && <Spinner />}
                </button>
              </fieldset>
            </form>
            <form action="/api/auth/signin/google" method="POST" onSubmit={handleGoogleSignIn} className="mt-4">
              <input type="hidden" name="csrfToken" value={csrfToken || ''} />
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <button
                type="submit"
                disabled={isGooglePending || !csrfToken}
                className="btn items-center border bg-white rounded-lg px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-colors text-base w-full"
              >
                <svg
                  aria-label="Google icon"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Sign in with Google {isGooglePending && <Spinner />}
              </button>
            </form>
            <div className="text-base mt-4 text-center">
              Not registered yet? <Link href="/signup" className="link link-hover font-medium">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;