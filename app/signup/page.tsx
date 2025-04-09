'use client';

import Navbar from '../Navbar';
import { Lusitana } from 'next/font/google';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '@/app/components/Spinner';
import { userSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'] });

type UserFormData = z.infer<typeof userSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const response = await axios.post('/api/signup', data);
      if (response.status === 201) {
        router.push('/login');
      }
    } catch (err) {
      setSubmitting(false);
      setError('Failed to create account. Email might already exist.');
      console.error('Signup error:', err);
    }
  });

  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="hero bg-base-200 min-h-screen p-10">
        <div className="hero-content flex-col md:flex-row">
          <div className="text-center md:w-2/6 hidden md:block md:p-5 mr-10">
            <h1 className={`text-5xl font-bold text-center ${lusitana.className}`}>Get Started!</h1>
            <p className="py-6 text-2xl md:leading-normal text-center">
              <span className={`font-bold text-primary-content ${lusitana.className}`}>Welcome to Issuer!</span>
              {' '}This is an example of an Issue Tracker App, brought to you by Issuer.
            </p>
          </div>
          <div className="card bg-base-100 w-full md:max-w-xl shrink-0 shadow-2xl md:w-4/6 py-10">
            <div className="card-body">
              {error && (
                <div role="alert" className="alert alert-error mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={onSubmit}>
                <fieldset className="fieldset w-full space-y-4">
                  <div>
                    <label htmlFor="name" className="fieldset-label text-lg font-semibold text-base-content">Name</label>
                    <input
                      id="name"
                      type="text"
                      className="input input-lg w-full py-1 border-neutral-content"
                      placeholder="Name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="fieldset-label text-lg font-semibold text-base-content">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="input input-lg w-full py-1 border-neutral-content"
                      placeholder="Email"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password" className="fieldset-label text-lg font-semibold text-base-content">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="input input-lg w-full py-1 border-neutral-content"
                      placeholder="Password"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-4 btn items-center border bg-accent rounded-lg px-6 py-3 font-semibold text-accent-content hover:text-base-content transition-colors text-base"
                  >
                    <svg aria-label="Email icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="black">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    Sign Up {isSubmitting && <Spinner />}
                  </button>
                  <div className='text-base'>Have an account already? <Link href="/login" className="link link-hover font-medium">Login</Link></div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;