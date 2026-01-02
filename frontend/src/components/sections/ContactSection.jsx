import React, { useState } from 'react';
import { Mail, Send, MapPin, MessageCircle, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useData } from '../../data/DataContext';
import { toast } from '../../hooks/use-toast';

// EmailJS Configuration - Replace with your actual keys from emailjs.com
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add your email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Service ID, Template ID, and Public Key
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

const ContactSection = () => {
  const { profile } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: profile?.name || 'Fahmy',
        to_email: profile?.email || 'fahmy@example.com',
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      toast({
        title: "Message Sent! ✓",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Email sending failed:', error);
      toast({
        title: "Failed to send",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!profile) return null;

  return (
    <section id="contact" className="py-24 bg-[rgb(26,28,30)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)] text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Contact Information
              </h3>
              <p className="text-[rgb(218,218,218)] mb-8">
                I'm always open to discussing new opportunities, collaborations, or just having a chat about Web3 and blockchain technology.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-4 bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-xl hover:border-[rgb(218,255,1)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center group-hover:bg-[rgb(218,255,1)] transition-colors">
                  <Mail className="w-5 h-5 text-[rgb(218,255,1)] group-hover:text-[rgb(17,17,19)] transition-colors" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-sm">Email</p>
                  <p className="text-white">{profile.email}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[rgb(161,161,170)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <div className="flex items-center gap-4 p-4 bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[rgb(218,255,1)]" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-sm">Discord</p>
                  <p className="text-white">{profile.socialLinks?.discord}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-[rgba(218,255,1,0.1)] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[rgb(218,255,1)]" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-sm">Location</p>
                  <p className="text-white">{profile.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)]"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)]"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                  rows={5}
                  className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white placeholder:text-[rgb(161,161,170)] focus:border-[rgb(218,255,1)] focus:ring-[rgba(218,255,1,0.1)] resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] font-semibold py-6 rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
