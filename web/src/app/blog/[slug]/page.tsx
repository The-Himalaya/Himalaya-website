import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { fetchBlogPostBySlug } from '@/lib/api';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverImage = post.image || (post.images && post.images[0]) || '';
  const extraImages = post.images && post.images.length > 1 ? post.images.slice(1) : [];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section
        className="relative py-24 bg-[var(--himalaya-navy)]"
        style={coverImage ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {coverImage && <div className="absolute inset-0 bg-[var(--himalaya-navy)]/75" />}
        <div className="relative container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          {post.category && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[var(--himalaya-red)] px-3 py-1 rounded mb-4">
              <Tag className="w-3 h-3" />
              {post.category}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-6 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-white/70 mb-8 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            )}
            {post.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {post.content ? (
            <div className="prose prose-lg max-w-none text-[var(--himalaya-black)] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          ) : (
            <p className="text-[var(--himalaya-smoke)] italic">No content available.</p>
          )}

          {/* Additional images */}
          {extraImages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-display uppercase text-[var(--himalaya-black)] mb-6">Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${post.title} image ${i + 2}`}
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--himalaya-navy)] hover:text-[var(--himalaya-red)] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
