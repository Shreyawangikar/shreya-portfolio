import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, FileText, Briefcase, Globe } from 'lucide-react';
import { useSiteSettings, adminApi } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { settings, loading, refetch } = useSiteSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(localSettings)) {
        if (settings[key] !== value) {
          await adminApi.updateSetting(key, value);
        }
      }
      toast({ title: 'Settings saved!' });
      refetch();
    } catch (error) {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const settingsGroups = [
    {
      title: 'Hero Section',
      icon: User,
      fields: [
        { key: 'hero_title', label: 'Title / Role', placeholder: 'Full-Stack Developer' },
        { key: 'hero_subtitle', label: 'Subtitle', placeholder: 'Building exceptional digital experiences...' },
      ]
    },
    {
      title: 'About',
      icon: FileText,
      fields: [
        { key: 'about_text', label: 'About Text', placeholder: 'I am a passionate developer...', multiline: true },
      ]
    },
    {
      title: 'Professional',
      icon: Briefcase,
      fields: [
        { key: 'resume_url', label: 'Resume URL', placeholder: '/resume.pdf' },
        { key: 'availability_status', label: 'Availability Status', placeholder: 'available' },
      ]
    },
    {
      title: 'Social Links',
      icon: Globe,
      fields: [
        { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/...' },
        { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
        { key: 'twitter_url', label: 'Twitter/X URL', placeholder: 'https://twitter.com/...' },
      ]
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {settingsGroups.map((group, i) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <group.icon className="text-primary" size={20} />
            </div>
            <h2 className="text-lg font-semibold">{group.title}</h2>
          </div>

          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                {field.multiline ? (
                  <textarea
                    value={localSettings[field.key] || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={localSettings[field.key] || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Database Notice */}
      <div className="glass rounded-2xl p-6 border-yellow-500/20 bg-yellow-500/5">
        <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-muted-foreground">
          Settings are stored in Supabase. You can also manage skills and achievements 
          directly from the Supabase dashboard for more advanced customization.
        </p>
      </div>
    </div>
  );
}
