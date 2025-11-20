const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

// Tag can be either string[] or (...) => string[]
// use pural for collection
// use singular for single + (optional identifier if needed to target specifcs)
export const cacheComponentConfig = {
  modelListing: {
    tag: ["models"],
    profile: {
      stale: HOUR,
      revalidate: DAY * 7,
      expire: DAY * 30,
    },
  },
  modelProfile: {
    tag: (id: string): string[] => ["model", id],
    profile: {
      stale: HOUR,
      revalidate: DAY * 30,
      expire: DAY * 35,
    },
  },
  ladingPage: {
    tag: ["landing"],
    profile: {
      stale: HOUR,
      revalidate: DAY * 7,
      expire: DAY * 30,
    },
  },
  aboutPage: {
    tag: ["about"],
    profile: {
      stale: HOUR,
      revalidate: WEEK * 4,
      expire: WEEK * 8,
    },
  },
  contactPage: {
    tag: ["contact"],
    profile: {
      stale: HOUR,
      revalidate: WEEK * 4,
      expire: WEEK * 8,
    },
  },
} as const;

type CacheProfiles = {
  [K in keyof typeof cacheComponentConfig]: (typeof cacheComponentConfig)[K]["profile"];
};

export const cacheProfiles = Object.entries(cacheComponentConfig).reduce(
  (acc, [key, value]) => {
    acc[key] = value.profile;
    return acc;
  },
  {} as Record<string, unknown>,
) as CacheProfiles;
