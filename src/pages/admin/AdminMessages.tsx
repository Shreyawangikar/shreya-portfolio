import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  Trash2, 
  CheckCircle, 
  Reply,
  X,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { useContactMessages, markMessageAsRead, adminApi } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';
import type { ContactMessage } from '@/types/database';

export default function AdminMessages() {
  const { messages, loading, refetch, unreadCount } = useContactMessages();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.read) return false;
    if (filter === 'replied' && !msg.replied) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return msg.name.toLowerCase().includes(query) ||
             msg.email.toLowerCase().includes(query) ||
             msg.message.toLowerCase().includes(query);
    }
    return true;
  });

  const handleSelect = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await markMessageAsRead(message.id);
        refetch();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await adminApi.deleteMessage(id);
      toast({ title: 'Message deleted' });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      refetch();
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      await adminApi.markMessageReplied(id);
      toast({ title: 'Marked as replied' });
      refetch();
    } catch (error) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[400px,1fr] gap-6 h-[calc(100%-5rem)]">
        {/* Messages List */}
        <div className="glass rounded-2xl flex flex-col overflow-hidden">
          {/* Search and Filter */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'unread', 'replied'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No messages found
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full p-4 text-left border-b border-border hover:bg-secondary/50 transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-secondary/50' : ''
                  } ${!msg.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-medium truncate ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTimeAgo(msg.created_at)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate mt-0.5">
                        {msg.email}
                      </div>
                      <p className={`text-sm mt-1 line-clamp-2 ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {msg.message}
                      </p>
                      {msg.replied && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-500 mt-2">
                          <CheckCircle size={12} />
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="glass rounded-2xl flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary hover:underline flex items-center gap-1 text-sm mt-1"
                      >
                        <Mail size={14} />
                        {selectedMessage.email}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 hover:bg-secondary rounded-lg lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                    <Clock size={12} />
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message on my portfolio`}
                    className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Reply size={16} />
                    Reply via Email
                  </a>
                  {!selectedMessage.replied && (
                    <button
                      onClick={() => handleMarkReplied(selectedMessage.id)}
                      className="p-2 rounded-xl border border-border hover:bg-secondary hover:text-green-500 transition-colors"
                      title="Mark as replied"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl border border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center text-muted-foreground"
              >
                <div className="text-center">
                  <Mail size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Select a message to view</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
