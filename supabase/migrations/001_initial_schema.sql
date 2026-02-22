-- Portfolio Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BLOG POSTS TABLE (Optional)
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'frontend', 'backend', 'tools', 'other'
  proficiency INTEGER DEFAULT 80, -- 0-100
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  metric VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SITE SETTINGS TABLE (for editable content)
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for projects (anyone can view)
CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- Public read access for published blog posts
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true);

-- Public read access for skills and achievements
CREATE POLICY "Skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- Public read access for site settings
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

-- Anyone can insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contact messages" ON contact_messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage achievements" ON achievements
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA (Initial Projects)
-- =============================================
INSERT INTO projects (title, description, long_description, tech_stack, github_url, live_url, featured, display_order) VALUES
(
  'AI-Powered Task Manager',
  'A smart task management app with AI prioritization and natural language processing.',
  'Built a comprehensive task management solution that uses machine learning to automatically prioritize tasks based on deadlines, importance, and user behavior patterns. Features include smart scheduling, team collaboration, and detailed analytics.',
  ARRAY['React', 'TypeScript', 'OpenAI', 'Supabase', 'TailwindCSS'],
  'https://github.com/Shreyawangikar/task-manager',
  NULL,
  true,
  1
),
(
  'E-Commerce Platform',
  'Full-stack e-commerce solution with payment integration and inventory management.',
  'Developed a scalable e-commerce platform supporting multiple vendors, real-time inventory tracking, Stripe payment integration, and comprehensive admin dashboard. Handles 10k+ products with sub-second search.',
  ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
  'https://github.com/Shreyawangikar/ecommerce',
  NULL,
  true,
  2
),
(
  'Real-Time Chat Application',
  'WebSocket-based chat with end-to-end encryption and file sharing.',
  'Created a secure real-time messaging platform with WebSocket connections, end-to-end encryption, file sharing capabilities, and message reactions. Supports group chats and direct messages.',
  ARRAY['React', 'Socket.io', 'Express', 'MongoDB', 'WebRTC'],
  'https://github.com/Shreyawangikar/chat-app',
  NULL,
  true,
  3
),
(
  'Portfolio Website',
  'This very portfolio - a showcase of modern web development practices.',
  'Built with React, TypeScript, and TailwindCSS. Features include 3D animations, AI chatbot, admin panel, and Supabase backend integration.',
  ARRAY['React', 'TypeScript', 'Three.js', 'Supabase', 'Framer Motion'],
  'https://github.com/Shreyawangikar/portfolio',
  NULL,
  false,
  4
);

-- Seed Skills
INSERT INTO skills (name, category, proficiency, display_order) VALUES
('React', 'frontend', 95, 1),
('TypeScript', 'frontend', 90, 2),
('Next.js', 'frontend', 85, 3),
('TailwindCSS', 'frontend', 95, 4),
('Node.js', 'backend', 85, 5),
('Python', 'backend', 80, 6),
('PostgreSQL', 'backend', 80, 7),
('MongoDB', 'backend', 75, 8),
('Git', 'tools', 90, 9),
('Docker', 'tools', 70, 10),
('AWS', 'tools', 65, 11),
('Figma', 'tools', 75, 12);

-- Seed Achievements
INSERT INTO achievements (title, description, metric, display_order) VALUES
('Projects Completed', 'Successfully delivered projects across various domains', '50+', 1),
('GitHub Contributions', 'Active open source contributor', '500+', 2),
('Happy Clients', 'Satisfied customers and employers', '20+', 3),
('Years Experience', 'Professional development experience', '3+', 4);

-- Seed Site Settings
INSERT INTO site_settings (key, value) VALUES
('hero_title', 'Full-Stack Developer'),
('hero_subtitle', 'Building exceptional digital experiences with modern web technologies'),
('about_text', 'I am a passionate full-stack developer with expertise in React, TypeScript, and Node.js. I love creating beautiful, performant web applications that solve real problems.'),
('resume_url', '/resume.pdf'),
('availability_status', 'available');
