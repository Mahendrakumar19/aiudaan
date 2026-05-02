/**
 * SEO Configuration for AI Udaan Bootcamp
 * Centralized configuration for all SEO-related settings
 */

export const seoConfig = {
  // Site Information
  site: {
    name: 'AI Udaan Bootcamp',
    url: 'https://aiudaanbootcamp.com',
    description:
      'Master AI tools, content creation, and start earning. 2-Day intensive bootcamp at Buddha Institute of Technology.',
    language: 'en-US',
    locale: 'en_US',
    type: 'website',
    category: 'Education',
  },

  // Organization Information for Schema
  organization: {
    name: 'Buddha Institute of Technology',
    url: 'https://aiudaanbootcamp.com',
    logo: 'https://aiudaanbootcamp.com/images/logo.png',
    description: 'AI training and bootcamp platform',
    email: 'info@aiudaanbootcamp.com',
    phone: '+91-XXXXXXXXXX',
    address: {
      street: 'Buddha Institute of Technology',
      city: 'Gaya',
      state: 'Bihar',
      postalCode: '823001',
      country: 'India',
    },
    social: {
      facebook: 'https://facebook.com/aiudaanbootcamp',
      twitter: 'https://twitter.com/aiudaanbootcamp',
      linkedin: 'https://linkedin.com/company/buddha-institute-technology',
      youtube: 'https://youtube.com/@aiudaanbootcamp',
    },
  },

  // Keywords Strategy
  keywords: {
    primary: [
      'AI bootcamp',
      'ChatGPT course',
      'AI course',
      'learn AI',
      'content creation',
    ],
    secondary: [
      'Midjourney course',
      'digital marketing',
      'online learning',
      'AI training',
      'bootcamp 2026',
    ],
    location: ['Gaya bootcamp', 'Bihar AI course', 'Gaya education'],
  },

  // Internal Linking Strategy
  internalLinks: {
    homepage: '/',
    courses: '/courses',
    blog: '/blog',
    about: '/about',
    contact: '/contact',
    enquire: '/enquire',
    register: '/register',
    dashboard: '/dashboard',
    privacyPolicy: '/privacy-policy',
    termsAndConditions: '/terms-and-conditions',
    cancellationPolicy: '/cancellation-policy',
  },

  // SEO Best Practices Checklist
  checklist: {
    globalSEO: {
      metadataAPI: '✓ Using Next.js Metadata API',
      canonicalURL: '✓ Canonical URLs configured',
      ogTags: '✓ OpenGraph tags implemented',
      twitterCards: '✓ Twitter Card meta tags',
      robots: '✓ Robots meta tag configured',
      viewport: '✓ Viewport meta tag for mobile',
    },
    contentOptimization: {
      h1Tags: '✓ One H1 per page',
      headingHierarchy: '✓ Proper H2, H3 hierarchy',
      readability: '✓ Content is readable and scannable',
      keywordUsage: '✓ Keywords used naturally',
      internalLinks: '✓ Strategic internal linking',
    },
    technicalSEO: {
      sitemapXml: '✓ Sitemap.xml generated',
      robotsTxt: '✓ Robots.txt configured',
      structuredData: '✓ JSON-LD schema markup',
      mobileOptimized: '✓ Mobile-friendly design',
      pageSpeed: '✓ Core Web Vitals optimized',
    },
    performance: {
      imageOptimization: '✓ Images optimized with next/image',
      fontOptimization: '✓ Fonts loaded with next/font',
      caching: '✓ Cache headers configured',
      compression: '✓ Gzip compression enabled',
      lazyLoading: '✓ Lazy loading implemented',
    },
  },

  // Page-specific keywords and meta descriptions
  pages: {
    '/': {
      title: 'AI Udaan Bootcamp 2026 - Master AI Tools & Content Creation',
      description:
        'Join the 2-Day AI Udaan Bootcamp at Buddha Institute. Learn ChatGPT, Midjourney, content creation. Limited seats available.',
      keywords: ['AI bootcamp', 'learn AI', 'ChatGPT course', 'content creation'],
    },
    '/courses': {
      title: 'AI & Technology Courses | AI Udaan Bootcamp',
      description:
        'Explore our comprehensive AI and technology courses. Learn ChatGPT, web development, content creation, and more.',
      keywords: ['courses', 'AI courses', 'online learning', 'technology courses'],
    },
    '/blog': {
      title: 'AI Learning Blog | Expert Insights & Tutorials',
      description:
        'Read latest articles on AI, machine learning, ChatGPT, content creation, and web development.',
      keywords: ['blog', 'AI articles', 'tutorials', 'guides'],
    },
    '/about': {
      title: 'About AI Udaan Bootcamp | Buddha Institute',
      description:
        'Learn about AI Udaan Bootcamp mission and Buddha Institute of Technology. Our vision to empower AI professionals.',
      keywords: ['about', 'Buddha Institute', 'bootcamp'],
    },
    '/contact': {
      title: 'Contact Us | AI Udaan Bootcamp',
      description:
        'Get in touch with AI Udaan Bootcamp. Have questions? Contact us for more information.',
      keywords: ['contact', 'support', 'inquiry'],
    },
  },

  // Social Media URLs
  socialMedia: {
    facebook: 'https://facebook.com/aiudaanbootcamp',
    twitter: 'https://twitter.com/aiudaanbootcamp',
    instagram: 'https://instagram.com/aiudaanbootcamp',
    linkedin: 'https://linkedin.com/company/buddha-institute-technology',
    youtube: 'https://youtube.com/@aiudaanbootcamp',
  },

  // Rich snippets / Structured data
  schema: {
    enableOrganization: true,
    enableCourse: true,
    enableEvent: true,
    enableFAQ: true,
    enableBreadcrumb: true,
    enableReview: true,
  },

  // Performance metrics targets
  performanceTargets: {
    coreWebVitals: {
      LCP: '< 2.5s', // Largest Contentful Paint
      FID: '< 100ms', // First Input Delay
      CLS: '< 0.1', // Cumulative Layout Shift
    },
    pagespeed: {
      desktop: 90,
      mobile: 85,
    },
  },
}

// Export for use across the application
export default seoConfig
