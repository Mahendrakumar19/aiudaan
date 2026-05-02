'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type UTMParams = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
};

const UTMContext = createContext<UTMParams>({
  source: null,
  medium: null,
  campaign: null,
  term: null,
  content: null,
});

export const useUTM = () => useContext(UTMContext);

export default function UTMTracker({ children }: { children: React.ReactNode }) {
  const [utmParams, setUtmParams] = useState<UTMParams>({
    source: null,
    medium: null,
    campaign: null,
    term: null,
    content: null,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      term: urlParams.get('utm_term'),
      content: urlParams.get('utm_content'),
    };
    
    // Only update if we have some UTM params
    if (Object.values(utm).some(val => val !== null)) {
      setUtmParams(utm);
      // Optionally store in sessionStorage to persist across page navigations
      sessionStorage.setItem('utm_params', JSON.stringify(utm));
    } else {
      // Try to load from session storage
      const stored = sessionStorage.getItem('utm_params');
      if (stored) {
        try {
          setUtmParams(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse UTM params from session storage');
        }
      }
    }
  }, []);

  return (
    <UTMContext.Provider value={utmParams}>
      {children}
    </UTMContext.Provider>
  );
}
