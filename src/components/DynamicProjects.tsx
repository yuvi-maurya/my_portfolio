import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ExternalLink, Github, Search, Filter, Rocket, Terminal } from 'lucide-react';

export const DynamicProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const p = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(p);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Full-Stack', 'Quant/Trading', 'Frontend', 'Backend'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.tech.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <section className="py-20 md:py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass p-6 rounded-3xl animate-pulse aspect-square flex flex-col justify-end gap-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-surface-primary"></div>
              <div className="relative h-4 bg-white/10 w-1/2 rounded"></div>
              <div className="relative h-8 bg-white/10 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-6 tracking-tighter">
            Strategic <span className="text-gradient">Innovations</span>
          </h2>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-[0.4em] mb-12">Building the future of finance and web</p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search projects or technologies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-surface-primary border border-border-primary rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-brand-purple transition-all outline-none backdrop-blur-md text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-brand-purple text-text-primary shadow-lg shadow-brand-purple/20' : 'glass text-text-secondary hover:text-text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center p-20 glass rounded-3xl">
            <Rocket className="mx-auto mb-4 text-text-secondary" size={40} />
            <p className="text-text-secondary font-mono italic">No projects found in this sector. Try refining your search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative flex flex-col h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                  <div className="glass rounded-[2rem] overflow-hidden border border-border-primary hover:border-brand-purple/30 transition-all duration-500 flex flex-col h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent opacity-80" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-brand-purple/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-brand-purple uppercase tracking-widest border border-brand-purple/20">
                          {project.category}
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        {Array.isArray(project.tech) && project.tech.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold mb-4 font-display group-hover:text-brand-purple transition-colors">{project.title}</h3>
                      <p className="text-text-secondary mb-8 flex-1 leading-relaxed text-sm">
                        {project.desc}
                      </p>
                      <div className="flex gap-4 pt-4 border-t border-border-primary">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3 bg-text-primary text-bg-primary rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-brand-purple hover:text-text-primary transition-all transform active:scale-95 shadow-lg shadow-white/5 flex items-center justify-center gap-2">
                            Live <ExternalLink size={14} />
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-xl hover:bg-brand-purple/10 transition-colors border-border-primary flex items-center justify-center">
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
