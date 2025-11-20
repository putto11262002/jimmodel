# Website Section Container Patterns

## Overview

Container patterns define how content is constrained horizontally and padded on marketing websites. Unlike web apps that use consistent layouts, websites often mix different container widths to create visual rhythm and hierarchy.

## Common Container Patterns

### 1. Standard Container
**Usage:** Default for most sections (features, services, about)

```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Width: 1280px max
- Centered with `mx-auto`
- Standard horizontal padding
- Most versatile pattern

---

### 2. Full-Width (No Container)
**Usage:** Hero sections, full-bleed images, spanning backgrounds

```tsx
<section className="w-full px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Spans entire viewport width
- Minimal/no max-width constraint
- Often combined with nested containers

---

### 3. Nested Container (Hybrid)
**Usage:** Sections needing full-width backgrounds with contained content

```tsx
<section className="w-full bg-gray-100 py-16">
  <div className="max-w-7xl mx-auto px-4">
    {/* Content */}
  </div>
</section>
```

**Characteristics:**
- Outer wrapper for backgrounds/effects
- Inner container for content
- Most common pattern for colored sections

---

### 4. Narrow Container
**Usage:** Testimonials, blog posts, focused content

```tsx
<section className="max-w-4xl mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Width: 896px max
- Creates visual focus
- Better readability for text-heavy content

---

### 5. Extra Wide Container
**Usage:** Image galleries, wide grids, portfolios

```tsx
<section className="max-w-screen-2xl mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Width: 1536px max
- More breathing room for visual content
- Less common, used strategically

---

### 6. Prose Container
**Usage:** Long-form reading (articles, blog posts)

```tsx
<section className="max-w-prose mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Width: ~65 characters (~672px)
- Optimized line length for reading
- Typography-focused

---

### 7. Asymmetric Padding Container
**Usage:** Responsive designs needing adaptive spacing

```tsx
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Padding scales with breakpoints
- More spacious on larger screens
- Common in modern responsive designs

---

### 8. Edge-to-Edge Container
**Usage:** Image carousels, full-width media

```tsx
<section className="w-full py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- No horizontal padding
- Content touches viewport edges
- Used for media that should bleed

---

### 9. Contained with Breakout
**Usage:** Content that needs to occasionally escape constraints

```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
    {/* Breakout content */}
  </div>
</section>
```

**Characteristics:**
- Parent sets base container
- Child breaks out with negative margins
- Creates visual interest/variety

---

### 10. Fluid Container
**Usage:** When using Tailwind's container utility

```tsx
<section className="container mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Uses Tailwind's `.container` class
- Responsive max-widths at each breakpoint
- Matches screen sizes automatically

---

### 11. Tight Container
**Usage:** Forms, CTAs, narrow focused sections

```tsx
<section className="max-w-2xl mx-auto px-4 py-16">
  {/* Content */}
</section>
```

**Characteristics:**
- Width: 672px max
- Very focused
- Good for conversion-oriented sections

---

### 12. No Vertical Padding
**Usage:** Sections where children control their own spacing

```tsx
<section className="max-w-7xl mx-auto px-4">
  {/* Content */}
</section>
```

**Characteristics:**
- Only horizontal constraints
- Vertical spacing delegated to children
- Useful for composite sections

---

## Max-Width Scale Reference

| Class | Width | Typical Usage |
|-------|-------|---------------|
| `max-w-2xl` | 672px | Forms, narrow CTAs |
| `max-w-3xl` | 768px | Medium-narrow content |
| `max-w-4xl` | 896px | Blog posts, testimonials |
| `max-w-5xl` | 1024px | Medium sections |
| `max-w-6xl` | 1152px | Standard sections |
| `max-w-7xl` | 1280px | **Most common** - wide sections |
| `max-w-screen-xl` | 1280px | Match xl breakpoint |
| `max-w-screen-2xl` | 1536px | Extra wide galleries |
| `max-w-prose` | ~65ch | Optimal reading width |

## Padding Scale Reference

