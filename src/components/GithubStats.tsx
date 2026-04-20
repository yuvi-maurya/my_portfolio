import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Star, GitFork, Users, Code } from 'lucide-react';

const GITHUB_USERNAME = 'yuvraj-maurya'; // Update with actual username

export const GithubStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();
          setStats(userData);
          setRepos(reposData);
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  if (loading) return (
    <div className="flex justify-center p-12">
      <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!stats) return null;

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Open Source <span className="text-gradient">Contribution</span></h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em]">Real-time statistics from GitHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Public Repos', value: stats.public_repos, icon: <Github size={20} /> },
            { label: 'Followers', value: stats.followers, icon: <Users size={20} /> },
            { label: 'Following', value: stats.following, icon: <Users size={20} /> },
            { label: 'Account Created', value: new Date(stats.created_at).getFullYear(), icon: <Star size={20} /> },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl flex items-center gap-4"
            >
              <div className="p-3 bg-brand-purple/20 text-brand-purple rounded-xl">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">{item.label}</p>
                <p className="text-2xl font-bold font-display">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 rounded-2xl hover:border-brand-purple/50 transition-all group border-border-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-surface-primary rounded-lg group-hover:bg-brand-purple/20 transition-colors">
                  <Code size={18} className="text-brand-purple" />
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary font-mono">
                  <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazers_count}</span>
                  <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks_count}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-brand-purple transition-colors">{repo.name}</h3>
              <p className="text-sm text-text-secondary line-clamp-2 mb-4">{repo.description || "No description available."}</p>
              <div className="flex gap-2">
                {repo.language && (
                  <span className="text-[10px] font-bold px-2 py-1 bg-surface-primary rounded-md border border-border-primary uppercase">
                    {repo.language}
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
