import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useSupabase';

export default function AdminBlog() {
  const { posts, loading } = useBlogPosts(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2">
          <Plus size={18} />
          New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <FileText size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Share your knowledge and experiences. Blog posts help establish your expertise and attract opportunities.
          </p>
          <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
            Write Your First Post
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded ${post.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="glass rounded-2xl p-6 border-primary/20">
        <h3 className="font-semibold mb-2">📝 Blog Editor Coming Soon</h3>
        <p className="text-sm text-muted-foreground">
          Full blog management with markdown editor, image uploads, and SEO optimization is being developed.
          For now, you can add posts directly via Supabase.
        </p>
      </div>
    </div>
  );
}
