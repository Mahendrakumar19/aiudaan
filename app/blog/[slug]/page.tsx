import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Blog posts database
const blogPosts: Record<string, any> = {
  'chatgpt-master-guide': {
    id: 'chatgpt-master-guide',
    title: 'Complete Guide to Mastering ChatGPT in 2026',
    subtitle: 'Advanced techniques and strategies to leverage ChatGPT for maximum productivity',
    author: 'AI Experts at Buddha Institute',
    date: '2026-04-10',
    updated: '2026-04-15',
    category: 'AI Tools',
    readTime: '8 min read',
    image: '/images/blog-chatgpt.png',
    excerpt: 'Learn advanced ChatGPT techniques, prompt engineering, and how to leverage AI for productivity.',
    content: `
# Complete Guide to Mastering ChatGPT in 2026

ChatGPT has revolutionized the way professionals work. In this comprehensive guide, we'll explore advanced techniques to maximize your productivity.

## 1. Advanced Prompt Engineering

The key to getting better results from ChatGPT is crafting precise prompts. Here are proven strategies:

### Be Specific and Detailed
Instead of: "Write an article"
Try: "Write a 500-word SEO-optimized article about AI bootcamps targeting students aged 18-25, with 3 internal links to course pages"

### Use System Prompts
Define the context and role for ChatGPT to understand the context better.

## 2. Using ChatGPT for Content Creation

Learn how to leverage ChatGPT for:
- Blog posts and articles
- Social media content
- Email campaigns
- Product descriptions

## 3. ChatGPT for Development

Use ChatGPT to accelerate your development workflow:
- Code generation
- Bug fixing
- Documentation
- Architecture design

## 4. Advanced Techniques

### Chain of Thought Prompting
Break complex problems into smaller steps for better results.

### Few-Shot Learning
Provide examples of desired output format for consistency.

### Temperature and Parameters
Understand how to adjust model parameters for different use cases.

## Conclusion

Mastering ChatGPT requires practice and experimentation. Start with these techniques and refine based on your specific needs.
    `,
    keywords: ['ChatGPT', 'AI tools', 'productivity', 'prompt engineering'],
    relatedPosts: ['content-creation-with-midjourney', 'ai-web-development'],
  },
  'content-creation-with-midjourney': {
    id: 'content-creation-with-midjourney',
    title: 'Create Stunning Visual Content with Midjourney',
    subtitle: 'Master AI-powered image generation for content creation',
    author: 'Design Team',
    date: '2026-04-08',
    updated: '2026-04-14',
    category: 'Content Creation',
    readTime: '10 min read',
    image: '/images/blog-midjourney.png',
    excerpt: 'Discover how to use Midjourney for content creation and design without expensive tools.',
    content: `
# Create Stunning Visual Content with Midjourney

Midjourney is a powerful AI tool for creating professional-quality images. Learn how to master it.

## Getting Started with Midjourney

1. Join the Midjourney Discord server
2. Understand basic commands
3. Create your first image

## Prompt Structure

A good Midjourney prompt includes:
- Subject/Object
- Style/Medium
- Lighting
- Composition
- Resolution/Quality

## Use Cases

- Social media content
- Blog header images
- Marketing materials
- Mockups and prototypes

## Pro Tips

- Use reference images
- Experiment with styles
- Iterate and refine
- Version and upscale strategically

## Best Practices

Always credit Midjourney and understand licensing for commercial use.
    `,
    keywords: ['Midjourney', 'content creation', 'AI art', 'visual design'],
    relatedPosts: ['chatgpt-master-guide', 'ai-web-development'],
  },
  'ai-web-development': {
    id: 'ai-web-development',
    title: 'Building Web Apps with AI-Assisted Development',
    subtitle: 'Use AI tools to accelerate your development workflow',
    author: 'Dev Team',
    date: '2026-04-05',
    updated: '2026-04-12',
    category: 'Web Development',
    readTime: '12 min read',
    image: '/images/blog-development.png',
    excerpt: 'Use GitHub Copilot and AI tools to accelerate your web development workflow.',
    content: `
# Building Web Apps with AI-Assisted Development

Learn how to use AI tools like GitHub Copilot to boost your development productivity.

## AI Tools for Development

1. **GitHub Copilot** - Code completion and generation
2. **ChatGPT** - Problem solving and debugging
3. **Cursor** - AI-powered IDE
4. **Tabnine** - Smart code completion

## Using GitHub Copilot Effectively

GitHub Copilot can help with:
- Boilerplate code generation
- Function implementations
- Unit test writing
- Documentation

## Best Practices

- Review AI-generated code
- Understand what the code does
- Combine AI assistance with your expertise
- Use for productivity, not replacement of skills

## Real-World Examples

### Generate React Component
### Create API Endpoints
### Write Database Queries

## Conclusion

AI-assisted development is the future. Master these tools to stay competitive.
    `,
    keywords: ['Web development', 'GitHub Copilot', 'AI coding', 'development tools'],
    relatedPosts: ['chatgpt-master-guide', 'content-creation-with-midjourney'],
  },
}

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: BlogPostProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const baseUrl = 'https://aiudaanbootcamp.com'

  return {
    title: `${post.title} | AI Udaan Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      images: [
        {
          url: `${baseUrl}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@aiudaanbootcamp',
      images: [`${baseUrl}${post.image}`],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href="/blog" className="hover:text-blue-600">
            Blog
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-4 inline-block">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
              {post.category}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-2xl text-slate-600 mb-6">{post.subtitle}</p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 border-t border-b border-slate-200 py-4">
            <div>
              <p className="text-sm text-slate-500">By</p>
              <p className="font-semibold text-slate-900">{post.author}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Published</p>
              <p className="font-semibold text-slate-900">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Read Time</p>
              <p className="font-semibold text-slate-900">{post.readTime}</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-slate max-w-4xl mx-auto mb-12">
          <div
            className="text-slate-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/<h1/g, '<h1 class="text-4xl font-black text-slate-900 mt-8 mb-4"')
                .replace(/<h2/g, '<h2 class="text-2xl font-bold text-slate-900 mt-6 mb-3"')
                .replace(/<h3/g, '<h3 class="text-xl font-semibold text-slate-800 mt-4 mb-2"')
                .replace(/<p/g, '<p class="text-slate-700"')
                .replace(/<ul/g, '<ul class="list-disc list-inside space-y-2"')
                .replace(/<li/g, '<li class="text-slate-700"'),
            }}
          />
        </div>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {post.relatedPosts.map((relatedSlug: string) => {
                const relatedPost = blogPosts[relatedSlug]
                return (
                  <Link
                    key={relatedSlug}
                    href={`/blog/${relatedSlug}`}
                    className="group p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Master AI?</h3>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Join our AI Udaan Bootcamp and learn all these skills hands-on with expert instructors.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Now →
          </Link>
        </div>
      </article>
    </div>
  )
}
