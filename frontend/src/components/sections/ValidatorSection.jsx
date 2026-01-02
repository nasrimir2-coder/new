import React from 'react';
import { Server, Activity, Clock, Zap } from 'lucide-react';
import { useData } from '../../data/DataContext';
import { uploadAPI } from '../../services/api';

const ValidatorSection = () => {
  const { validators } = useData();
  const activeCount = validators.filter(v => v.status === 'active').length;

  return (
    <section id="validators" className="py-24 bg-[rgb(17,17,19)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
            Infrastructure
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Node Validators
          </h2>
          <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
            Currently operating {activeCount} active validator nodes across multiple blockchain networks
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Nodes', value: validators.length, icon: Server },
            { label: 'Active', value: activeCount, icon: Activity },
            { label: 'Avg Uptime', value: '99.96%', icon: Zap },
            { label: 'Since', value: '2022', icon: Clock }
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-[rgb(218,255,1)] mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[rgb(161,161,170)] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Validator Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validators.map((validator) => {
            const imageUrl = validator.image ? uploadAPI.getFullUrl(validator.image) : null;
            
            return (
              <div
                key={validator.id}
                data-testid={`validator-card-${validator.id}`}
                className={`bg-[rgb(26,28,30)] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  validator.status === 'active'
                    ? 'border-[rgb(63,63,63)] hover:border-[rgb(218,255,1)]'
                    : 'border-[rgb(63,63,63)] opacity-60'
                }`}
              >
                {/* Featured Image */}
                {imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={validator.network}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${validator.color}20` }}
                      >
                        {validator.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{validator.network}</h3>
                        <p className="text-[rgb(161,161,170)] text-sm">{validator.type}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        validator.status === 'active'
                          ? 'bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)]'
                          : 'bg-[rgb(38,40,42)] text-[rgb(161,161,170)]'
                      }`}
                    >
                      {validator.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[rgb(161,161,170)] text-sm">Stake</span>
                      <span className="text-white font-medium">{validator.stake}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[rgb(161,161,170)] text-sm">Uptime</span>
                      <span className={`font-medium ${
                        validator.status === 'active' ? 'text-[rgb(218,255,1)]' : 'text-[rgb(161,161,170)]'
                      }`}>
                        {validator.uptime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[rgb(161,161,170)] text-sm">Running Since</span>
                      <span className="text-white">{validator.since}</span>
                    </div>
                  </div>

                  {/* Progress Bar for Uptime */}
                  {validator.status === 'active' && (
                    <div className="mt-6">
                      <div className="h-1.5 bg-[rgb(38,40,42)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[rgb(218,255,1)] rounded-full transition-all duration-500"
                          style={{ width: validator.uptime }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValidatorSection;
