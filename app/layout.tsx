import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Home Workout – Smart Fitness Management System | SDG 3',
  description:
    'An accessible, equipment-free bodyweight fitness management system aligned with UN Sustainable Development Goal 3 (Good Health and Well-being). Track workouts, calculate MET calories, and build healthy habits.',
  keywords: [
    'Home Workout',
    'SDG 3',
    'Good Health and Well-being',
    'Calisthenics',
    'Bodyweight Exercises',
    'Fitness Tracker',
    'MET Calories',
    'Pushups',
    'Squats',
    'Planks',
  ],
  authors: [{ name: 'FitPulse SDG 3 Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-dark-bg text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-dark-bg">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
