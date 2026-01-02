import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { postsData } from '../data/mock';

const BlogPage = () => {
  const publishedPosts = postsData.filter(p => p.published);

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)]">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Articles
            </h1>
            <p className="text-[rgb(161,161,170)] text-lg">
              Thoughts, tutorials, and insights on Web3, blockchain technology, and validator operations.
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {publishedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[rgb(218,255,1)] transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Content */}
                  <div className="flex-grow">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-[rgb(161,161,170)] text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-[rgb(218,255,1)] transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[rgb(218,218,218)] leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
              </Link>
            ))}
          </div>

          {publishedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[rgb(161,161,170)] text-lg">
                No posts published yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
