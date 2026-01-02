import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, User } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useData } from '../data/DataContext';
import { uploadAPI } from '../services/api';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, profile, loading } = useData();
  const [post, setPost] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    if (!loading && posts) {
      const foundPost = posts.find(p => p.id === id && p.published);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/blog');
      }
    }
  }, [id, posts, loading, navigate]);

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-[rgb(17,17,19)] flex items-center justify-center">
        <div className="text-[rgb(218,255,1)]">Loading...</div>
      </div>
    );
  }

  const imageUrl = post.image ? uploadAPI.getFullUrl(post.image) : null;

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)]">
      <Header />
      
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[rgb(218,255,1)] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-[rgb(161,161,170)]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[rgba(218,255,1,0.1)] flex items-center justify-center">
                  <User className="w-5 h-5 text-[rgb(218,255,1)]" />
                </div>
                <span className="text-white">{profile?.name || 'Fahmy'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </header>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-6 bg-[rgb(26,28,30)] border-l-4 border-[rgb(218,255,1)] rounded-r-xl">
              <p className="text-[rgb(218,218,218)] text-lg italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-[rgb(218,218,218)] leading-relaxed whitespace-pre-wrap">
              {post.content || post.excerpt}
            </div>
          </div>

          {/* Author Box */}
          <div className="mt-16 p-6 bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[rgba(218,255,1,0.1)] flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[rgb(218,255,1)]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{profile?.name || 'Fahmy'}</h3>
                <p className="text-[rgb(218,255,1)] text-sm mb-2">{profile?.tagline || 'Web3 Researcher & Node Validator'}</p>
                <p className="text-[rgb(161,161,170)] text-sm">
                  {profile?.bio?.slice(0, 150)}...
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-[rgb(63,63,63)]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[rgb(218,255,1)] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Articles
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
