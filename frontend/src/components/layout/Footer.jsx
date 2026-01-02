import React from 'react';
import { Github, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react';
import { useData } from '../../data/DataContext';

const Footer = () => {
  const { profile } = useData();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: profile.socialLinks?.twitter, label: 'Twitter' },
    { icon: Github, href: profile.socialLinks?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Send, href: profile.socialLinks?.telegram, label: 'Telegram' }
  ];

  return (
    <footer className="bg-[rgb(26,28,30)] border-t border-[rgba(255,255,255,0.1)] mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Fahmy<span className="text-[rgb(218,255,1)]">.web3</span>
            </h3>
            <p className="text-[rgb(161,161,170)] mb-6 max-w-md">
              Web3 Researcher & Node Validator. Building the decentralized future through infrastructure and research.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[rgb(38,40,42)] flex items-center justify-center text-[rgb(161,161,170)] hover:bg-[rgb(218,255,1)] hover:text-[rgb(17,17,19)] transition-all duration-200 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Experience', 'Research', 'Validators', 'Blog'].map((link) => (
                <li key={link}>
                  <a
                    href={`/#${link.toLowerCase()}`}
                    className="text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] transition-colors"
                >
                  {profile.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-[rgb(161,161,170)]">
                <MessageCircle className="w-4 h-4" />
                {profile.socialLinks?.discord}
              </li>
              <li className="text-[rgb(161,161,170)]">
                {profile.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[rgb(161,161,170)] text-sm">
            © {currentYear} Fahmy. All rights reserved.
          </p>
          <p className="text-[rgb(161,161,170)] text-sm">
            Built with passion for Web3 🌐
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
