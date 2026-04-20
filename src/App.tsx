/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  ExternalLink, 
  Mail, 
  Code2, 
  Rocket, 
  Target, 
  Download, 
  Menu, 
  X,
  ChevronRight,
  ChevronUp,
  TrendingUp,
  Cpu,
  Globe,
  Phone,
  Moon,
  Sun,
  Award,
  BookOpen
} from 'lucide-react';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FloatingAssistant } from './components/FloatingAssistant';
import { GithubStats } from './components/GithubStats';
import { DynamicProjects } from './components/DynamicProjects';
import { AdminPortal } from './components/AdminPortal';
import { Blog } from './components/Blog';

// --- Components ---

const Spotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="spotlight" 
      style={{ 
        '--mouse-x': `${position.x}px`, 
        '--mouse-y': `${position.y}px` 
      } as React.CSSProperties} 
    />
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  if (isAdmin) return null; // No navbar on admin portal for a cleaner look

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold text-gradient"
          >
            YUVRAJ.
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-text-secondary hover:text-text-primary transition-colors font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-purple transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            <button 
              onClick={toggleTheme}
              className="p-2 glass rounded-full hover:bg-white/10 transition-colors text-text-primary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 glass rounded-full hover:bg-white/10 transition-colors text-text-primary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary hover:text-brand-purple transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-white w-full text-center py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-brand-purple/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-brand-blue/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-primary border border-border-primary mb-6 group cursor-default">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest group-hover:text-text-primary transition-colors">Available for new ventures</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] mb-8">
              Innovating <br />
              <span className="text-gradient">The Digital</span> <br />
              Frontier.
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-display mb-10 max-w-xl leading-relaxed">
              I am <span className="text-text-primary font-bold">Yuvraj Maurya</span>. A visionary developer merging algorithmic precision with avant-garde web experiences.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#projects" className="group relative px-10 py-4 bg-text-primary text-bg-primary rounded-full font-bold transition-all hover:scale-105 active:scale-95 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Explore Portfolio <ExternalLink size={18} /></span>
                <div className="absolute inset-0 bg-brand-purple translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </a>
              <a href="#contact" className="px-10 py-4 glass rounded-full font-bold hover:bg-surface-primary transition-all border border-border-primary hover:scale-105 active:scale-95">
                Start a Conversation
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl blur-3xl" />
            <div className="terminal-window h-[450px]">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="ml-2 text-xs font-mono text-text-secondary">yuvraj@workspace: ~/bio</span>
              </div>
              <div className="p-6 font-mono text-sm leading-6">
                <p className="text-brand-blue mb-2">$ whoami</p>
                <p className="text-text-secondary ml-4 mb-4">"Yuvraj Maurya. Full-stack specialist. Market analyst."</p>
                <p className="text-brand-purple mb-2">$ skills --top</p>
                <p className="text-text-secondary ml-4 mb-2">[ 'React', 'TypeScript', 'Node.js', 'PyAlgo' ]</p>
                <p className="text-brand-blue mb-2">$ status --current</p>
                <p className="text-green-400 ml-4 mb-4">"Building the future of FinTech & Web 3.0"</p>
                <p className="text-brand-purple mb-2">$ systemctl status creativity</p>
                <p className="text-white ml-4">● creativity.service - The Spark <br /> <span className="text-green-500">active (running)</span> since forever</p>
                <div className="mt-6 flex gap-2">
                  <span className="w-2 h-4 bg-brand-purple animate-ping"></span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trading Ticker Mockup */}
      <div className="ticker-wrap">
        <div className="ticker flex items-center gap-12 text-sm font-mono font-bold uppercase tracking-widest text-text-secondary">
          {[
            { label: 'React.js', val: '+98%', up: true },
            { label: 'Market Sentiment', val: 'BULLISH', up: true },
            { label: 'TypeScript', val: 'MASTERED', up: true },
            { label: 'Portfolio Growth', val: 'EXPONENTIAL', up: true },
            { label: 'System Design', val: 'OPTIMIZED', up: true },
            { label: 'Trading Algorithms', val: 'DEPLOYED', up: true },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-text-primary">{stat.label}</span>
              <span className={stat.up ? 'text-green-500' : 'text-red-500'}>{stat.val}</span>
              {stat.up ? <TrendingUp size={14} className="text-green-500" /> : <ChevronRight size={14} className="text-red-500 rotate-90" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-display font-bold mb-6">The <span className="text-gradient">Philosophy</span></h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              I don't just write code; I architect systems that bridge the gap between human emotion and computational logic. My dual mastery of Financial Markets and Full-Stack Engineering allows me to see the world as a series of optimized data streams.
            </p>
          </div>
          <div className="px-6 py-3 glass rounded-2xl border-border-primary flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Location</p>
              <p className="text-sm font-bold">Lucknow, India</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
              <Globe size={20} />
            </div>
          </div>
        </div>

        <div className="bento-grid">
          {/* Bento Item 1: Large Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bento-item col-span-1 md:col-span-2 row-span-2 group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center mb-6 text-brand-purple group-hover:scale-110 transition-transform">
                <Code2 size={24} />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">Engineering Precision</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                With over 2 years of obsessive focus on React & Node.js, I build scalable digital architectures. 
                My focus remains on clean, maintainable code that drives enterprise-grade performance.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-dark bg-white/10 glass" />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Trusted by innovators</p>
            </div>
          </motion.div>

          {/* Bento Item 2: Trading Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bento-item col-span-1 md:col-span-2 bg-gradient-to-br from-brand-blue/20 to-transparent group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue group-hover:rotate-12 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold uppercase tracking-wider">HFT Optimized</div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Quant Intelligence</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Leveraging algorithmic trading bots and python-based data analysis to navigate complex financial landscapes.
              </p>
            </div>
          </motion.div>

          {/* Bento Item 3: Project Count */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bento-item h-full flex items-center justify-center bg-white/5 border-dashed group"
          >
            <div className="text-center">
              <p className="text-6xl font-display font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">10+</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Live Shipments</p>
            </div>
          </motion.div>

          {/* Bento Item 4: Call to Action small */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bento-item group bg-brand-purple hover:bg-brand-accent transition-colors"
          >
            <div className="text-white">
              <h3 className="text-2xl font-display font-bold mb-2 leading-tight">Got a Vision?</h3>
              <p className="opacity-80 text-sm mb-6">Let's translate your ideas into robust reality.</p>
              <a href="#contact" className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all pb-1 border-b border-white">
                Work with me <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
    { name: 'TypeScript/JS', icon: <Code2 size={24} />, level: 90, desc: 'Enterprise Logic' },
    { name: 'React/Next.js', icon: <Rocket size={24} />, level: 85, desc: 'Dynamic UIs' },
    { name: 'Tailwind CSS', icon: <Cpu size={24} />, level: 95, desc: 'Rapid Styling' },
    { name: 'Node.js/Backend', icon: <Globe size={24} />, level: 75, desc: 'Scalable APIs' },
    { name: 'Firebase/Auth', icon: <Mail size={24} />, level: 80, desc: 'Cloud Data' },
    { name: 'Quant Trading', icon: <TrendingUp size={24} />, level: 85, desc: 'Fin-Logic' },
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-4 tracking-tighter">My <span className="text-gradient">Arsenal & Mastery</span></h2>
          <p className="text-text-secondary max-w-xl mx-auto uppercase tracking-[0.3em] text-[10px] font-bold">Cutting-edge technologies I utilize to build the future</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl group hover:shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)] transition-all duration-500 border border-border-primary hover:border-brand-purple/30"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-primary rounded-2xl text-brand-purple group-hover:bg-brand-purple group-hover:text-text-primary transition-all duration-500 shadow-inner">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display">{skill.name}</h3>
                    <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{skill.desc}</p>
                  </div>
                </div>
                <span className="text-brand-blue font-mono text-sm font-bold">{skill.level}%</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-surface-primary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-brand-purple to-brand-blue relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Resume = () => {
  const handleDownload = () => {
    // In a real app, this would be a link to a PDF
    const link = document.createElement('a');
    link.href = '/resume.txt'; // Using the placeholder txt file
    link.download = 'Yuvraj_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 glass">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-3xl bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 border border-border-primary"
        >
          <h2 className="text-3xl font-display font-bold mb-6">Want to see my full professional path?</h2>
          <p className="text-text-secondary mb-10 text-lg max-w-2xl mx-auto">
            I've detailed my journey, certifications, and technical milestones in my official resume.
          </p>
          <button 
            onClick={handleDownload}
            className="px-10 py-4 bg-text-primary text-bg-primary rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-brand-purple hover:text-text-primary transition-all transform hover:scale-105"
          >
            <Download size={20} /> Download Resume
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'messages'), {
        ...formState,
        createdAt: serverTimestamp()
      });
      console.log('Form submitted to Firestore:', formState);
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Get In <span className="text-gradient">Touch</span></h2>
          <div className="w-20 h-1 bg-brand-blue mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6 font-display">Let's talk about your next project</h3>
            <p className="text-text-secondary mb-10 text-lg leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities 
              to be part of your vision. Whether you're interested in a modern website 
              or want to talk trading algorithms—I'm just a message away.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Mail className="text-brand-purple" />, val: 'yuvrajmaurya85420@gmail.com', href: 'mailto:yuvrajmaurya85420@gmail.com' },
                { icon: <Phone className="text-green-400" />, val: '+91 8808373027', href: 'tel:+918808373027' },
                { icon: <Globe className="text-brand-blue" />, val: "Yuvraj's Global Office", href: '#home' },
              ].map((item, i) => (
                <a 
                  key={i} 
                  href={item.href} 
                  className="flex items-center gap-4 group cursor-pointer w-fit"
                >
                  <div className="p-3 glass rounded-xl group-hover:bg-brand-purple/20 transition-colors">{item.icon}</div>
                  <span className="text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.val}</span>
                </a>
              ))}
            </div>

            <div className="flex gap-4 mt-12">
              {[
                { icon: <Linkedin />, link: '#' },
                { icon: <Github />, link: '#' },
                { icon: <Instagram />, link: '#' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  className="p-4 glass rounded-full hover:bg-brand-purple/20 transition-all transform hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 md:p-10 rounded-3xl space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="John Doe" 
                  className="w-full bg-surface-primary border border-border-primary rounded-xl px-5 py-4 focus:border-brand-purple outline-none transition-colors text-text-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Your Email</label>
                <input 
                  type="email" 
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="john@example.com" 
                  className="w-full bg-surface-primary border border-border-primary rounded-xl px-5 py-4 focus:border-brand-purple outline-none transition-colors text-text-primary" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Subject</label>
              <input 
                type="text" 
                required
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                placeholder="Project Inquiry" 
                className="w-full bg-surface-primary border border-border-primary rounded-xl px-5 py-4 focus:border-brand-purple outline-none transition-colors text-text-primary" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Message</label>
              <textarea 
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                placeholder="Tell me about your project..." 
                rows={5} 
                className="w-full bg-surface-primary border border-border-primary rounded-xl px-5 py-4 focus:border-brand-purple outline-none transition-colors resize-none text-text-primary"
              ></textarea>
            </div>
            <button 
              disabled={status === 'loading'}
              className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-blue rounded-xl font-bold shadow-lg shadow-brand-purple/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>Sending...</>
              ) : status === 'success' ? (
                <>Message Sent!</>
              ) : status === 'error' ? (
                <>Failed to Send</>
              ) : (
                <>Send Message</>
              )}
            </button>
            {status === 'success' && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-center text-sm font-medium"
              >
                Thank you! Your message has been received.
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-center text-sm font-medium"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ visitorCount }: { visitorCount: number }) => {
  return (
    <footer className="py-12 border-t border-border-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl font-display font-bold text-gradient mb-6 inline-block">YUVRAJ.</h2>
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          {['Home', 'About', 'Skills', 'Projects', 'Blog', 'Contact'].map(link => (
            <a key={link} href={`/#${link.toLowerCase()}`} className="text-text-secondary hover:text-text-primary transition-all text-sm font-medium uppercase tracking-widest hover:tracking-[0.2em]">{link}</a>
          ))}
          <Link to="/admin" className="text-text-secondary hover:text-brand-purple transition-all text-sm font-medium uppercase tracking-widest hover:tracking-[0.2em]">Portal</Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Yuvraj Maurya. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-primary rounded-full border border-border-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse"></span>
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{visitorCount} Transmissions Logged</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-[60] p-4 glass rounded-full text-brand-purple hover:bg-brand-purple hover:text-white transition-all shadow-2xl shadow-brand-purple/20 border border-white/20"
        >
          <ChevronRight className="-rotate-90" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

const Portfolio = ({ visitorCount }: { visitorCount: number }) => (
  <main className="relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-[1000px] bg-grid opacity-30 pointer-events-none z-0"></div>
    
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-32 pb-32"
    >
      <Hero />
      <section id="stats"><GithubStats /></section>
      <section id="about"><About /></section>
      <section id="projects"><DynamicProjects /></section>
      <section id="skills"><Skills /></section>
      <section id="blog"><Blog /></section>
      <section id="resume"><Resume /></section>
      <section id="contact"><Contact /></section>
    </motion.div>
    
    <Footer visitorCount={visitorCount} />
  </main>
);

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [visitorCount, setVisitorCount] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const updateStats = async () => {
      const statsRef = doc(db, 'system', 'stats');
      try {
        const statsDoc = await getDoc(statsRef);
        if (statsDoc.exists()) {
          await updateDoc(statsRef, {
            visitors: increment(1)
          });
          setVisitorCount(statsDoc.data().visitors + 1);
        } else {
          await setDoc(statsRef, { visitors: 1 });
          setVisitorCount(1);
        }
      } catch (error) {
        console.warn("Stats update failed");
      }
    };
    updateStats();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className={`selection:bg-brand-purple/30 selection:text-white noise-bg min-h-screen transition-colors duration-300 ${theme === 'light' ? 'light' : ''}`}>
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-blue z-[100] origin-left"
          style={{ scaleX: scrollYProgress }}
        />
        <Spotlight />
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Portfolio visitorCount={visitorCount} />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
        <FloatingAssistant />
        <ScrollToTop />
      </div>
    </Router>
  );
}
