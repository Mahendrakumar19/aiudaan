import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Udaan Blog | Master ChatGPT, Content Creation & AI Tools',
  description: 'Expert insights, tutorials, and success stories from Bihar\'s leading AI Bootcamp. Learn how to earn ₹1,00,000+ with AI skills.',
  keywords: [
    'AI training Bihar',
    'ChatGPT masterclass',
    'AI content creation',
    'AI filmmaking',
    'digital marketing AI',
    'AI Udaan Bootcamp',
    'AI earning opportunity'
  ],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com/blog',
  },
  openGraph: {
    title: 'AI Udaan Blog | Transform Your Future with AI',
    description: 'Explore our collection of articles on AI, machine learning, and digital skills.',
    url: 'https://aiudaanbootcamp.com/blog',
    type: 'website',
  },
}

const blogPosts = [
  {
    id: 'mastering-chatgpt-2026',
    title: 'Complete Guide to Mastering ChatGPT in 2026',
    excerpt: 'Learn advanced ChatGPT techniques, prompt engineering, and how to leverage AI for productivity.',
    author: 'AI Udaan Experts',
    date: '2026-04-10',
    category: 'AI Tools',
    readTime: '8 min read',
    icon: '🤖'
  },
  {
    id: 'midjourney-visual-content',
    title: 'Create Stunning Visual Content with Midjourney',
    excerpt: 'Discover how to use Midjourney for content creation and design without expensive tools.',
    author: 'Design Team',
    date: '2026-04-08',
    category: 'Design',
    readTime: '10 min read',
    icon: '🖼️'
  },
  {
    id: 'ai-earning-potential',
    title: 'How to Earn ₹1,00,000+ per month using AI',
    excerpt: 'A practical roadmap for students to monetize their AI skills in the 2026 gig economy.',
    author: 'Monetization Team',
    date: '2026-04-05',
    category: 'Earning',
    readTime: '15 min read',
    icon: '💰'
  },
]

export default function BlogPage() {
  return (
    <main className="relative min-h-screen pb-20">
      <div className="bg-mesh" />
      <div className="grid-lines" />

      {/* Blog Header */}
      <section className="section-pad pt-32 text-center">
        <h1 className="font-syne text-5xl md:text-7xl font-bold mb-6 text-white">
          AI Learning <span className="brand-gradient-text">Blog</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          Expert insights, tutorials, and guides on AI, machine learning, and digital skills. Stay updated with the latest trends and success stories.
        </p>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <article className="glass h-full p-8 rounded-[2rem] border-white/5 hover:border-brand-blue/30 transition-all flex flex-col">
                {/* Category Badge */}
                <div className="flex justify-between items-start mb-8">
                  <span className="px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-brand-blue/10 text-brand-cyan border border-brand-blue/20">
                    {post.category}
                  </span>
                  <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                    {post.icon}
                  </div>
                </div>

                {/* Post Title */}
                <h2 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-brand-cyan transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-text-secondary text-sm mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="mt-auto pt-6 border-t border-glass-border flex items-center justify-between text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                      ✎
                    </div>
                    {post.author}
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="section-pad mt-20">
        <div className="glass p-12 rounded-[3rem] max-w-4xl mx-auto border-brand-blue/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-30" />
          <h2 className="font-syne text-3xl font-bold mb-6 text-white">Subscribe to <span className="text-brand-cyan">AI Insights</span></h2>
          <p className="text-text-secondary mb-8">Get the latest AI tools and earning strategies delivered to your inbox weekly.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 glass border-white/10 px-6 py-4 rounded-xl text-white outline-none focus:border-brand-cyan/50"
            />
            <button className="btn-primary whitespace-nowrap">Join Now</button>
          </div>
        </div>
      </section>
    </main>
  )
}