| Class Pattern | Mobile | Tablet | Desktop | Usage |
|---------------|--------|--------|---------|-------|
| `px-4` | 16px | 16px | 16px | Standard mobile-first |
| `px-4 sm:px-6` | 16px | 24px | 24px | Modest scaling |
| `px-4 sm:px-6 lg:px-8` | 16px | 24px | 32px | Progressive scaling |
| `px-6` | 24px | 24px | 24px | Fixed comfortable |
| `px-8` | 32px | 32px | 32px | Fixed spacious |

## Section Spacing Strategies

### The Vertical Spacing Problem

When composing pages from section components, there's a potential conflict between component padding (`py-*`) and page-level margins (`mt-*`):

```tsx
// Component has vertical padding
<section className="py-16"> {/* 4rem padding bottom */}
  <div className="max-w-7xl mx-auto px-4">
    {/* Content */}
  </div>
</section>

// Page adds margin between sections
<div className="mt-16"> {/* 4rem margin top */}
  <NextSection className="py-16" /> {/* 4rem padding top */}
</div>

// Result: 4rem + 4rem + 4rem = 12rem total space! ❌
```

This creates **double or triple spacing** - bottom padding from previous section + margin + top padding from next section.

---

### Solution Patterns

#### Pattern 1: Component Owns All Vertical Spacing (Recommended)

**Strategy:** Components include standard padding. Page does NOT add margins except for adjustments.

```tsx
// ✅ Components: Standard py-16 or py-20
export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Standard padding */}
    </section>
  )
}

export function TestimonialsSection() {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Standard padding */}
      </div>
    </section>
  )
}

// ✅ Page: Sections stack naturally
export default function Page() {
  return (
    <>
      <HeroSection />        {/* py-20 */}
      <FeaturesSection />    {/* py-16 top + py-16 bottom */}
      <TestimonialsSection /> {/* py-16 top + py-16 bottom */}

      {/* Exception: Need extra space */}
      <div className="mt-16">
        <CTASection />
      </div>

      {/* Exception: Need less space */}
      <div className="-mt-8">
        <FooterSection />
      </div>
    </>
  )
}
```

**How it works:**
- Adjacent sections with `py-16` create natural 32px gaps (16px bottom + 16px top)
- Page adds margin only for exceptions (more space with `mt-*`, less space with `-mt-*`)
- Components are self-contained and portable

**Spacing math:**
- Default: `py-16` + `py-16` = 32px gap
- More space: `py-16` + `mt-16` + `py-16` = 48px gap
- Less space: `py-16` + `-mt-8` + `py-16` = 24px gap

**Pros:**
- Simplest to implement
- Components are self-contained
- Sections work anywhere without configuration
- Clear default spacing

**Cons:**
- Page has limited control over spacing
- All sections should use consistent padding values

**Best for:** Most marketing websites

---

#### Pattern 2: No Vertical Padding on Section Element

**Strategy:** Section element handles backgrounds only. Inner container has padding. Page controls spacing.

```tsx
// ✅ Component: No py on outer section
export function FeaturesSection() {
  return (
    <section className="w-full"> {/* NO py-* here */}
      <div className="max-w-7xl mx-auto px-4 py-16"> {/* py on inner */}
        {/* Content */}
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  return (
    <section className="w-full bg-gray-50"> {/* NO py-* here */}
      <div className="max-w-4xl mx-auto px-4 py-16"> {/* py on inner */}
        {/* Content */}
      </div>
    </section>
  )
}

// Page controls all vertical spacing
export default function Page() {
  return (
    <>
      <HeroSection />
      <div className="mt-16"><FeaturesSection /></div>
      <div className="mt-24"><TestimonialsSection /></div>
      <div className="mt-16"><CTASection /></div>
    </>
  )
}
```

**Pros:**
- Clear separation: section = backgrounds, inner = spacing
- Page has full control over inter-section spacing
- No conflict between padding and margin

**Cons:**
- Extra nesting required
- Components less self-contained

**Best for:** Sites needing precise spacing control

---

#### Pattern 3: Page Owns All Vertical Spacing

