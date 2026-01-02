import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ResearchSection from '../components/sections/ResearchSection';
import ValidatorSection from '../components/sections/ValidatorSection';
import BlogPreview from '../components/sections/BlogPreview';
import ContactSection from '../components/sections/ContactSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[rgb(17,17,19)]">
      <Header />
      <main>
        <HeroSection />
        <ExperienceSection />
        <ResearchSection />
        <ValidatorSection />
        <BlogPreview />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
