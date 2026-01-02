import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Server,
  PenSquare,
  LogOut,
  Menu,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import ImageUpload from '../components/ui/ImageUpload';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../data/DataContext';
import { toast } from '../hooks/use-toast';
import { uploadAPI } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

const SECRET_LOGIN_PATH = '/fahmy-secure-auth';

const AdminPage = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-[rgb(17,17,19)] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[rgb(26,28,30)] border-r border-[rgb(63,63,63)] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[rgb(63,63,63)]">
            <Link to="/" className="text-xl font-bold text-white">
              Fahmy<span className="text-[rgb(218,255,1)]">.web3</span>
            </Link>
            <p className="text-[rgb(161,161,170)] text-sm mt-1">Admin Panel</p>
          </div>

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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64">
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

        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'profile' && <ProfileContent />}
          {activeTab === 'experience' && <ExperienceContent />}
          {activeTab === 'research' && <ResearchContent />}
          {activeTab === 'validators' && <ValidatorsContent />}
          {activeTab === 'posts' && <PostsContent />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content
const DashboardContent = () => {
  const { posts, validators } = useData();
  
  const stats = [
    { label: 'Blog Posts', value: posts.length },
    { label: 'Active Validators', value: validators.filter(v => v.status === 'active').length },
    { label: 'Total Networks', value: validators.length },
    { label: 'Published', value: posts.filter(p => p.published).length }
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
    </div>
  );
};

// Profile Content
const ProfileContent = () => {
  const { profile, updateProfile } = useData();
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = () => {
    updateProfile(formData);
    toast({ title: 'Saved!', description: 'Profile has been updated successfully.' });
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Tagline</label>
            <Input
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
            />
          </div>
          <div className="pt-4 border-t border-[rgb(63,63,63)]">
            <h4 className="text-white font-medium mb-4">Social Links</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[rgb(161,161,170)] text-sm mb-1">Twitter</label>
                <Input
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-[rgb(161,161,170)] text-sm mb-1">GitHub</label>
                <Input
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-[rgb(161,161,170)] text-sm mb-1">LinkedIn</label>
                <Input
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-[rgb(161,161,170)] text-sm mb-1">Discord</label>
                <Input
                  value={formData.socialLinks?.discord || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, discord: e.target.value } })}
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-[rgb(161,161,170)] text-sm mb-1">Telegram</label>
                <Input
                  value={formData.socialLinks?.telegram || ''}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, telegram: e.target.value } })}
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Experience Content
const ExperienceContent = () => {
  const { experiences, addExperience, updateExperience, deleteExperience } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', company: '', period: '', description: '', tags: [] });
    setTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.company) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    if (editingItem) {
      updateExperience(editingItem.id, formData);
      toast({ title: 'Updated!', description: 'Experience has been updated.' });
    } else {
      addExperience(formData);
      toast({ title: 'Added!', description: 'New experience has been added.' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteExperience(id);
      toast({ title: 'Deleted!', description: 'Experience has been removed.' });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Work Experience</h3>
        <Button onClick={openAddModal} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.map((exp) => (
        <div key={exp.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-medium">{exp.title}</h4>
              <p className="text-[rgb(218,255,1)] text-sm">{exp.company}</p>
              <p className="text-[rgb(161,161,170)] text-sm">{exp.period}</p>
              <p className="text-[rgb(218,218,218)] text-sm mt-2">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEditModal(exp)} className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <Input
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g., 2022 - Present"
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border-[rgb(63,63,63)]">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-[rgb(63,63,63)]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Research Content
const ResearchContent = () => {
  const { research, addResearch, updateResearch, deleteResearch } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    date: '',
    tags: [],
    link: '',
    image: ''
  });
  const [tagInput, setTagInput] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', abstract: '', date: new Date().toISOString().split('T')[0], tags: [], link: '', image: '' });
    setTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item, image: item.image || '' });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    if (editingItem) {
      updateResearch(editingItem.id, formData);
      toast({ title: 'Updated!', description: 'Research has been updated.' });
    } else {
      addResearch(formData);
      toast({ title: 'Added!', description: 'New research has been added.' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this research?')) {
      deleteResearch(id);
      toast({ title: 'Deleted!', description: 'Research has been removed.' });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Research & Papers</h3>
        <Button onClick={openAddModal} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          Add Research
        </Button>
      </div>

      {research.map((r) => (
        <div key={r.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-medium">{r.title}</h4>
              <p className="text-[rgb(161,161,170)] text-sm mt-1">{r.abstract}</p>
              <p className="text-[rgb(161,161,170)] text-xs mt-2">{r.date}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {r.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEditModal(r)} className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Research' : 'Add Research'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Abstract</label>
              <Textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={3}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border-[rgb(63,63,63)]">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-[rgb(63,63,63)]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Validators Content
const ValidatorsContent = () => {
  const { validators, addValidator, updateValidator, deleteValidator } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    network: '',
    status: 'active',
    type: 'Mainnet Validator',
    stake: '',
    uptime: '99.9%',
    since: '',
    icon: '◆',
    color: '#627EEA',
    image: ''
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      network: '',
      status: 'active',
      type: 'Mainnet Validator',
      stake: '',
      uptime: '99.9%',
      since: new Date().toISOString().slice(0, 7),
      icon: '◆',
      color: '#627EEA',
      image: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item, image: item.image || '' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.network) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    if (editingItem) {
      updateValidator(editingItem.id, formData);
      toast({ title: 'Updated!', description: 'Validator has been updated.' });
    } else {
      addValidator(formData);
      toast({ title: 'Added!', description: 'New validator has been added.' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this validator?')) {
      deleteValidator(id);
      toast({ title: 'Deleted!', description: 'Validator has been removed.' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Node Validators</h3>
        <Button onClick={openAddModal} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
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
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[rgb(161,161,170)]">Stake:</span>
                <span className="text-white">{v.stake}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgb(161,161,170)]">Uptime:</span>
                <span className="text-[rgb(218,255,1)]">{v.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgb(161,161,170)]">Since:</span>
                <span className="text-white">{v.since}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[rgb(63,63,63)]">
              <button onClick={() => openEditModal(v)} className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(v.id)} className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Validator' : 'Add Validator'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Network Logo/Image</label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Network Name *</label>
              <Input
                value={formData.network}
                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                placeholder="e.g., Ethereum, Cosmos Hub"
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-md text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[rgb(17,17,19)] border border-[rgb(63,63,63)] rounded-md text-white"
                >
                  <option value="Mainnet Validator">Mainnet Validator</option>
                  <option value="Testnet Validator">Testnet Validator</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stake</label>
                <Input
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  placeholder="e.g., 32 ETH"
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Uptime</label>
                <Input
                  value={formData.uptime}
                  onChange={(e) => setFormData({ ...formData, uptime: e.target.value })}
                  placeholder="e.g., 99.9%"
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Since (YYYY-MM)</label>
                <Input
                  value={formData.since}
                  onChange={(e) => setFormData({ ...formData, since: e.target.value })}
                  placeholder="e.g., 2023-01"
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., ◆"
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-[rgb(63,63,63)]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Posts Content
const PostsContent = () => {
  const { posts, addPost, updatePost, deletePost } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    published: false
  });
  const [tagInput, setTagInput] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', excerpt: '', content: '', tags: [], published: false });
    setTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    if (editingItem) {
      updatePost(editingItem.id, formData);
      toast({ title: 'Updated!', description: 'Post has been updated.' });
    } else {
      addPost(formData);
      toast({ title: 'Added!', description: 'New post has been added.' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      toast({ title: 'Deleted!', description: 'Post has been removed.' });
    }
  };

  const togglePublish = (post) => {
    updatePost(post.id, { ...post, published: !post.published });
    toast({ 
      title: post.published ? 'Unpublished!' : 'Published!', 
      description: `Post has been ${post.published ? 'unpublished' : 'published'}.` 
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Blog Posts</h3>
        <Button onClick={openAddModal} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{post.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs ${post.published ? 'bg-[rgba(218,255,1,0.1)] text-[rgb(218,255,1)]' : 'bg-[rgb(38,40,42)] text-[rgb(161,161,170)]'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-[rgb(161,161,170)] text-sm">{post.excerpt}</p>
              <p className="text-[rgb(161,161,170)] text-xs mt-2">{post.date}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => togglePublish(post)} 
                className={`px-3 py-1 rounded text-xs ${post.published ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
              >
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => openEditModal(post)} className="p-2 text-[rgb(161,161,170)] hover:text-[rgb(218,255,1)]">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-2 text-[rgb(161,161,170)] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Short description for preview..."
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                placeholder="Write your post content here..."
                className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="bg-[rgb(17,17,19)] border-[rgb(63,63,63)] text-white"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border-[rgb(63,63,63)]">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[rgb(38,40,42)] text-[rgb(161,161,170)] text-xs rounded flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-[rgb(63,63,63)]"
              />
              <label htmlFor="published" className="text-sm">Publish immediately</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-[rgb(63,63,63)]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[rgb(218,255,1)] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
