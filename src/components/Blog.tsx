import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';

export const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const p = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(p);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <section className="py-24 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="glass p-8 rounded-3xl animate-pulse h-[300px] flex flex-col justify-between">
            <div>
              <div className="h-6 bg-surface-primary w-3/4 rounded mb-4"></div>
              <div className="h-4 bg-surface-primary w-1/2 rounded mb-2"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 bg-surface-primary w-20 rounded"></div>
              <div className="h-4 bg-surface-primary w-20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (selectedPost) {
    const isLight = document.documentElement.classList.contains('light');
    return (
      <section className="py-24 max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-text-secondary hover:text-brand-purple transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary uppercase tracking-widest mb-6">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {selectedPost.readTime || '5 min'}</span>
          </div>
          <h1 className="text-5xl font-display font-bold mb-12 leading-tight">{selectedPost.title}</h1>
          <div className={`prose ${isLight ? '' : 'prose-invert'} prose-purple max-w-none markdown-body`}>
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-6 tracking-tighter">
            Market <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-[0.4em]">Thoughts on Engineering, Trading & Architecture</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center p-20 glass rounded-3xl">
            <BookOpen className="mx-auto mb-4 text-text-secondary" size={40} />
            <p className="text-text-secondary font-mono italic">No transmissions found at this frequency yet. Stay tuned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl group cursor-pointer hover:border-brand-purple/40 transition-all border-border-primary"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-center gap-3 text-[10px] font-mono text-brand-purple uppercase tracking-widest mb-4">
                  <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display group-hover:text-brand-purple transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-text-secondary text-sm line-clamp-3 mb-8 leading-relaxed">
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>
                <div className="pt-6 border-t border-border-primary flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-mono">{post.readTime || '5 min'} READ</span>
                  <div className="text-brand-purple flex items-center gap-1 text-sm font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
                    Explore <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
