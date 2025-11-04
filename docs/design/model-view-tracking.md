# Model View Tracking System

## Overview

This document describes the design and implementation of the model profile view tracking system. The system tracks both total views and unique visitors for model profiles, providing analytics data for internal dashboards and front page model selection.

**Key Characteristics:**
- Native implementation using PostgreSQL/Drizzle ORM
- On-the-fly aggregation (calculated from raw events)
- Small scale optimized (< 1K views/day)
- Internal use only (no public-facing analytics)
- Simple single-table design

## Architecture

### Single-Table Design

The system uses a single `model_views` table that stores all raw view events. Statistics are calculated on-the-fly using SQL aggregation queries.

**Benefits:**
- Simpler architecture (one source of truth)
- No synchronization issues between raw and aggregated data
- Always accurate, real-time statistics
- PostgreSQL handles aggregations efficiently at this scale
- Easier to maintain and debug

**Trade-offs:**
- Slightly slower queries (milliseconds) due to aggregation
- At < 1K views/day, this is negligible performance impact
- If scale increases significantly, can add materialized views or caching layer

### Data Flow

```
Profile Page Load
    ↓
Generate/Retrieve Viewer Identifier (Cookie/Session)
    ↓
Server Action: trackModelView()
    ↓
Insert into model_views table
    ↓
Query Statistics (when needed)
    ↓
Aggregate on-the-fly: COUNT(*), COUNT(DISTINCT viewer_identifier), MAX(viewed_at)
    ↓
Return stats to dashboard/frontend
```

## Database Schema

### `model_views` Table (Raw View Events)

**Location:** `db/schema/index.ts:88-113`

Stores individual view events with metadata. All statistics are calculated on-the-fly from this table.

```typescript
{
  id: UUID (PK, auto-generated)
  modelId: UUID (FK → models.id, CASCADE DELETE)
  viewerIdentifier: VARCHAR(255) (hashed cookie/session ID)
  viewedAt: TIMESTAMP (default: now())
  ipAddress: VARCHAR(45) (optional, for geographic analysis)
  userAgent: TEXT (optional, for device insights)
}
```

**Indexes:**
- `model_views_model_idx` on `modelId` - For per-model queries
- `model_views_viewed_at_idx` on `viewedAt` - For time-range analytics
- `model_views_viewer_idx` on `viewerIdentifier` - For unique visitor queries
- `model_views_model_viewer_idx` on `(modelId, viewerIdentifier)` - Composite index for efficient GROUP BY operations

**Design Decisions:**

1. **viewerIdentifier as VARCHAR(255)**
   - Stores hashed value of browser cookie or session ID
   - Not directly identifiable (privacy-friendly)
   - Used to distinguish unique visitors from repeat visitors
   - Should be a stable hash (SHA256 of cookie + salt)

2. **ipAddress as VARCHAR(45)**
   - IPv4 (15 chars) and IPv6 (45 chars) compatible
   - Optional field for future geographic insights
   - Consider privacy implications before storing

3. **userAgent as TEXT**
   - Full user agent string for device/browser analysis
   - Can be parsed later for device type categorization
   - Optional to reduce storage if not needed

4. **CASCADE DELETE on modelId**
   - When model is deleted, all view records are removed
   - Maintains referential integrity
   - No orphaned analytics data

5. **Composite Index on (modelId, viewerIdentifier)**
   - Dramatically speeds up COUNT(DISTINCT viewerIdentifier) queries
   - Essential for efficient unique visitor counting
   - Supports both single-model and cross-model aggregation queries

### Calculating Statistics

Statistics are computed using SQL aggregation functions:

```sql
-- Get stats for a single model
SELECT
  model_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT viewer_identifier) as unique_views,
  MAX(viewed_at) as last_viewed_at
FROM model_views
WHERE model_id = '...'
GROUP BY model_id;

-- Get top viewed models
SELECT
  model_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT viewer_identifier) as unique_views,
  MAX(viewed_at) as last_viewed_at
FROM model_views
GROUP BY model_id
ORDER BY total_views DESC
LIMIT 10;
```

**Performance Notes:**
- Composite index `(modelId, viewerIdentifier)` makes these queries very fast
- At < 1K views/day (~30K rows/month), aggregation takes < 10ms
- PostgreSQL query planner optimizes these patterns efficiently
- Can add materialized views later if scale increases

