import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects, useContactMessages, useBlogPosts } from '../../hooks/useSupabase';

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  link 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  trend?: string;
  link?: string;
}) => (
  <Link to={link || '#'} className="block">
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="text-primary" size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
            <TrendingUp size={14} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-muted-foreground text-sm mt-1">{label}</div>
      </div>
    </motion.div>
  </Link>
);

const RecentItem = ({ 
  title, 
  subtitle, 
  time, 
  type 
}: { 
  title: string; 
  subtitle: string; 
  time: string;
  type: 'message' | 'project';
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
    <div className={`p-2 rounded-lg ${type === 'message' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
      {type === 'message' ? (
        <MessageSquare className="text-blue-500" size={18} />
      ) : (
        <FolderKanban className="text-purple-500" size={18} />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium truncate">{title}</div>
      <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
    </div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock size={12} />
      {time}
    </div>
  </div>
);

export default function AdminDashboard() {
  const { projects } = useProjects();
  const { messages, unreadCount } = useContactMessages();
  const { posts } = useBlogPosts(false);

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={FolderKanban} 
          label="Total Projects" 
          value={projects.length}
          link="/admin/projects"
        />
        <StatCard 
          icon={MessageSquare} 
          label="Unread Messages" 
          value={unreadCount}
          link="/admin/messages"
        />
        <StatCard 
          icon={Eye} 
          label="Blog Posts" 
          value={posts.length}
          link="/admin/blog"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Featured Projects" 
          value={projects.filter(p => p.featured).length}
          link="/admin/projects"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Messages</h2>
            <Link 
              to="/admin/messages"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              messages.slice(0, 5).map((msg) => (
                <RecentItem
                  key={msg.id}
                  title={msg.name}
                  subtitle={msg.message.substring(0, 50) + '...'}
                  time={formatTimeAgo(msg.created_at)}
                  type="message"
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link 
              to="/admin/projects"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No projects yet</p>
            ) : (
              projects.slice(0, 5).map((project) => (
                <RecentItem
                  key={project.id}
                  title={project.title}
                  subtitle={project.tech_stack.slice(0, 3).join(', ')}
                  time={formatTimeAgo(project.created_at)}
                  type="project"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            + Add Project
          </Link>
          <Link
            to="/admin/blog"
            className="px-4 py-2 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
          >
            + Write Post
          </Link>
          <Link
            to="/admin/settings"
            className="px-4 py-2 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
          >
            Update Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
