import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  GitFork, 
  Star, 
  GitCommit, 
  Code2,
  ExternalLink,
  Calendar
} from "lucide-react";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  recentRepos: { name: string; description: string; stars: number; forks: number; language: string; url: string }[];
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  React: "#61dafb",
  default: "#6e7681",
};

const GitHubStats = ({ username = "shreyawangikar" }: { username?: string }) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();

        // Fetch repositories
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!reposRes.ok) throw new Error("Failed to fetch repos");
        const reposData = await reposRes.json();

        // Calculate stats
        const totalStars = reposData.reduce((acc: number, repo: { stargazers_count: number }) => acc + repo.stargazers_count, 0);
        
        // Get language stats
        const languageCounts: Record<string, number> = {};
        reposData.forEach((repo: { language: string | null }) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });
        
        const totalLanguageRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
        const topLanguages = Object.entries(languageCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalLanguageRepos) * 100),
            color: languageColors[name] || languageColors.default,
          }));

        // Get recent repos
        interface RepoData {
          fork: boolean;
          name: string;
          description: string | null;
          stargazers_count: number;
          forks_count: number;
          language: string | null;
          html_url: string;
        }
        const recentRepos = reposData
          .filter((repo: RepoData) => !repo.fork)
          .slice(0, 4)
          .map((repo: RepoData) => ({
            name: repo.name,
            description: repo.description || "No description",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || "Unknown",
            url: repo.html_url,
          }));

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars,
          topLanguages,
          recentRepos,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(true);
        setLoading(false);
        
        // Set fallback data
        setStats({
          publicRepos: 15,
          followers: 50,
          following: 30,
          totalStars: 25,
          topLanguages: [
            { name: "JavaScript", percentage: 40, color: "#f1e05a" },
            { name: "TypeScript", percentage: 30, color: "#3178c6" },
            { name: "Python", percentage: 20, color: "#3572A5" },
            { name: "HTML", percentage: 10, color: "#e34c26" },
          ],
          recentRepos: [],
        });
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-muted" />
          <div className="h-6 w-32 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl p-6 hover:border-primary/20 transition-colors duration-200 card-hover"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#333]/50 flex items-center justify-center">
            <Github className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">GitHub Activity</h3>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ExternalLink size={16} className="text-muted-foreground" />
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Repositories", value: stats?.publicRepos || 0, icon: Code2 },
          { label: "Stars Earned", value: stats?.totalStars || 0, icon: Star },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary/50 rounded-lg p-3 text-center">
            <stat.icon className="mx-auto text-primary/70 mb-1" size={16} />
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Languages */}
      {stats?.topLanguages && stats.topLanguages.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Top Languages</p>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
            {stats.topLanguages.map((lang) => (
              <motion.div
                key={lang.name}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full"
                style={{ backgroundColor: lang.color }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {stats.topLanguages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {lang.name} <span className="text-foreground/70">{lang.percentage}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contribution graph placeholder */}
      <div className="bg-secondary/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-primary/70" />
          <span className="text-xs text-muted-foreground">Contribution Activity</span>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {[...Array(84)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm transition-colors"
              style={{
                backgroundColor: `hsl(220 90% 56% / ${Math.random() * 0.6 + 0.1})`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubStats;