## Unique Visitor Identification Strategy

### Client-Side Implementation

**Cookie-Based Approach (Recommended for small scale):**

```typescript
// utils/viewerIdentifier.ts
import { cookies } from 'next/headers';
import crypto from 'crypto';

export function getOrCreateViewerIdentifier(): string {
  const cookieStore = cookies();
  let identifier = cookieStore.get('viewer_id')?.value;

  if (!identifier) {
    identifier = crypto.randomUUID();
    cookieStore.set('viewer_id', identifier, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  }

  return hashIdentifier(identifier);
}

function hashIdentifier(identifier: string): string {
  const salt = process.env.VIEWER_ID_SALT || 'default-salt';
  return crypto
    .createHash('sha256')
    .update(identifier + salt)
    .digest('hex');
}
```

**Considerations:**
- Cookie survives browser sessions (persistent identification)
- Privacy-friendly: Raw UUID never leaves server, only hash stored in DB
- Not perfect: User can clear cookies, private browsing resets identifier
- Good enough for small-scale internal analytics
- GDPR compliant (no personal data, can be considered legitimate interest)

### Alternative Approaches (Future)

1. **Session-Based:** Shorter duration, less accurate uniqueness
2. **Fingerprinting:** Browser fingerprints (more invasive, less reliable)
3. **Authenticated Users:** Most accurate but requires login

## Implementation Phases

### Phase 1: Schema & Data Layer (CURRENT)

- [x] Define database schema
- [x] Add `model_views` table to `db/schema/index.ts`
- [x] Export TypeScript types
- [ ] Generate and apply migrations

### Phase 2: Server Actions

**File:** `lib/actions/model-views.ts`

```typescript
// Track a model profile view
export async function trackModelView(
  modelId: string,
  viewerIdentifier: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<ActionState<{ success: boolean }>>;

// Get stats for a single model (calculated on-the-fly)
export async function getModelViewStats(
  modelId: string
): Promise<ActionState<{
  modelId: string;
  totalViews: number;
  uniqueViews: number;
  lastViewedAt: Date | null;
}>>;

// Get top viewed models (for front page selection)
export async function getTopViewedModels(
  limit: number,
  category?: string
): Promise<ActionState<Array<{
  modelId: string;
  totalViews: number;
  uniqueViews: number;
  lastViewedAt: Date | null;
}>>>;
```

**Validators:** `lib/validators/model-views.ts`

### Phase 3: Client Integration

**Profile Page Component:**

```typescript
// app/models/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { trackModelView } from '@/lib/actions/model-views';
import { getOrCreateViewerIdentifier } from '@/utils/viewerIdentifier';

export default function ModelProfilePage({ params }) {
  useEffect(() => {
    const viewerIdentifier = getOrCreateViewerIdentifier();
    trackModelView(params.id, viewerIdentifier);
  }, [params.id]);

  // ... rest of component
}
```

**Display View Counts:**

```typescript
const stats = await getModelViewStats(modelId);
// Show stats.totalViews and stats.uniqueViews in UI
```

## Performance Considerations

### Query Optimization

1. **Reading Stats (Hot Path)**
   - Aggregation queries use composite index `(modelId, viewerIdentifier)`
   - Single model stats: < 10ms with proper indexes
   - Top N models query: < 50ms even with thousands of rows
   - Can add caching layer if needed (Redis, Next.js cache)

