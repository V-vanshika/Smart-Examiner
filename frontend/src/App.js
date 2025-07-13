import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  InformationCircleIcon, 
  PhoneIcon,
  UserIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  CogIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  FolderIcon,
  AcademicCapIcon,
  BeakerIcon,
  XMarkIcon, // For the 'X' close button
  XCircleIcon, // For error displays and removing unit specs
  TrashIcon, // For removing sections
  PlusCircleIcon // For adding unit specs
} from '@heroicons/react/24/outline';
import './App.css';

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API Base URL
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {!user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/upload" element={<UploadPage user={user} />} />
            <Route path="/templates" element={<TemplatesPage user={user} />} />
            <Route path="/generate" element={<GeneratePage user={user} />} />
            <Route path="/papers" element={<PapersPage user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

// Header Component
function Header({ user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-indigo-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SmartExaminer
            </h1>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            {!user ? (
              <>
                <NavLink href="/" icon={HomeIcon}>Home</NavLink>
                <NavLink href="/about" icon={InformationCircleIcon}>About</NavLink>
                <NavLink href="/contact" icon={PhoneIcon}>Contact</NavLink>
                <NavLink href="/auth" icon={UserIcon}>Login</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
                <NavLink href="/upload" icon={CloudArrowUpIcon}>Upload</NavLink>
                <NavLink href="/templates" icon={CogIcon}>Templates</NavLink>
                <NavLink href="/generate" icon={BeakerIcon}>Generate</NavLink>
                <NavLink href="/papers" icon={DocumentTextIcon}>Papers</NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, children, icon: Icon }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </motion.a>
  );
}

// Home Page
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            SmartExaminer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Revolutionary AI-powered question paper generation platform. Transform your content into professional examination papers in seconds.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all border border-indigo-200"
              onClick={() => window.location.href = '/about'}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={CloudArrowUpIcon}
            title="Smart Upload System"
            description="Upload your study materials in any format - PDF, DOCX, PPTX. Our AI extracts and organizes content automatically."
          />
          <FeatureCard
            icon={CogIcon}
            title="Custom Templates"
            description="Create reusable question paper templates with your preferred format, marking scheme, and question distribution."
          />
          <FeatureCard
            icon={BeakerIcon}
            title="AI Generation"
            description="Generate professional question papers using advanced AI that understands your content and requirements."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-20"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          About SmartExaminer
        </motion.h1>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
        >
          <p className="text-lg text-gray-700 mb-6">
            SmartExaminer revolutionizes the way educators create examination papers. Using cutting-edge AI technology, 
            we transform your teaching materials into professional, well-structured question papers in minutes.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our platform supports multiple file formats, intelligent content extraction, and customizable templates 
            to ensure your question papers meet your exact requirements.
          </p>
          <p className="text-lg text-gray-700">
            Join thousands of educators who trust SmartExaminer to streamline their assessment creation process.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Contact Page
function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-20"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Contact Us
        </motion.h1>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
        >
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8">
              Get in touch with our team for support, feedback, or partnership opportunities.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> support@SmartExaminer.com
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Address:</span> 123 Innovation Drive, Tech City, TC 12345
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Auth Page
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-20"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </motion.button>
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Dashboard
function Dashboard({ user }) {
  const [stats, setStats] = useState({
    folders: 0,
    templates: 0,
    papers: 0
  });

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [foldersRes, templatesRes, papersRes] = await Promise.all([
        fetch(`${API_BASE}/api/folders/${user.id}`),
        fetch(`${API_BASE}/api/templates/${user.id}`),
        fetch(`${API_BASE}/api/papers/${user.id}`)
      ]);

      const folders = await foldersRes.json();
      const templates = await templatesRes.json();
      const papers = await papersRes.json();

      setStats({
        folders: folders.length,
        templates: templates.length,
        papers: papers.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Welcome back, {user.email}!
        </motion.h1>

        {/* Stats Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatsCard icon={FolderIcon} title="Folders" value={stats.folders} color="from-blue-500 to-cyan-500" />
          <StatsCard icon={CogIcon} title="Templates" value={stats.templates} color="from-purple-500 to-pink-500" />
          <StatsCard icon={DocumentTextIcon} title="Papers Generated" value={stats.papers} color="from-green-500 to-emerald-500" />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <QuickActionCard
            href="/upload"
            icon={CloudArrowUpIcon}
            title="Upload Content"
            description="Add new study materials"
            color="from-indigo-500 to-purple-500"
          />
          <QuickActionCard
            href="/templates"
            icon={CogIcon}
            title="Create Template"
            description="Design question paper format"
            color="from-purple-500 to-pink-500"
          />
          <QuickActionCard
            href="/generate"
            icon={BeakerIcon}
            title="Generate Paper"
            description="Create AI-powered questions"
            color="from-pink-500 to-red-500"
          />
          <QuickActionCard
            href="/papers"
            icon={DocumentTextIcon}
            title="View Papers"
            description="Browse generated papers"
            color="from-green-500 to-emerald-500"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatsCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ href, icon: Icon, title, description, color }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all block"
    >
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.a>
  );
}

// Upload Page
function UploadPage({ user }) {
  const [folders, setFolders] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderType, setFolderType] = useState('unit-wise');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [unitName, setUnitName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, [user]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/folders/${user.id}`);
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const createFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          type: folderType,
          user_id: user.id
        })
      });

      if (response.ok) {
        setNewFolderName('');
        setShowCreateFolder(false);
        fetchFolders();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const uploadFiles = async () => {
    if (!selectedFolder || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        if (selectedFolder.type === 'unit-wise') {
          formData.append('unit_name', unitName);
        }

        await fetch(`${API_BASE}/api/upload/${selectedFolder.id}`, {
          method: 'POST',
          body: formData
        });
      }

      setFiles([]);
      setUnitName('');
      alert('Files uploaded successfully!');
      fetchFolders();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Upload Content
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateFolder(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Folder</span>
          </motion.button>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateFolder(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">Create New Folder</h2>
              <form onSubmit={createFolder} className="space-y-4">
                <input
                  type="text"
                  placeholder="Folder Name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  required
                />
                <select
                  value={folderType}
                  onChange={(e) => setFolderType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="unit-wise">Unit-wise</option>
                  <option value="syllabus">Syllabus</option>
                </select>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolder(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Folders Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedFolder(folder)}
              className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl cursor-pointer transition-all ${
                selectedFolder?.id === folder.id ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <FolderIcon className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-gray-900">{folder.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{folder.type}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{folder.files?.length || 0} files</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload Section */}
        {selectedFolder && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6">Upload to {selectedFolder.name}</h2>
            
            {selectedFolder.type === 'unit-wise' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Name</label>
                <input
                  type="text"
                  placeholder="e.g., Unit 1, Unit 2..."
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Files</label>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.pptx"
                onChange={(e) => setFiles([...e.target.files])}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOCX, PPTX</p>
            </div>

            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Selected Files:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={uploadFiles}
              disabled={uploading || files.length === 0 || (selectedFolder.type === 'unit-wise' && !unitName)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Templates Page - Placeholder
function TemplatesPage({ user }) {
  const [templates, setTemplates] = useState([]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const initialSectionState = {
    section_name: 'Section 1',
    section_type: 'Answer All Questions', // New: 'Answer All Questions', 'Answer N from Section'
    questions_type: 'MCQ', // New: 'MCQ', 'Short Answer', 'Long Answer', etc.
    total_questions: 10, // New
    questions_to_be_answered: 10, // New
    marks_for_each_question: 1, // New
    custom_instruction: '', // New
    question_specs: [] // Existing: { unit_name: '', num_questions: 0 }
  };

  const initialTemplateState = {
    name: '',
    description: '', // New
    instituteType: 'College', // New
    instituteName: '', // New
    evaluation: 'Marks', // New
    paper_code: '', // Keeping for now, might be re-evaluated
    duration: 180, // Default or user input
    total_marks: 100, // Default or user input - may become calculated
    sections: [] // Start with an empty array, user will add sections
  };

  const [templateData, setTemplateData] = useState(initialTemplateState);

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/templates/${user.id}`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...templateData, user_id: user.id })
      });

      if (response.ok) {
        setShowCreateTemplate(false);
        setTemplateData(initialTemplateState); // Reset to the new initial state
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const addSection = () => {
    setTemplateData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          ...initialSectionState, // Use the new detailed initial state for a section
          section_name: `Section ${prev.sections.length + 1}`,
        }
      ]
    }));
  };

  // Function to add a unit specification to a specific section
  const addUnitSpec = (sectionIndex) => {
    const newSections = [...templateData.sections];
    newSections[sectionIndex].question_specs.push({
      unit_name: '', // Default empty unit name
      num_questions: 1 // Default to 1 question
    });
    setTemplateData(prev => ({ ...prev, sections: newSections }));
  };

  // Function to handle changes in section fields (e.g., name)
  const handleSectionChange = (sectionIndex, fieldName, value) => {
    const newSections = [...templateData.sections];
    newSections[sectionIndex][fieldName] = value;
    setTemplateData(prev => ({ ...prev, sections: newSections }));
  };

  // Function to handle changes in unit specifications
  const handleUnitSpecChange = (sectionIndex, specIndex, fieldName, value) => {
    const newSections = [...templateData.sections];
    // Ensure num_questions is an integer
    const valToSet = fieldName === 'num_questions' ? parseInt(value, 10) || 0 : value;
    newSections[sectionIndex].question_specs[specIndex][fieldName] = valToSet;
    setTemplateData(prev => ({ ...prev, sections: newSections }));
  };

  // Function to remove a section
  const removeSection = (sectionIndex) => {
    const newSections = templateData.sections.filter((_, index) => index !== sectionIndex);
    setTemplateData(prev => ({ ...prev, sections: newSections }));
  };

  // Function to remove a unit specification from a section
  const removeUnitSpec = (sectionIndex, specIndex) => {
    const newSections = [...templateData.sections];
    newSections[sectionIndex].question_specs = newSections[sectionIndex].question_specs.filter(
      (_, index) => index !== specIndex
    );
    setTemplateData(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Question Paper Templates
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateTemplate(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Template</span>
          </motion.button>
        </div>

        {/* Create Template Modal */}
        {showCreateTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
            onClick={() => setShowCreateTemplate(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 my-8 shadow-2xl overflow-y-auto" // Increased max-width
              style={{ maxHeight: '90vh' }} // Ensure modal is scrollable if content overflows
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">New Question Paper Template</h2>
                <button onClick={() => setShowCreateTemplate(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={createTemplate} className="space-y-8">
                {/* Top Level Template Details */}
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Template Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">Template Name*</label>
                      <input id="templateName" type="text" placeholder="Eg: Internal Exam Template" value={templateData.name} onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" required />
                    </div>
                    <div>
                      <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 mb-1">Template Description</label>
                      <input id="templateDescription" type="text" placeholder="Brief description of the template" value={templateData.description} onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="instituteType" className="block text-sm font-medium text-gray-700 mb-1">Institute*</label>
                      <select id="instituteType" value={templateData.instituteType} onChange={(e) => setTemplateData(prev => ({ ...prev, instituteType: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm bg-white">
                        {['College', 'School', 'University', 'Coaching Center', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                      <input id="instituteName" type="text" placeholder="Name of the institute" value={templateData.instituteName} onChange={(e) => setTemplateData(prev => ({ ...prev, instituteName: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="evaluation" className="block text-sm font-medium text-gray-700 mb-1">Evaluation*</label>
                      <input id="evaluation" type="text" placeholder="Eg: Mark, Grade" value={templateData.evaluation} onChange={(e) => setTemplateData(prev => ({ ...prev, evaluation: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" required />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)*</label>
                      <input id="duration" type="number" placeholder="Duration in Minutes" value={templateData.duration} onChange={(e) => setTemplateData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" required />
                    </div>
                     {/* Optional: Paper Code and Top-level Total Marks if still needed 
                    <div>
                      <label htmlFor="paperCode" className="block text-sm font-medium text-gray-700 mb-1">Paper Code</label>
                      <input id="paperCode" type="text" placeholder="Paper Code" value={templateData.paper_code} onChange={(e) => setTemplateData(prev => ({ ...prev, paper_code: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" />
                    </div>
                    <div>
                      <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">Total Marks (Overall)</label>
                      <input id="totalMarks" type="number" placeholder="Overall Total Marks" value={templateData.total_marks} onChange={(e) => setTemplateData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm" />
                    </div>
                    */}
                  </div>
                </div>

                {/* Sections Configuration */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Sections</h3>
                  </div>
                  
                  {templateData.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 p-6 bg-indigo-50 rounded-xl shadow-lg border border-indigo-100">
                      <div className="flex justify-between items-center mb-4">
                        <input 
                          type="text"
                          placeholder={`Section ${sectionIndex + 1} Name (Eg: Section A, Part 1)`}
                          value={section.section_name}
                          onChange={(e) => handleSectionChange(sectionIndex, 'section_name', e.target.value)}
                          className="text-xl font-semibold bg-transparent border-b-2 border-indigo-300 focus:border-indigo-500 outline-none w-full text-indigo-700 placeholder-indigo-400"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeSection(sectionIndex)} 
                          className="text-red-500 hover:text-red-700 ml-4 p-2 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
                        <div>
                          <label htmlFor={`sectionType-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Section Type*</label>
                          <select id={`sectionType-${sectionIndex}`} value={section.section_type} onChange={(e) => handleSectionChange(sectionIndex, 'section_type', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm bg-white text-sm">
                            {['Answer All Questions', 'Answer N from Section'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`questionsType-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Questions Type*</label>
                          <select id={`questionsType-${sectionIndex}`} value={section.questions_type} onChange={(e) => handleSectionChange(sectionIndex, 'questions_type', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm bg-white text-sm">
                            {['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks', 'True/False'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`marksPerQuestion-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Marks for Each Question*</label>
                          <input id={`marksPerQuestion-${sectionIndex}`} type="number" value={section.marks_for_each_question} onChange={(e) => handleSectionChange(sectionIndex, 'marks_for_each_question', parseInt(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm text-sm" min="0" />
                        </div>
                        <div>
                          <label htmlFor={`totalQuestions-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Total Questions in Section*</label>
                          <input id={`totalQuestions-${sectionIndex}`} type="number" value={section.total_questions} onChange={(e) => handleSectionChange(sectionIndex, 'total_questions', parseInt(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm text-sm" min="0" />
                        </div>
                        <div>
                          <label htmlFor={`questionsToBeAnswered-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Questions to be Answered*</label>
                          <input id={`questionsToBeAnswered-${sectionIndex}`} type="number" value={section.questions_to_be_answered} onChange={(e) => handleSectionChange(sectionIndex, 'questions_to_be_answered', parseInt(e.target.value) || 0)} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm text-sm" min="0" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor={`customInstruction-${sectionIndex}`} className="block text-sm font-medium text-gray-600 mb-1">Custom Instruction</label>
                        <textarea id={`customInstruction-${sectionIndex}`} value={section.custom_instruction} onChange={(e) => handleSectionChange(sectionIndex, 'custom_instruction', e.target.value)} rows="2" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm text-sm" placeholder="Eg: All questions carry equal marks. Answer any five."></textarea>
                      </div>

                      {/* Unit Specifications for the section */}
                      <div className="space-y-3 mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-md font-semibold text-gray-700">Unit-wise Question Distribution for this Section:</h4>
                        {section.question_specs.map((spec, specIndex) => (
                          <div key={specIndex} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                            <input
                              type="text"
                              placeholder="Unit Name (e.g., Unit 1)"
                              value={spec.unit_name}
                              onChange={(e) => handleUnitSpecChange(sectionIndex, specIndex, 'unit_name', e.target.value)}
                              className="flex-grow px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none text-sm"
                            />
                            <input
                              type="number"
                              placeholder="No. of Questions from this Unit"
                              value={spec.num_questions}
                              onChange={(e) => handleUnitSpecChange(sectionIndex, specIndex, 'num_questions', e.target.value)}
                              className="w-48 px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none text-sm"
                              min="0"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeUnitSpec(sectionIndex, specIndex)} 
                              className="text-red-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 transition-colors"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addUnitSpec(sectionIndex)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 py-1.5 px-3 rounded-md hover:bg-indigo-100 transition-colors border border-indigo-300 hover:border-indigo-500"
                        >
                          <PlusCircleIcon className="h-4 w-4" />
                          <span>Add Unit Specification</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-6 mb-2">
                     <button
                        type="button"
                        onClick={addSection}
                        className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md flex items-center space-x-2"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Section</span>
                      </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateTemplate(false)} 
                    className="px-8 py-3 rounded-xl border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Templates Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-2">Code: {template.paper_code}</p>
              <p className="text-gray-600 mb-2">Duration: {template.duration} minutes</p>
              <p className="text-gray-600 mb-4">Total Marks: {template.total_marks}</p>
              <div className="space-y-2">
                {template.sections.map((section, index) => (
                  <div key={index} className="text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700">{section.section_name || `Section ${index + 1}`}</p>
                    <p className="text-gray-600">Type: {section.questions_type}</p>
                    <p className="text-gray-600">Total Questions: {section.total_questions}</p>
                    <p className="text-gray-600">Marks per Question: {section.marks_for_each_question}</p>
                    {/* Add more details if needed, e.g., unit specs count */}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Generate Page
function GeneratePage({ user }) {
  const [folders, setFolders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [paperName, setPaperName] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchTemplates();
  }, [user]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/folders/${user.id}`);
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/templates/${user.id}`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const generatePaper = async () => {
    if (!selectedFolder || !selectedTemplate || selectedUnits.length === 0 || !paperName) {
      alert('Please fill all required fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/generate-paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_id: selectedFolder.id,
          template_id: selectedTemplate.id,
          selected_units: selectedUnits,
          paper_name: paperName,
          user_id: user.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Question paper generated successfully!');
        window.location.href = '/papers';
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating paper:', error);
      alert('Error generating paper');
    } finally {
      setGenerating(false);
    }
  };

  const availableUnits = selectedFolder?.files?.map(f => f.unit_name).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Generate Question Paper
        </motion.h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl space-y-8"
        >
          {/* Select Folder */}
          <div>
            <h2 className="text-xl font-bold mb-4">1. Select Content Folder</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <motion.div
                  key={folder.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedFolder(folder)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedFolder?.id === folder.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="h-6 w-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold">{folder.name}</h3>
                      <p className="text-sm text-gray-600">{folder.files?.length || 0} files</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Select Units */}
          {selectedFolder && availableUnits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">2. Select Units</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...new Set(availableUnits)].map((unit) => (
                  <label key={unit} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUnits.includes(unit)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUnits([...selectedUnits, unit]);
                        } else {
                          setSelectedUnits(selectedUnits.filter(u => u !== unit));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">{unit}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Select Template */}
          <div>
            <h2 className="text-xl font-bold mb-4">3. Select Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Code: {template.paper_code}</p>
                  <p className="text-sm text-gray-600">Duration: {template.duration} min | Marks: {template.total_marks}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Paper Name */}
          <div>
            <h2 className="text-xl font-bold mb-4">4. Paper Name</h2>
            <input
              type="text"
              placeholder="Enter question paper name"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePaper}
            disabled={generating || !selectedFolder || !selectedTemplate || selectedUnits.length === 0 || !paperName}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <BeakerIcon className="h-5 w-5" />
                <span>Generate Question Paper</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Papers Page
function PapersPage({ user }) {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [loadingPaperDetail, setLoadingPaperDetail] = useState(false);
  const [paperDetailError, setPaperDetailError] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, [user]);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/papers/${user.id}`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const viewPaper = async (paperId) => {
    setSelectedPaper(null); // Clear previous selection first
    setLoadingPaperDetail(true);
    setPaperDetailError(null);
    try {
      // Assuming API_BASE is defined globally or accessible here
      const response = await fetch(`${API_BASE}/api/paper/${paperId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error fetching paper: ${response.statusText}`);
      }
      const data = await response.json();
      setSelectedPaper(data);
    } catch (error) {
      console.error("Failed to fetch paper details:", error);
      setPaperDetailError(error.message);
    } finally {
      setLoadingPaperDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Generated Papers
        </motion.h1>

        {/* Papers Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {papers.map((paper) => (
            <motion.div
              key={paper.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{paper.name}</h3>
              <p className="text-gray-600 mb-2">Code: {paper.paper_code}</p>
              <p className="text-gray-600 mb-2">Duration: {paper.duration} minutes</p>
              <p className="text-gray-600 mb-4">Total Marks: {paper.total_marks}</p>
              <p className="text-sm text-gray-500 mb-4">
                Generated: {new Date(paper.generated_at).toLocaleDateString()}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => viewPaper(paper.id)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-semibold"
              >
                View Paper
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Paper View Modal */}
        {selectedPaper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setSelectedPaper(null); setPaperDetailError(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-3xl w-full mx-auto my-8 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100"
              onClick={(e) => e.stopPropagation()}
            >
              {loadingPaperDetail && (
                <div className="flex justify-center items-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
                  />
                </div>
              )}
              {paperDetailError && (
                <div className="text-center py-10">
                  <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-semibold">Error loading paper:</p>
                  <p className="text-red-500 text-sm">{paperDetailError}</p>
                </div>
              )}
              {!loadingPaperDetail && !paperDetailError && selectedPaper.id && (
                <>
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedPaper.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">Generated: {new Date(selectedPaper.generated_at).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedPaper(null); setPaperDetailError(null); }}
                      className="text-gray-400 hover:text-gray-600 p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
              
                  <div className="bg-indigo-50 p-4 rounded-xl mb-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <p><strong>Code:</strong> {selectedPaper.template_details?.paper_code || 'N/A'}</p>
                      <p><strong>Duration:</strong> {selectedPaper.template_details?.duration || 'N/A'} min</p>
                      <p><strong>Marks:</strong> {selectedPaper.template_details?.overall_total_marks_from_template || 'N/A'}</p>
                      <p><strong>Institute:</strong> {selectedPaper.template_details?.instituteName || 'N/A'} ({selectedPaper.template_details?.instituteType || 'N/A'})</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {selectedPaper.paper_sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-white p-1 rounded-lg ">
                        <h4 className="text-xl font-semibold text-indigo-700 mb-4 pb-2 border-b-2 border-indigo-200">{section.section_name}</h4>
                        <div className="space-y-6">
                          {section.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-indigo-500">
                              <h5 className="font-semibold text-gray-800 mb-2">Q{questionIndex + 1}. {question.question}</h5>
                              <div className="text-xs text-gray-600 mb-3 flex flex-wrap gap-2">
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">{question.type}</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{question.difficulty}</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{question.marks} marks</span>
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Unit: {question.unit_name_source}</span>
                              </div>
                              {question.options && question.options.length > 0 && (
                                <div className="ml-4 mt-2 space-y-1 text-sm">
                                  {question.options.map((option, i) => (
                                    <p key={i} className="text-gray-700">
                                      {String.fromCharCode(65 + i)}. {option}
                                    </p>
                                  ))}
                                </div>
                              )}
                              {question.answer && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                                  <strong className="text-green-700">Answer:</strong> {question.answer}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
