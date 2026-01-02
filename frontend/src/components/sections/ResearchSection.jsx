import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { useData } from '../../data/DataContext';
import { uploadAPI } from '../../services/api';

const ResearchSection = () => {
  const { research } = useData();
  
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
          {research.map((item) => {
            const imageUrl = item.image ? uploadAPI.getFullUrl(item.image) : null;
            
            return (
              <Link
                key={item.id}
                to={`/research/${item.id}`}
                data-testid={`research-card-${item.id}`}
                className="bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-2xl overflow-hidden hover:border-[rgb(218,255,1)] transition-all duration-300 group flex flex-col hover:-translate-y-1"
              >
                {/* Featured Image */}
                {imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-2 bg-gradient-to-r from-[rgb(218,255,1)] to-[rgb(127,74,142)]" />
                )}

                <div className="p-6 flex flex-col flex-grow">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgb(218,255,1)] transition-colors">
                      <FileText className="w-6 h-6 text-[rgb(218,255,1)] group-hover:text-[rgb(17,17,19)] transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[rgb(218,255,1)] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-[rgb(161,161,170)] text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Abstract */}
                  <p className="text-[rgb(218,218,218)] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {item.abstract}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-[rgb(218,255,1)] text-sm font-medium">
                    Read Full Paper
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
