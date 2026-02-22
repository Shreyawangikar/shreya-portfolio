import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  ExternalLink, 
  Github,
  X,
  Save,
  GripVertical
} from 'lucide-react';
import { useProjects, adminApi } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';
import type { Project, ProjectInsert } from '@/types/database';

const emptyProject: ProjectInsert = {
  title: '',
  description: '',
  long_description: '',
  image_url: '',
  tech_stack: [],
  github_url: '',
  live_url: '',
  featured: false,
  display_order: 0,
};

export default function AdminProjects() {
  const { projects, loading, refetch } = useProjects();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState<ProjectInsert>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');

  const handleCreate = async () => {
    if (!newProject.title || !newProject.description) {
      toast({ title: 'Title and description required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await adminApi.createProject({
        ...newProject,
        display_order: projects.length + 1,
      });
      toast({ title: 'Project created!' });
      setIsCreating(false);
      setNewProject(emptyProject);
      refetch();
    } catch (error) {
      toast({ title: 'Failed to create project', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingProject) return;
    setSaving(true);
    try {
      await adminApi.updateProject(editingProject.id, {
        title: editingProject.title,
        description: editingProject.description,
        long_description: editingProject.long_description,
        image_url: editingProject.image_url,
        tech_stack: editingProject.tech_stack,
        github_url: editingProject.github_url,
        live_url: editingProject.live_url,
        featured: editingProject.featured,
        display_order: editingProject.display_order,
      });
      toast({ title: 'Project updated!' });
      setEditingProject(null);
      refetch();
    } catch (error) {
      toast({ title: 'Failed to update project', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await adminApi.deleteProject(id);
      toast({ title: 'Project deleted' });
      refetch();
    } catch (error) {
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await adminApi.updateProject(project.id, { featured: !project.featured });
      toast({ title: project.featured ? 'Removed from featured' : 'Added to featured' });
      refetch();
    } catch (error) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const addTech = (isEditing: boolean) => {
    if (!techInput.trim()) return;
    if (isEditing && editingProject) {
      setEditingProject({
        ...editingProject,
        tech_stack: [...editingProject.tech_stack, techInput.trim()],
      });
    } else {
      setNewProject({
        ...newProject,
        tech_stack: [...newProject.tech_stack, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const removeTech = (index: number, isEditing: boolean) => {
    if (isEditing && editingProject) {
      setEditingProject({
        ...editingProject,
        tech_stack: editingProject.tech_stack.filter((_, i) => i !== index),
      });
    } else {
      setNewProject({
        ...newProject,
        tech_stack: newProject.tech_stack.filter((_, i) => i !== index),
      });
    }
  };

  const ProjectForm = ({ 
    data, 
    setData, 
    onSave, 
    onCancel, 
    isEditing 
  }: { 
    data: ProjectInsert | Project;
    setData: (p: ProjectInsert | Project) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Edit Project' : 'New Project'}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Project title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Display Order</label>
          <input
            type="number"
            value={data.display_order}
            onChange={(e) => setData({ ...data, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Short Description *</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            placeholder="Brief project description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Long Description</label>
          <textarea
            value={data.long_description || ''}
            onChange={(e) => setData({ ...data, long_description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            placeholder="Detailed project description for case study..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={data.github_url || ''}
            onChange={(e) => setData({ ...data, github_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Live URL</label>
          <input
            type="url"
            value={data.live_url || ''}
            onChange={(e) => setData({ ...data, live_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={data.image_url || ''}
            onChange={(e) => setData({ ...data, image_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={data.featured}
            onChange={(e) => setData({ ...data, featured: e.target.checked })}
            className="w-5 h-5 rounded border border-border bg-secondary"
          />
          <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech(isEditing))}
              className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Add technology..."
            />
            <button
              onClick={() => addTech(isEditing)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.tech_stack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2"
              >
                {tech}
                <button onClick={() => removeTech(i, isEditing)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        {!isCreating && !editingProject && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Add Project
          </button>
        )}
      </div>

      <AnimatePresence>
        {isCreating && (
          <ProjectForm
            data={newProject}
            setData={setNewProject}
            onSave={handleCreate}
            onCancel={() => (setIsCreating(false), setNewProject(emptyProject))}
            isEditing={false}
          />
        )}
        {editingProject && (
          <ProjectForm
            data={editingProject}
            setData={setEditingProject}
            onSave={handleUpdate}
            onCancel={() => setEditingProject(null)}
            isEditing={true}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl">
          <p className="text-muted-foreground">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="text-muted-foreground cursor-grab">
                <GripVertical size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  {project.featured && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <Github size={18} />
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`p-2 rounded-lg hover:bg-secondary ${project.featured ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                >
                  <Star size={18} />
                </button>
                <button
                  onClick={() => setEditingProject(project)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
