import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { useData } from '../../data/DataContext';

const ExperienceSection = () => {
  const { experiences } = useData();
  
  return (
    <section id="experience" className="py-24 bg-[rgb(17,17,19)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
            Career Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work Experience
          </h2>
          <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
            My professional journey in the Web3 and blockchain ecosystem
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[rgb(218,255,1)] via-[rgb(63,63,63)] to-transparent" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[rgb(218,255,1)] -translate-x-1/2 mt-2 shadow-lg shadow-[rgba(218,255,1,0.3)]" />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'} pl-8 md:pl-0`}>
                  <div
                    className={`bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[rgb(218,255,1)] transition-all duration-300 group`}
                  >
                    {/* Header */}
                    <div className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <div className="w-12 h-12 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgb(218,255,1)] transition-colors">
                        <Briefcase className="w-6 h-6 text-[rgb(218,255,1)] group-hover:text-[rgb(17,17,19)] transition-colors" />
                      </div>
                      <div className={index % 2 === 0 ? '' : 'md:text-right'}>
                        <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                        <p className="text-[rgb(218,255,1)]">{exp.company}</p>
                      </div>
                    </div>

                    {/* Period */}
                    <div className={`flex items-center gap-2 text-[rgb(161,161,170)] text-sm mb-4 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>

                    {/* Description */}
                    <p className="text-[rgb(218,218,218)] mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Tags */}
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
