import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to admin dashboard.",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)] flex items-center justify-center px-6">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(218,255,1)] rounded-full filter blur-[150px] opacity-5" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(127,74,142)] rounded-full filter blur-[150px] opacity-5" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[rgb(218,255,1)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-[rgb(161,161,170)]">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(161,161,170)]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fahmy@admin.com"
                  required
                  className="pl-12 bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(161,161,170)]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 pr-12 bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(161,161,170)] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] font-semibold py-6 rounded-xl disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[rgb(38,40,42)] rounded-xl">
            <p className="text-[rgb(161,161,170)] text-sm text-center">
              <span className="text-white font-medium">Demo:</span> fahmy@admin.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
