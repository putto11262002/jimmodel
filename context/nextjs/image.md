# Next.js Image Component Optimization Guide

## 1. Image Loading Strategy Hierarchy

### Critical Above-Fold Images (LCP Elements)
```tsx
// Hero images, largest above-fold content
<Image
  src={heroImage}
  alt="Hero description"
  fill
  preload={true}           // Preloads in <head>
  quality={90-95}          // Highest quality
  sizes="60vw"             // Match actual display size
  className="object-cover"
/>
```

### Important Above-Fold Images
```tsx
// Important content visible on page load
<Image
  src={importantImage}
  alt="Important content"
  fill
  loading="eager"          // Load immediately when discovered
  fetchPriority="high"     // Higher browser priority
  quality={85-90}          // High quality
  sizes="40vw"
  className="object-cover"
/>
```

### Standard Content Images
```tsx
// Regular content images - let browser decide
<Image
  src={contentImage}
  alt="Content description"
  fill
  quality={80-85}          // Balanced quality
  sizes="30vw"
  className="object-cover"
/>
```

### Secondary/Lazy Load Images
```tsx
// Below-fold, secondary content
<Image
  src={secondaryImage}
  alt="Secondary content"
  fill
  loading="lazy"           // Defer until near viewport
  quality={75-80}          // Optimized for performance
  sizes="20vw"
  className="object-cover"
/>
```

## 2. The `sizes` Attribute - Complete Guide

The `sizes` attribute tells Next.js what size the image will be displayed at different breakpoints. Next.js automatically generates appropriate `srcSet` based on this guidance.

### Layout Pattern Matching

#### Full-Width Heroes
```tsx
sizes="100vw"
```

#### Grid Layouts (Bento-Style)
```tsx
// Large dominant images in hero grid
sizes="(max-width: 768px) 60vw, 40vw"

// Medium supporting images
sizes="(max-width: 768px) 50vw, 30vw"

// Small accent images
sizes="(max-width: 768px) 30vw, 20vw"
```

#### Fixed-Proportion Cards/Thumbnails
```tsx
// Cards that maintain ~10% of viewport width
sizes="10vw"
```

#### Sidebar/Content Layouts
```tsx
// Main content images
sizes="(max-width: 1024px) 100vw, 65vw"

// Sidebar images
sizes="(max-width: 1024px) 30vw, 25vw"
```

### Breakpoint Strategy
- **Mobile-first:** Design for small screens, enhance for larger
- **Use max-width breakpoints:** `(max-width: 768px)` is more reliable than min-width
- **Realistic proportions:** Match actual layout behavior, not ideal proportions

### Common Mistakes to Avoid

#### Never Use Pixel Units in `sizes`
```tsx
sizes="176px"     // ❌ Pixels not supported
sizes="10vw"      // ✅ Use viewport units
sizes="(max-width: 768px) 50vw, 30vw"  // ✅ Responsive values
```

#### Don't Confuse `sizes` with CSS Width
```tsx
// This tells Next.js how large the image will appear
sizes="50vw"

// This controls CSS layout
<div style={{ width: '50%' }}>
```

## 3. Quality Guidelines by Use Case

| Use Case | Quality Range | Loading Strategy | Rationale |
|----------|---------------|------------------|-----------|
| Hero/LCP images | 90-95 | `preload={true}` | Critical first impression, largest visual impact |
| Professional portfolios | 85-90 | `loading="eager"` | High visual quality expected |
| Content images | 80-85 | Default | Good balance of quality/performance |
| Thumbnails/avatars | 75-85 | `loading="lazy"` | Small size, lower quality acceptable |
| Background patterns | 70-75 | `loading="lazy"` | Decorative, performance prioritized |

## 4. When to Use Different Loading Strategies

### `preload={true}` - Most Aggressive
**When to use:**
- Image is the Largest Contentful Paint (LCP) element
- Above-the-fold hero images
- Critical branding elements
- When you want loading to start immediately in `<head>`

**When NOT to use:**
- Multiple potentially LCP images (viewport-dependent)
- Below-fold content
- When using `loading` property (conflicting behavior)

### `loading="eager"` + `fetchPriority="high"` - High Priority
**When to use:**
- Important above-fold content that's not the LCP
- Primary content images
- When you want immediate loading but not full preload

### Default Loading - Browser Optimized
**When to use:**
- Most content images
- When browser can best determine loading strategy
- When image importance is moderate

### `loading="lazy"` - Deferred Loading
**When to use:**
- Below-fold content
- Secondary images
- Carousels and galleries
- When you want to save initial page load bandwidth

## 5. Implementation Templates

### Hero/Banner Pattern
```tsx
<Image
  src={heroSrc}
  alt={heroAlt}
  fill
  preload={true}
  quality={90}
  sizes="(max-width: 768px) 100vw, 60vw"
  className="object-cover"
/>
```

### Content Image Pattern
```tsx
<Image
  src={contentSrc}
  alt={contentAlt}
  fill
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

### Thumbnail/Card Pattern
```tsx
<Image
  src={thumbSrc}
  alt={thumbAlt}
  fill
  loading="lazy"
  quality={80}
  sizes="10vw"
  className="object-cover"
/>
```

### Gallery/Carousel Pattern
```tsx
<Image
  src={gallerySrc}
  alt={galleryAlt}
  fill
  loading="lazy"
  quality={75}
  sizes="(max-width: 768px) 80vw, 40vw"
  className="object-cover"
/>
```

## 6. Performance Testing and Optimization

### Testing Checklist
1. **Audit image dimensions** - Match `sizes` to actual display sizes
2. **Test across breakpoints** - Ensure responsive behavior works correctly
3. **Check Lighthouse scores** - Image optimization, performance metrics
4. **Verify visual quality** - Ensure quality settings are appropriate
5. **Monitor loading behavior** - Confirm correct preload/eager/lazy behavior

### Common Performance Issues

#### Oversized Images
```tsx
// Problem: Large image displayed in small container
<Image src="2048x2048.jpg" sizes="10vw" quality={90} />  // ❌ Wasted bandwidth

// Solution: Let Next.js handle sizing
<Image src="2048x2048.jpg" sizes="10vw" quality={75} />  // ✅ Appropriate sizing
```

#### Missing Alt Text
```tsx
<Image alt="" />                                    // ❌ Missing description
<Image alt="Decorative pattern" />                  // ✅ Descriptive
<Image alt="" role="presentation" />                // ✅ Explicitly decorative
```

#### Conflicting Loading Attributes
```tsx
<Image preload={true} loading="lazy" />             // ❌ Conflicting behavior
<Image preload={true} />                            // ✅ Preload takes precedence
<Image loading="lazy" fetchPriority="high" />       // ✅ Compatible
```

## 7. Advanced Techniques

### Blur Placeholders
```tsx
<Image
  src={src}
  alt={alt}
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
/>
```

### Responsive Image Sets
```tsx
// Different images for different breakpoints (art direction)
<Picture>
  <source media="(max-width: 768px)" srcSet={mobileImage} />
  <Image
    src={desktopImage}
    alt={alt}
    fill
    sizes="50vw"
  />
</Picture>
```

### Dynamic Quality Based on Network
```tsx
// Higher quality for fast connections, lower for slow
<Image
  src={src}
  alt={alt}
  fill
  quality={connection?.effectiveType === '4g' ? 90 : 70}
  sizes="50vw"
/>
```

This comprehensive guide covers all aspects of Next.js Image optimization from loading strategies to sizing patterns to performance best practices.