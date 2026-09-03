import React from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = {
  title: 'Sign In | FitPulse SDG 3 Smart Fitness',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
