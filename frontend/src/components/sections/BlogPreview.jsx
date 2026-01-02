import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { postsData } from '../../data/mock';

const BlogPreview = () => {
  const latestPosts = postsData.filter(p => p.published).slice(0, 3);

  return (
    <section className="py-24 bg-[rgb(17,17,19)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
              Latest Posts
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Articles
            </h2>
            <p className="text-[rgb(161,161,170)] max-w-xl">
              Thoughts and tutorials on Web3, blockchain, and validator operations
            </p>
          </div>
          <Link to="/blog" className="mt-6 md:mt-0">
            <Button
              variant="ghost"
              className="text-[rgb(218,255,1)] hover:bg-[rgba(218,255,1,0.1)] gap-2"
            >
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl overflow-hidden hover:border-[rgb(218,255,1)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-[rgb(218,255,1)] to-[rgb(127,74,142)]" />

              <div className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-[rgb(161,161,170)] text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[rgb(218,255,1)] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[rgb(218,218,218)] text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <div className="flex items-center gap-2 mt-6 text-[rgb(218,255,1)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
