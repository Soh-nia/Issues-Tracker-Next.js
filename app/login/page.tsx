import React from 'react';
import Navbar from '../Navbar';
import LoginForm from './LoginForm';
import { Suspense } from 'react';


const LoginPage = () => {
  return (
    <main className="">
      <Navbar />
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

export default LoginPage;
