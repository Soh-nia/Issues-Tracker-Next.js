'use client';

import { Lusitana } from 'next/font/google';
import { useActionState, useEffect } from 'react';
import { authenticate } from '@/app/lib/action';
import { useSearchParams, useRouter } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import Link from 'next/link';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'] });

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  // Redirect on successful login (when no error and not pending)
  useEffect(() => {
    if (!isPending && !errorMessage) {
      router.push(callbackUrl);
    }
  }, [isPending, errorMessage, callbackUrl, router]);

  return (
    <div className="hero bg-base-200 min-h-screen p-10">
      <div className="hero-content flex-col md:flex-row-reverse">
        <div className="text-center lg:text-left md:w-2/6 hidden md:block md:p-5">
          <h1 className={`text-5xl font-bold text-center ${lusitana.className}`}>Log In!</h1>
          <p className="py-6 text-2xl md:leading-normal text-center">
            <span className={`font-bold text-primary-content ${lusitana.className}`}>Welcome to Issuer!</span>
            {' '}This is an example of an Issue Tracker App, brought to you by Issuer.
          </p>
        </div>
        <div className="card bg-base-100 w-full md:max-w-xl shrink-0 shadow-2xl md:w-4/6 py-10">
          <div className="card-body">
            {errorMessage && (
                <div role="alert" className="alert alert-error mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
            )}
            <form action={formAction}>
              <fieldset className="fieldset w-full space-y-4">
                <div>
                  <label htmlFor="email" className="fieldset-label text-lg font-semibold text-base-content">Email</label>
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
                  <label htmlFor="password" className="fieldset-label text-lg font-semibold text-base-content">Password</label>
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
                  disabled={isPending}
                  className="mt-4 btn items-center border bg-accent rounded-lg px-6 py-3 font-semibold text-accent-content hover:text-base-content transition-colors text-base"
                >
                  <svg aria-label="Email icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="black">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  Login {isPending && <Spinner />}
                </button>
                <div className="text-base mt-2">
                  Not registered yet? <Link href="/signup" className="link link-hover font-medium">Sign up</Link>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;