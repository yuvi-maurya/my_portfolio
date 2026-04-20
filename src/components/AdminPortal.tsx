import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { Plus, Trash2, Edit3, LogOut, Save, X, Lock, Mail } from 'lucide-react';

export const AdminPortal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'blog' | 'messages'>('projects');
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
    tech: '',
    link: '',
    github: '',
    category: 'Full-Stack'
  });
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    readTime: '5 min'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAll();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchProjects(), fetchPosts(), fetchMessages()]);
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), { ...postData, updatedAt: new Date().toISOString() });
      } else {
        await addDoc(collection(db, 'posts'), { ...postData, createdAt: new Date().toISOString() });
      }
      setPostData({ title: '', content: '', readTime: '5 min' });
      setEditingPost(null);
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we are using the popup method for this environment
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Popup was blocked. Please open the app in a new tab or allow popups for this site.");
      } else {
        alert("Login failed: " + error.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), data);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      setFormData({ title: '', desc: '', image: '', tech: '', link: '', github: '', category: 'Full-Stack' });
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const startEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      desc: project.desc,
      image: project.image,
      tech: project.tech.join(', '),
      link: project.link,
      github: project.github,
      category: project.category || 'Full-Stack'
    });
  };

  const handleSeedData = async () => {
    if (!confirm('This will seed the database with initial professional data. Proceed?')) return;
    
    const seedProjects = [
      {
        title: "Algorithmic Trading Dashboard",
        desc: "A high-performance real-time trading dashboard built with React and advanced technical indicators for market analysis.",
        tech: ["React", "TypeScript", "D3.js", "Firebase"],
        category: "Quant/Trading",
        image: "https://picsum.photos/seed/trading/800/600",
        github: "#",
        link: "#",
        createdAt: new Date().toISOString()
      },
      {
        title: "NexGen E-Commerce Suite",
        desc: "A headless e-commerce solution with dynamic routing, personalized recommendations, and a custom billing engine.",
        tech: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
        category: "Full-Stack",
        image: "https://picsum.photos/seed/shop/800/600",
        github: "#",
        link: "#",
        createdAt: new Date().toISOString()
      },
      {
        title: "Neural Vision API",
        desc: "An enterprise-grade API for real-time object detection and image classification using machine learning models.",
        tech: ["Python", "TensorFlow", "FastAPI", "Docker"],
        category: "Backend",
        image: "https://picsum.photos/seed/ai/800/600",
        github: "#",
        link: "#",
        createdAt: new Date().toISOString()
      },
      {
        title: "The Avant-Garde Portfolio",
        desc: "A premium engineering portfolio with terminal-style UI, real-time AI assistant (Y-Assistant), and dynamic content management integrated with Firebase.",
        tech: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Gemini AI"],
        category: "Full-Stack",
        image: "https://picsum.photos/seed/portfolio/800/600",
        github: "#",
        link: "#",
        createdAt: new Date().toISOString()
      }
    ];

    const seedPosts = [
      {
        title: "Maine Apna First Portfolio Website Kaise Banaya",
        excerpt: "Shuru me maine simple HTML, CSS se start kiya. Design utna accha nahi tha, lekin dhere-dhere maine Tailwind CSS aur animations use karna seekha.",
        content: "Jab maine coding start ki thi, mujhe samajh nahi aata tha ki apne skills ko showcase kaise karoon. Tab maine decide kiya ki ek personal portfolio website banaunga.\n\nShuru me maine simple HTML, CSS se start kiya. Design utna accha nahi tha, lekin dhere-dhere maine Tailwind CSS aur animations use karna seekha.\n\nIs project me mujhe sabse bada challenge responsive design ka tha. Mobile view me sab kuch break ho raha tha, lekin maine media queries aur flexbox use karke fix kiya.\n\n### Maine kya seekha:\n* UI design basics\n* Responsive layout\n* Real project me problem solving\n\nYe project mere liye turning point tha, kyunki isse mujhe confidence mila ki main real-world projects bana sakta hoon.",
        readTime: "4 min",
        createdAt: new Date().toISOString()
      },
      {
        title: "Mere Project Me Aaya Error Aur Maine Kaise Fix Kiya",
        excerpt: "Jab main apna backend bana raha tha, mujhe ek error mila jisme server properly start nahi ho raha tha. Dekhiye maine ise kaise solve kiya.",
        content: "Jab main apna backend bana raha tha, mujhe ek error mila jisme server properly start nahi ho raha tha.\n\nProblem ye thi ki maine `app.listen()` ko galat jagah likh diya tha.\n\n**Error ka reason:** Server start hone se pehle hi request handle karne ki koshish ho rahi thi.\n\n**Solution:** Maine `app.listen()` ko code ke end me shift kiya aur issue solve ho gaya.\n\n### Maine kya seekha:\n* Debugging ka importance\n* Code structure ka impact\n* Errors se darna nahi chahiye\n\nYe experience mujhe real developer banane me help kiya.",
        readTime: "3 min",
        createdAt: new Date().toISOString()
      },
      {
        title: "Frontend vs Backend – Simple Language Me Samjho",
        excerpt: "Dono me kya antar hai? Ek dam saral bhasha me samjhein web development ke do sabse bade pillars.",
        content: "Jab bhi hum koi website use karte hain, wo 2 parts me divided hoti hai:\n\n1. **Frontend:** Jo user dekh sakta hai (UI)\n   * Example: buttons, design, layout\n\n2. **Backend:** Jo server side pe hota hai (Logic)\n   * Example: database, login logic\n\n**Example:** Jab aap login karte ho:\n* **Frontend** → form show karta hai\n* **Backend** → data verify karta hai\n\n**Conclusion:** Dono equally important hain aur ek dusre ke bina kaam nahi kar sakte.",
        readTime: "5 min",
        createdAt: new Date().toISOString()
      }
    ];

    try {
      const projectPromises = seedProjects.map(p => addDoc(collection(db, 'projects'), p));
      const postPromises = seedPosts.map(p => addDoc(collection(db, 'posts'), p));
      await Promise.all([...projectPromises, ...postPromises]);
      alert('Portfolio seeded successfully!');
      fetchAll();
    } catch (e) {
      console.error(e);
      alert('Seeding failed.');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-bg-dark"><div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[2rem] w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-purple">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Admin Access</h1>
          <p className="text-gray-400 mb-8 lowercase font-mono">Restricted area for authorized personnel only.</p>
          
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-white text-bg-dark rounded-xl font-bold uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Sign In with Google</>
            )}
          </button>

          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            Tip: If login fails, try opening the site in a <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="text-brand-purple underline">new tab</a>.
          </p>
        </motion.div>
      </div>
    );
  }

  // Security Check: Hardcoded for Owner
  const isAdmin = user.email === 'yuvrajmaurya85420@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[2rem] w-full max-w-md text-center border-red-500/20"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
            <X size={40} />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4 text-red-500">Access Denied</h1>
          <p className="text-gray-400 mb-8">Your account ({user.email}) is not authorized to access the Master Dashboard.</p>
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-bold uppercase text-xs"
          >
            Logout and Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Master Dashboard</h1>
            <p className="text-gray-500 font-mono text-xs mt-1 lowercase">LOGGED IN AS: {user.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            {posts.length === 0 && (
              <button 
                onClick={handleSeedData}
                className="px-6 py-2 border border-brand-purple/30 text-brand-purple rounded-xl text-xs font-bold uppercase transition-all hover:bg-brand-purple/10"
              >
                Seed Foundations
              </button>
            )}
            <div className="glass p-1 rounded-xl flex">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'projects' ? 'bg-brand-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveTab('blog')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'blog' ? 'bg-brand-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Blog
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'messages' ? 'bg-brand-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Inquiries
              </button>
            </div>
            <button onClick={handleLogout} className="p-3 glass rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'projects' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Form */}
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  {editingProject ? <Edit3 size={20} /> : <Plus size={20} />}
                  {editingProject ? 'Modify Genesis' : 'Initialize Project'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ... inputs ... */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-purple outline-none"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Quant/Trading">Quant/Trading</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Tech Stack</label>
                    <input 
                      required
                      value={formData.tech}
                      onChange={e => setFormData({...formData, tech: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Image URL</label>
                    <input 
                      required
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Description</label>
                    <textarea 
                      required
                      value={formData.desc}
                      onChange={e => setFormData({...formData, desc: e.target.value})}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none" 
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-purple text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> {editingProject ? 'Commit' : 'Deploy'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <motion.div key={project.id} className="glass p-6 rounded-3xl group border-white/5 hover:border-white/10">
                    <div className="relative h-32 rounded-2xl overflow-hidden mb-4 bg-white/5">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => startEdit(project)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-brand-purple">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1">{project.title}</h3>
                    <p className="text-[10px] text-brand-purple font-mono uppercase tracking-widest">{project.category}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'blog' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-8">
                <h2 className="text-xl font-bold mb-6">Insight Transmission</h2>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Title</label>
                    <input 
                      required
                      value={postData.title}
                      onChange={e => setPostData({...postData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-purple transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase mb-1 block">Content (Markdown)</label>
                    <textarea 
                      required
                      value={postData.content}
                      onChange={e => setPostData({...postData, content: e.target.value})}
                      rows={10}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-purple transition-all outline-none resize-none font-mono" 
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-purple text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> {editingPost ? 'Update' : 'Transmit'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="glass p-6 rounded-3xl flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-brand-purple transition-colors">{post.title}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1 uppercase">CREATED: {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingPost(post);
                        setPostData({ title: post.title, content: post.content, readTime: post.readTime });
                      }}
                      className="p-3 glass rounded-xl text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Delete post?')) {
                          await deleteDoc(doc(db, 'posts', post.id));
                          fetchPosts();
                        }
                      }}
                      className="p-3 glass rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold font-display mb-8">Incoming Transmissions</h2>
            {messages.length === 0 ? (
              <div className="text-center p-20 glass rounded-3xl">
                <Mail className="mx-auto mb-4 text-gray-500 opacity-20" size={60} />
                <p className="text-gray-400 italic">Static. No incoming signals detected.</p>
              </div>
            ) : (
              messages.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className="glass p-8 rounded-3xl border-white/5 hover:border-brand-purple/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{msg.name}</h3>
                      <p className="text-brand-purple text-xs font-mono">{msg.email}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Recent'}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Subject: {msg.subject}</p>
                    <p className="text-gray-300 leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={async () => {
                        if(confirm('Archive transmission?')) {
                          await deleteDoc(doc(db, 'messages', msg.id));
                          fetchMessages();
                        }
                      }}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} /> Archive
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
