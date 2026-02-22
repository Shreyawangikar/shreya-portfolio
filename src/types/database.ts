// Database Types for Portfolio
// These match the Supabase schema

export interface Project {
  id: string;
  title: string;
  description: string | null;
  long_description?: string;
  image_url: string | null;
  tech_stack?: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean | null;
  display_order: number | null;
  created_at: string | null;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean | null;
  replied: boolean | null;
  created_at: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  level: number | null;
  display_order: number | null;
  created_at: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  metric: string;
  display_order: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  updated_at: string;
}

// Insert types (for creating new records)
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'created_at' | 'read' | 'replied'>;
export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type SkillInsert = Omit<Skill, 'id' | 'created_at'>;
export type AchievementInsert = Omit<Achievement, 'id' | 'created_at'>;

// Update types (for partial updates)
export type ProjectUpdate = Partial<ProjectInsert>;
export type ContactMessageUpdate = Partial<Pick<ContactMessage, 'read' | 'replied'>>;
export type BlogPostUpdate = Partial<BlogPostInsert>;
export type SkillUpdate = Partial<SkillInsert>;
export type AchievementUpdate = Partial<AchievementInsert>;
