import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Project, 
  ProjectInsert, 
  ProjectUpdate,
  ContactMessage,
  ContactMessageInsert,
  BlogPost,
  Skill,
  Achievement,
} from '@/types/database';

// Use the properly initialized Supabase client
const db = supabase;

// =============================================
// PROJECTS HOOKS
// =============================================

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      let query = db
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (featuredOnly) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [featuredOnly]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject((data as Project) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}

// =============================================
// CONTACT MESSAGES HOOKS
// =============================================

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      setUnreadCount(data?.filter((m: ContactMessage) => !m.read).length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, unreadCount, refetch: fetchMessages };
}

export async function submitContactMessage(message: ContactMessageInsert) {
  try {
    // 1️⃣ Insert into Supabase database
    const { data, error } = await db
      .from('contact_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;

    // 2️⃣ Call Edge Function properly using Supabase client
const { data: functionData, error: functionError } =
  await supabase.functions.invoke("send-contact-email", {
    body: message,
  });

if (functionError) {
  throw new Error(functionError.message);
}

    return data;

  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message");
  }
}

export async function markMessageAsRead(id: string) {
  const { error } = await db
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id);

  if (error) throw error;
}

// =============================================
// BLOG POSTS HOOKS
// =============================================

export function useBlogPosts(publishedOnly = true) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = db
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (publishedOnly) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}

// =============================================
// SKILLS HOOKS
// =============================================

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSkills((data || []) as Skill[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, refetch: fetchSkills };
}

// =============================================
// ACHIEVEMENTS HOOKS
// =============================================

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('achievements')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, loading, error, refetch: fetchAchievements };
}

// =============================================
// SITE SETTINGS HOOKS
// =============================================

interface SiteSetting {
  key: string;
  value: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      const settingsMap: Record<string, string> = {};
      data?.forEach((s: SiteSetting) => {
        settingsMap[s.key] = s.value || '';
      });
      setSettings(settingsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

// =============================================
// ADMIN CRUD OPERATIONS
// =============================================

export const adminApi = {
  // Projects
  async createProject(project: ProjectInsert) {
    const { data, error } = await db
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: ProjectUpdate) {
    const { data, error } = await db
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await db
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Blog Posts
  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await db
      .from('blog_posts')
      .insert([post])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>) {
    const { data, error } = await db
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteBlogPost(id: string) {
    const { error } = await db
      .from('blog_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Messages
  async deleteMessage(id: string) {
    const { error } = await db
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async markMessageReplied(id: string) {
    const { error } = await db
      .from('contact_messages')
      .update({ replied: true })
      .eq('id', id);
    if (error) throw error;
  },

  // Skills
  async createSkill(skill: Omit<Skill, 'id' | 'created_at'>) {
    const { data, error } = await db
      .from('skills')
      .insert([skill])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSkill(id: string, updates: Partial<Skill>) {
    const { data, error } = await db
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSkill(id: string) {
    const { error } = await db
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Site Settings
  async updateSetting(key: string, value: string) {
    const { error } = await db
      .from('site_settings')
      .upsert({ key, value })
      .eq('key', key);
    if (error) throw error;
  }
};
