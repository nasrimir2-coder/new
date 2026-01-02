import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useData } from '../data/DataContext';
import { uploadAPI } from '../services/api';

const BlogPage = () => {
  const { posts, loading } = useData();
  const publishedPosts = posts?.filter(p => p.published) || [];

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(17,17,19)] flex items-center justify-center">
        <div className="text-[rgb(218,255,1)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)]">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[rgb(218,255,1)] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
              Articles
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Articles
            </h1>
            <p className="text-[rgb(161,161,170)] text-lg">
              Thoughts, tutorials, and insights on Web3, blockchain technology, and validator operations.
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {publishedPosts.map((post) => {
              const imageUrl = post.image ? uploadAPI.getFullUrl(post.image) : null;
              
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group block bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl overflow-hidden hover:border-[rgb(218,255,1)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {imageUrl && (
                      <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
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
                      <p className="text-[rgb(218,218,218)] leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.slice(0, 3).map((tag) => (
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
                        Read Full Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {publishedPosts.length === 0 && (
            <div className="text-center py-16 bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-[rgb(161,161,170)] text-lg mb-2">
                No posts published yet.
              </p>
              <p className="text-[rgb(161,161,170)] text-sm">
                Check back soon for new articles!
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