**Strategy:** Components have NO padding. Page wraps each section with spacing.

```tsx
// ✅ Component: No padding at all
export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4"> {/* NO py */}
      {/* Content */}
    </section>
  )
}

// ✅ Page: Adds all vertical spacing
export default function Page() {
  return (
    <div className="space-y-16"> {/* Uniform spacing */}
      <div className="py-20"><HeroSection /></div>
      <div className="py-16"><FeaturesSection /></div>
      <div className="py-16"><TestimonialsSection /></div>
    </div>
  )
}
```

**Pros:**
- Maximum page control
- Easy to adjust spacing globally
- Consistent vertical rhythm

**Cons:**
- Extra wrapper divs
- Components incomplete without page context

**Best for:** Complex sites with varied spacing needs

---

#### Pattern 4: Spacer Component

**Strategy:** Explicit spacer components between sections.

```tsx
// Spacer utility
function Spacer({ size = "default" }: { size?: "sm" | "default" | "lg" | "xl" }) {
  const sizes = {
    sm: "h-8",
    default: "h-16",
    lg: "h-24",
    xl: "h-32"
  }
  return <div className={sizes[size]} aria-hidden="true" />
}

// Components: Own internal padding
export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Content */}
    </section>
  )
}

// Page: Explicit spacers
export default function Page() {
  return (
    <>
      <HeroSection />
      <Spacer size="lg" />
      <FeaturesSection />
      <Spacer />
      <TestimonialsSection />
      <Spacer size="xl" />
      <CTASection />
    </>
  )
}
```

**Pros:**
- Very explicit and readable
- Easy to visualize spacing
- Semantic intent

**Cons:**
- More verbose
- Extra elements in DOM

**Best for:** Teams wanting explicit spacing control

---

### Visual Spacing Guide

#### Natural Stacking (Pattern 1 - Recommended)

```
┌─────────────────────────┐
│  Section 1              │
│  Content                │
│  ↓ 16px padding bottom  │
└─────────────────────────┘  ← Natural 32px gap (16+16)
┌─────────────────────────┐
│  ↑ 16px padding top     │
│  Section 2              │
│  Content                │
│  ↓ 16px padding bottom  │
└─────────────────────────┘
```

#### With Extra Margin Added

```
┌─────────────────────────┐
│  Section 1              │
│  Content                │
│  ↓ 16px padding bottom  │
└─────────────────────────┘
      ↓ 16px margin           ← Now 48px total (16+16+16)
┌─────────────────────────┐
│  ↑ 16px padding top     │
│  Section 2              │
│  Content                │
└─────────────────────────┘
```

#### With Negative Margin

```
┌─────────────────────────┐
│  Section 1              │
│  Content                │
│  ↓ 16px padding bottom  │
└─────────────────────────┘
      ↑ -8px margin           ← Now 24px total (16-8+16)
┌─────────────────────────┐
│  ↑ 16px padding top     │
│  Section 2              │
│  Content                │
└─────────────────────────┘
```

---

### Standard Padding Values

For consistency across your site, establish standard padding values:

| Context | Padding | Usage |
|---------|---------|-------|
| **Hero sections** | `py-20` or `py-24` | Large, impactful sections |
| **Standard sections** | `py-16` | Default for most content sections |
| **Compact sections** | `py-12` | Tighter sections like stats, logos |
| **Minimal sections** | `py-8` | Very tight sections or bands |

**Recommendation:** Use `py-16` as your default and `py-20` for hero sections. This creates natural 32px gaps between standard sections.

---

### Implementation Example

