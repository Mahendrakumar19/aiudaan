/**
 * Image Optimization Utility for SEO
 * This file provides guidelines for optimizing images across the site
 */

export const imageOptimizationGuide = {
  // Image size optimization
  sizes: {
    thumbnail: { width: 150, height: 150, quality: 80 },
    small: { width: 400, height: 300, quality: 85 },
    medium: { width: 800, height: 600, quality: 85 },
    large: { width: 1200, height: 900, quality: 85 },
    hero: { width: 1920, height: 1080, quality: 90 },
  },

  // Responsive image breakpoints
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },

  // SEO best practices for images
  bestPractices: {
    altText:
      'Always provide descriptive alt text that includes relevant keywords without keyword stuffing',
    fileNames:
      'Use descriptive, hyphenated filenames: ai-bootcamp-hero-image.png instead of image1.png',
    compression: 'Compress all images using tools like ImageOptim, TinyPNG, or Sharp',
    formats: 'Use modern formats: WebP for modern browsers, with PNG/JPG fallbacks',
    loading: 'Use lazy loading for images below the fold: loading="lazy"',
    lqip: 'Consider LQIP (Low Quality Image Placeholder) for better perceived performance',
  },

  // Schema markup for images
  imageSchema: {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    // Include URL, name, description, and author
  },

  // Optimization checklist
  checklist: [
    '✓ All images have descriptive alt text',
    '✓ Image filenames are descriptive and SEO-friendly',
    '✓ Images are compressed and optimized',
    '✓ Using next/image component for automatic optimization',
    '✓ Images use lazy loading for off-screen images',
    '✓ Image size is appropriate for the context',
    '✓ Using WebP format with fallbacks',
    '✓ Images have proper aspect ratios',
  ],
}

/**
 * Usage in Next.js:
 *
 * import Image from 'next/image'
 *
 * <Image
 *   src="/images/bootcamp-hero.png"
 *   alt="AI Udaan Bootcamp 2026 - Learn AI Tools and Content Creation"
 *   width={1200}
 *   height={630}
 *   priority={true}  // For above-the-fold images
 *   loading="lazy"   // For below-the-fold images
 *   quality={85}
 *   srcSet={`
 *     /images/bootcamp-hero-sm.png 640w,
 *     /images/bootcamp-hero-md.png 1024w,
 *     /images/bootcamp-hero-lg.png 1440w
 *   `}
 * />
 */

export default imageOptimizationGuide
