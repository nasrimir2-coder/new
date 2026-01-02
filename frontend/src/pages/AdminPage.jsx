import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Server,
  PenSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import {
  profileData as initialProfile,
  experienceData as initialExperience,
  researchData as initialResearch,
  validatorData as initialValidators,
  postsData as initialPosts
} from '../data/mock';

// Secret paths
const SECRET_LOGIN_PATH = '/fahmy-secure-auth';

const AdminPage = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Local state for data management (mock - will be replaced with backend)
  const [profile, setProfile] = useState(initialProfile);
  const [experiences, setExperiences] = useState(initialExperience);
  const [research, setResearch] = useState(initialResearch);
  const [validators, setValidators] = useState(initialValidators);
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(SECRET_LOGIN_PATH);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(17,17,19)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'research', label: 'Research', icon: FileText },
    { id: 'validators', label: 'Validators', icon: Server },
    { id: 'posts', label: 'Blog Posts', icon: PenSquare }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (section) => {
    toast({
      title: 'Saved!',
      description: `${section} has been updated successfully.`
    });
  };

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[rgb(26,28,30)] border-r border-[rgb(63,63,63)] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[rgb(63,63,63)]">
            <Link to="/" className="text-xl font-bold text-white">
              Fahmy<span className="text-[rgb(218,255,1)]">.web3</span>
            </Link>
            <p className="text-[rgb(161,161,170)] text-sm mt-1">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)]'
                    : 'text-[rgb(218,218,218)] hover:bg-[rgb(38,40,42)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-[rgb(63,63,63)]">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[rgba(218,255,1,0.1)] flex items-center justify-center">
                <User className="w-5 h-5 text-[rgb(218,255,1)]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-[rgb(161,161,170)] text-xs">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[rgb(17,17,19)]/95 backdrop-blur-md border-b border-[rgb(63,63,63)]">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-white capitalize">
                {activeTab}
              </h1>
            </div>
            <Link to="/" className="text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)] text-sm">
              View Site →
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardContent posts={posts} validators={validators} />}
          {activeTab === 'profile' && <ProfileContent profile={profile} setProfile={setProfile} onSave={() => handleSave('Profile')} />}
          {activeTab === 'experience' && <ExperienceContent experiences={experiences} setExperiences={setExperiences} onSave={() => handleSave('Experience')} />}
          {activeTab === 'research' && <ResearchContent research={research} setResearch={setResearch} onSave={() => handleSave('Research')} />}
          {activeTab === 'validators' && <ValidatorsContent validators={validators} setValidators={setValidators} onSave={() => handleSave('Validators')} />}
          {activeTab === 'posts' && <PostsContent posts={posts} setPosts={setPosts} onSave={() => handleSave('Posts')} />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content
const DashboardContent = ({ posts, validators }) => {
  const stats = [
    { label: 'Blog Posts', value: posts.length, color: 'rgb(218,255,1)' },
    { label: 'Active Validators', value: validators.filter(v => v.status === 'active').length, color: 'rgb(127,74,142)' },
    { label: 'Total Networks', value: validators.length, color: 'rgb(74,142,127)' },
    { label: 'Published', value: posts.filter(p => p.published).length, color: 'rgb(142,74,127)' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
            <p className="text-[rgb(161,161,170)] text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Add Experience', 'New Research', 'Add Validator', 'Write Post'].map((action) => (
            <button
              key={action}
              className="flex items-center gap-3 p-4 bg-[rgb(38,40,42)] rounded-xl hover:bg-[rgba(218,255,1,0.1)] hover:text-[rgb(218,255,1)] text-[rgb(218,218,218)] transition-colors"
            >
              <Plus className="w-5 h-5" />
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Content
const ProfileContent = ({ profile, setProfile, onSave }) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Tagline</label>
            <Input
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Bio</label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Location</label>
            <Input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <Button onClick={onSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Experience Content
const ExperienceContent = ({ experiences, setExperiences, onSave }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Work Experience</h3>
        <Button className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      {experiences.map((exp) => (
        <div key={exp.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-medium">{exp.title}</h4>
              <p className="text-[rgb(218,255,1)] text-sm">{exp.company}</p>
              <p className="text-[rgb(161,161,170)] text-sm">{exp.period}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Research Content
const ResearchContent = ({ research, setResearch, onSave }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Research & Papers</h3>
        <Button className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          Add Research
        </Button>
      </div>
      {research.map((r) => (
        <div key={r.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-medium">{r.title}</h4>
              <p className="text-[rgb(161,161,170)] text-sm mt-1">{r.abstract.slice(0, 100)}...</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Validators Content
const ValidatorsContent = ({ validators, setValidators, onSave }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Node Validators</h3>
        <Button className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          Add Validator
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {validators.map((v) => (
          <div key={v.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <h4 className="text-white font-medium">{v.network}</h4>
                  <p className="text-[rgb(161,161,170)] text-sm">{v.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${v.status === 'active' ? 'bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)]' : 'bg-[rgb(38,40,42)] text-[rgb(161,161,170)]'}`}>
                {v.status}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Posts Content
const PostsContent = ({ posts, setPosts, onSave }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Blog Posts</h3>
        <Button className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{post.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs ${post.published ? 'bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)]' : 'bg-[rgb(38,40,42)] text-[rgb(161,161,170)]'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-[rgb(161,161,170)] text-sm">{post.excerpt.slice(0, 80)}...</p>
              <p className="text-[rgb(161,161,170)] text-xs mt-2">{new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
