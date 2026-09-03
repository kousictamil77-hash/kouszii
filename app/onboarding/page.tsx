import React from 'react';
import { OnboardingForm } from '@/components/OnboardingForm';

export const metadata = {
  title: 'Personalize Your Profile | FitPulse SDG 3',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <OnboardingForm />
    </div>
  );
}