```tsx
// components/sections/hero-section.tsx
export function HeroSection() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-white">Welcome</h1>
        <p className="text-xl text-white/90 mt-4">Your subtitle here</p>
      </div>
    </section>
  )
}

// components/sections/features-section.tsx
export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-12">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature cards */}
      </div>
    </section>
  )
}

// components/sections/testimonials-section.tsx
export function TestimonialsSection() {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>
        {/* Testimonial content */}
      </div>
    </section>
  )
}

// components/sections/cta-section.tsx
export function CTASection() {
  return (
    <section className="w-full bg-blue-600 py-16">
      <div className="max-w-3xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-lg">
          Sign Up Now
        </button>
      </div>
    </section>
  )
}

// app/page.tsx
export default function HomePage() {
  return (
    <main>
      {/* Sections stack naturally with py creating gaps */}
      <HeroSection />        {/* py-20 = 20px bottom */}
      <FeaturesSection />    {/* py-16 = 16px top + 16px bottom → 36px gap with hero */}
      <TestimonialsSection /> {/* py-16 = 16px top + 16px bottom → 32px gap */}

      {/* Need extra space before CTA */}
      <div className="mt-16">
        <CTASection />       {/* py-16 = 16px top → 48px gap total */}
      </div>
    </main>
  )
}
```

---

## Choosing the Right Pattern

### By Content Type

- **Marketing Hero**: Full-width or Nested Container
- **Features Grid**: Standard Container (`max-w-7xl`)
- **Blog Post**: Prose Container or Narrow Container
- **Testimonials**: Narrow Container (`max-w-4xl`)
- **Image Gallery**: Extra Wide or Edge-to-Edge
- **CTA Section**: Tight Container (`max-w-2xl`)
- **Footer**: Nested Container (full bg, contained content)

### By Visual Intent

- **Focus/Attention**: Narrow containers (2xl-4xl)
- **Spacious/Breathing**: Standard to wide (6xl-7xl)
- **Immersive**: Full-width or edge-to-edge
- **Rhythm/Variety**: Alternate between narrow and wide

### By Responsiveness

- **Simple**: Fixed padding (`px-4`, `px-6`)
- **Adaptive**: Responsive padding (`px-4 sm:px-6 lg:px-8`)
- **Fluid**: Container utility with breakpoint-based widths

## Best Practices

1. **Consistency First**: Pick 2-3 widths (e.g., `max-w-4xl`, `max-w-7xl`, full-width) and use them consistently

2. **Hierarchy Through Width**: Narrower = more focused, wider = more exploratory

3. **Always Center**: Use `mx-auto` with max-width constraints

4. **Responsive Padding**: At minimum use `px-4` for mobile, consider scaling up

5. **Vertical Rhythm**: Keep vertical padding consistent across sections (e.g., `py-16` or `py-20`)

6. **Nested for Backgrounds**: Use full-width outer + contained inner for colored sections

7. **Breakout Strategically**: Let specific elements (images, quotes) break container occasionally for visual interest

## Anti-Patterns to Avoid

- **Inconsistent widths**: Using too many different max-widths creates chaos
- **No padding on mobile**: Always include horizontal padding to prevent edge-hugging
- **Forgetting vertical spacing**: Sections need breathing room
- **Over-constraining**: Not every section needs to be narrow
- **No variety**: Using only one container width is monotonous

## Implementation Tips

### Create Container Utilities

```tsx
// components/container.tsx
export function Container({
  size = 'default',
  className,
  children
}: {
  size?: 'narrow' | 'default' | 'wide' | 'prose'
  className?: string
  children: React.ReactNode
}) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-screen-2xl',
    prose: 'max-w-prose'
  }

  return (
    <div className={`${sizeClasses[size]} mx-auto px-4 ${className}`}>
      {children}
    </div>
  )
}
```

### Use Semantic Sections

```tsx
// Good - Clear intent
<section className="w-full bg-blue-50 py-20">
  <div className="max-w-7xl mx-auto px-4">
    {/* Content */}
  </div>
</section>

// Avoid - Ambiguous nesting
<div className="w-full">
  <div className="container">
    <div className="wrapper">
      {/* What's happening here? */}
    </div>
  </div>
</div>
```

## Related Documentation

- **layout-ownership.md** - Patterns for who owns what styling (component vs page responsibility)
- **Layout Patterns**: Grid, flexbox arrangements within containers
- **Breakpoints**: How containers respond at different screen sizes
- **Typography Scale**: How text sizing relates to container width
- **Component Spacing**: How components handle spacing within containers
