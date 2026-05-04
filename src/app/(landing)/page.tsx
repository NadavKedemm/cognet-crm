'use client';

import { useEffect } from 'react';
import Hero from '@/components/landing/Hero';
import Syllabus from '@/components/landing/Syllabus';
import Audience from '@/components/landing/Audience';
import Instructor from '@/components/landing/Instructor';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import RegistrationForm from '@/components/landing/RegistrationForm';
import Footer from '@/components/landing/Footer';
import { setupScrollTracking, setupAutoFlush } from '@/lib/analytics';

export default function LandingPage() {
  useEffect(() => {
    const cleanupScroll = setupScrollTracking();
    const cleanupFlush = setupAutoFlush();
    return () => {
      cleanupScroll?.();
      cleanupFlush?.();
    };
  }, []);

  return (
    <main>
      <Hero />
      <Syllabus />
      <Audience />
      <Instructor />
      <Testimonials />
      <Pricing />
      <FAQ />
      <RegistrationForm />
      <Footer />
    </main>
  );
}