2. **Writing Views (Hot Path)**
   - Simple INSERT into `model_views` - no joins or aggregations
   - Indexed foreign key prevents full table scans
   - Async/fire-and-forget (don't block page render)

3. **Index Strategy**
   - Composite index `(modelId, viewerIdentifier)` is critical for COUNT(DISTINCT) performance
   - Single-column indexes on `modelId`, `viewedAt`, and `viewerIdentifier` support various query patterns
   - PostgreSQL query planner automatically chooses optimal index

### Scaling Considerations

**Current Scale (< 1K views/day):**
- ~30K views/month → trivial for PostgreSQL
- Aggregation queries remain fast (< 50ms)
- No special optimizations needed
- Single database server handles easily

**If scaling to 100K+ views/day:**
- Add materialized view for pre-computed stats (refresh hourly)
- Consider write buffering (queue writes, batch insert)
- Partition `model_views` table by date (monthly partitions)
- Archive old raw events (keep last 90 days, aggregate historical data)
- Add Redis cache layer for frequently accessed stats
- Consider external analytics service (PostHog, Plausible) for advanced features

### Storage Management

**Raw Events Table Growth:**
- ~1KB per row (with IP/userAgent)
- 1K views/day = 30K rows/month = ~30MB/month
- After 1 year: ~360MB (negligible)
- Can safely store 10+ years without issues

**Optional Archival Strategy:**
```sql
-- Delete raw events older than 90 days (keep aggregated stats)
DELETE FROM model_views WHERE viewed_at < NOW() - INTERVAL '90 days';
```

## Front Page Model Selection

### Popularity Algorithm

**Simple Approach (Total Views):**
```typescript
const topModels = await getTopViewedModels(10); // Top 10 by total views
```

**Time-Decay Approach (Trending):**
```typescript
// Prioritize recent popularity over all-time views
SELECT
  model_id,
  total_views,
  EXTRACT(EPOCH FROM (NOW() - last_viewed_at)) / 86400 AS days_since_view,
  total_views / (1 + EXTRACT(EPOCH FROM (NOW() - last_viewed_at)) / 86400) AS popularity_score
FROM model_view_stats
WHERE last_viewed_at > NOW() - INTERVAL '30 days'
ORDER BY popularity_score DESC
LIMIT 10;
```

**Category-Based:**
```typescript
// Get top models per category
const topFemale = await getTopViewedModels(5, 'female');
const topMale = await getTopViewedModels(5, 'male');
```

## Privacy & Compliance

### Data Collection
- **No personal data:** Viewer identifiers are hashed UUIDs
- **Optional IP/UserAgent:** Can be disabled if not needed
- **Legitimate interest:** Internal analytics for service improvement

### GDPR Compliance
- User can clear cookies (resets identifier)
- No cross-site tracking
- Data used only for internal analytics
- Can add cookie consent banner if desired

### Data Retention
- Raw events: Recommend 90-day retention
- Aggregated stats: Keep indefinitely (no personal data)

## Testing Strategy

### Unit Tests
- Validator schemas (Zod validation)
- Hash function consistency
- Stats aggregation logic

### Integration Tests
- Track view → verify inserted in `model_views`
- Run aggregation → verify `model_view_stats` updated
- Get top models → verify correct ordering

### Load Tests (Optional)
- Simulate 1K concurrent view tracking requests
- Measure database response times
- Verify no deadlocks or race conditions

## Future Enhancements

### Phase 4: Dashboard UI (Future)
- View count trends over time (line charts)
- Model popularity leaderboard
- Geographic distribution maps (if IP stored)
- Device/browser breakdown
- Export to CSV for reporting

### Phase 5: Advanced Analytics (Future)
- Engagement metrics (time on profile)
- Conversion tracking (profile view → contact inquiry)
- Referrer tracking (traffic sources)
- A/B testing framework
- Cohort analysis (user retention)

### Phase 6: Performance Optimizations (If Needed)
- Materialized views for pre-computed stats
- Redis caching layer for frequently accessed data
- Live view counts (WebSocket updates)
- Real-time trending models dashboard

## References

### Implemented Files
- `db/schema/index.ts:88-113` - `model_views` table schema definition
- `db/schema/index.ts:120-121` - TypeScript type exports (`ModelView`, `NewModelView`)

### Future Implementation Files
- `lib/actions/model-views.ts` - Server actions for tracking and querying views
- `lib/validators/model-views.ts` - Zod schemas for input validation
- `utils/viewerIdentifier.ts` - Viewer ID generation and hashing utilities
- `app/models/[id]/page.tsx` - Profile page with view tracking integration

### Documentation
- Drizzle ORM docs: https://orm.drizzle.team
- PostgreSQL indexing: https://www.postgresql.org/docs/current/indexes.html
- PostgreSQL aggregation performance: https://www.postgresql.org/docs/current/functions-aggregate.html
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

---

**Last Updated:** 2025-11-04
**Status:** Schema implemented (single-table design with on-the-fly aggregation), ready for Phase 2 (Server Actions)
