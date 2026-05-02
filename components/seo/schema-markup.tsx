'use client'

const SchemaMarkup = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Buddha Institute of Technology',
    url: 'https://aiudaanbootcamp.com',
    logo: 'https://aiudaanbootcamp.com/images/logo.png',
    description: 'AI training and bootcamp platform for aspiring professionals',
    sameAs: [
      'https://facebook.com/aiudaanbootcamp',
      'https://twitter.com/aiudaanbootcamp',
      'https://linkedin.com/company/buddha-institute-technology',
      'https://youtube.com/@aiudaanbootcamp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+91-XXXXXXXXXX',
      email: 'info@aiudaanbootcamp.com',
      areaServed: 'IN',
      availableLanguage: 'en',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Buddha Institute of Technology',
      addressLocality: 'Gaya Ji',
      addressRegion: 'Bihar',
      postalCode: '823001',
      addressCountry: 'IN',
    },
  }

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AI Udaan Bootcamp 2026',
    description:
      'Master AI tools including ChatGPT, Midjourney, and content creation. Learn to build projects and start earning online.',
    url: 'https://aiudaanbootcamp.com',
    image: 'https://aiudaanbootcamp.com/images/course-image.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '250',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Buddha Institute of Technology',
    },
    duration: 'P2D',
    learningResourceType: 'Course',
    syllabus: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: '1',
          name: 'Foundations & AI Tools',
          description: 'Learn AI basics, ChatGPT mastery, design with Canva',
        },
        {
          '@type': 'ListItem',
          position: '2',
          name: 'Advanced Skills & Monetization',
          description: 'Prompt engineering, SaaS tools, earning strategies',
        },
      ],
    },
    offers: {
      '@type': 'Offer',
      url: 'https://aiudaanbootcamp.com/register',
      priceCurrency: 'INR',
      price: '4999',
      availability: 'InStock',
      offerCount: 5,
    },
    instructor: {
      '@type': 'Person',
      name: 'AI Experts',
      affiliation: {
        '@type': 'Organization',
        name: 'Buddha Institute of Technology',
      },
    },
  }

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'AI Udaan Bootcamp 2026',
    description: '2-Day intensive AI bootcamp with hands-on projects',
    startDate: '2026-04-25T09:00:00+05:30',
    endDate: '2026-04-26T18:00:00+05:30',
    eventStatus: 'EventScheduled',
    eventAttendanceMode: 'OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Buddha Institute of Technology',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Buddha Institute of Technology',
        addressLocality: 'Gaya',
        addressRegion: 'Bihar',
        postalCode: '823001',
        addressCountry: 'IN',
      },
    },
    image: 'https://aiudaanbootcamp.com/images/bootcamp-hero.png',
    organizer: {
      '@type': 'Organization',
      name: 'Buddha Institute of Technology',
      url: 'https://aiudaanbootcamp.com',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://aiudaanbootcamp.com/register',
      price: '4999',
      priceCurrency: 'INR',
      availability: 'LimitedAvailability',
      validFrom: '2026-01-01',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who can join the AI Udaan Bootcamp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The bootcamp is open to Class 10th passed, 12th passed, and graduate students. No prior AI experience required.',
        },
      },
      {
        '@type': 'Question',
        name: 'What will I learn in the bootcamp?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You will learn AI tools (ChatGPT, Midjourney), content creation, web applications, and monetization strategies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a certificate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all bootcamp participants receive an official certificate from Buddha Institute of Technology upon completion.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the bootcamp dates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The bootcamp is a 2-day intensive program. Exact dates are available on the registration page.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

export default SchemaMarkup
