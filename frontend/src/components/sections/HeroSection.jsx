import React from 'react';
import { ArrowDown, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '../ui/button';
import { useData } from '../../data/DataContext';

const HeroSection = () => {
  const { profile } = useData();
  
  const scrollToExperience = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[rgb(17,17,19)]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(218,255,1,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(218,255,1,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(218,255,1)] rounded-full filter blur-[150px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(127,74,142)] rounded-full filter blur-[150px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[rgb(218,255,1)] animate-pulse" />
            <span className="text-[rgb(218,218,218)] text-sm">Available for collaboration</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Hi, I'm{' '}
            <span className="text-[rgb(218,255,1)]">{profile.name}</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[rgb(218,218,218)] mb-4">
            {profile.tagline}
          </p>

          {/* Bio */}
          <p className="text-[rgb(161,161,170)] max-w-2xl mb-10 text-lg leading-relaxed">
            {profile.bio}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              onClick={scrollToExperience}
              className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] font-semibold px-8 py-6 text-lg rounded-xl"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[rgb(63,63,63)] text-white hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)] px-8 py-6 text-lg rounded-xl bg-transparent"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: Twitter, href: profile.socialLinks?.twitter },
              { icon: Github, href: profile.socialLinks?.github },
              { icon: Linkedin, href: profile.socialLinks?.linkedin }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] flex items-center justify-center text-[rgb(161,161,170)] hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)] transition-all duration-200"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-6 h-6 text-[rgb(161,161,170)]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
