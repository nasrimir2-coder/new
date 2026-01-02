import React from 'react';
import { FileText, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { researchData } from '../../data/mock';

const ResearchSection = () => {
  return (
    <section id="research" className="py-24 bg-[rgb(26,28,30)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
            Publications
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Research & Papers
          </h2>
          <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
            My contributions to blockchain research and academic publications
          </p>
        </div>

        {/* Research Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchData.map((research) => (
            <div
              key={research.id}
              className="bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[rgb(218,255,1)] transition-all duration-300 group flex flex-col"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center mb-6 group-hover:bg-[rgb(218,255,1)] transition-colors">
                <FileText className="w-7 h-7 text-[rgb(218,255,1)] group-hover:text-[rgb(17,17,19)] transition-colors" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[rgb(218,255,1)] transition-colors">
                {research.title}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 text-[rgb(161,161,170)] text-sm mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(research.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Abstract */}
              <p className="text-[rgb(218,218,218)] text-sm leading-relaxed mb-6 flex-grow">
                {research.abstract}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {research.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Read More Button */}
              <Button
                variant="ghost"
                className="w-full border border-[rgb(63,63,63)] text-white hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)] hover:bg-transparent justify-center gap-2"
              >
                Read Paper
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
