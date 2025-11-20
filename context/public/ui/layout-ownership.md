# Layout Styling Ownership Patterns

## Overview

When composing pages from section components, you must decide **who owns what styling**. This document explores different ownership patterns and provides guidance on choosing the right approach for your project.

## The Core Question

```tsx
// Who controls layout styling?
<section className="???">  {/* Component or page? */}
  <div className="???">     {/* Component or page? */}
    {/* Content */}
  </div>
</section>
```

**Key decisions:**
- Who controls container width (`max-w-*`)?
- Who controls padding (`px-*`, `py-*`)?
- Who controls backgrounds (`bg-*`)?
- Who controls spacing between sections (`mt-*`, `space-y-*`)?

---

## Pattern 1: Page Owns Layout (Wrapper Pattern)

**Concept:** Components are "dumb" content blocks. Page controls all layout styling.

```tsx
// components/hero-content.tsx (no layout styling)
export function HeroContent() {
  return (
    <>
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="text-xl">Subtitle here</p>
      <button>Get Started</button>
    </>
  )
}

// app/page.tsx (page owns all layout)
export default function Page() {
  return (
    <>
      <section className="w-full bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <HeroContent />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <FeaturesContent />
      </section>
    </>
  )
}
```

### Pros
- Page has complete layout control
- Components are maximally reusable
- Easy to adjust layout from one place
- Clear where styling decisions are made

### Cons
- Page file becomes verbose with wrapper divs
- Harder to visualize complete section structure
- Components feel incomplete on their own
- More boilerplate code

### Best For
- Content-only components used across multiple contexts
- Projects where layout must vary significantly per page
- Teams that want centralized layout control

---

## Pattern 2: Section Owns Everything (Self-Contained)

**Concept:** Each section component is fully self-contained with its own complete layout.

```tsx
// components/hero-section.tsx (owns all layout)
export function HeroSection() {
  return (
    <section className="w-full bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-xl">Subtitle here</p>
        <button>Get Started</button>
      </div>
    </section>
  )
}

// app/page.tsx (clean composition)
export default function Page() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
```

### Pros
- Clean, readable page composition
- Section components are complete and portable
- Easy to understand section structure at a glance
- No layout decision-making in page files

### Cons
- Harder to adjust layout globally
- Less flexible for reuse in different contexts
- Section components are more opinionated
- Changes require editing components

### Best For
- **Marketing websites** (recommended)
- Page-specific sections with unique styling
- Teams that want component encapsulation
- Projects with consistent section layouts

---

## Pattern 3: Hybrid (Configurable Layout)

**Concept:** Section owns default layout but accepts override props.

```tsx
// components/hero-section.tsx
export function HeroSection({
  containerWidth = "max-w-7xl",
  background = "bg-blue-600",
  padding = "py-20"
}: {
  containerWidth?: string
  background?: string
  padding?: string
}) {
  return (
    <section className={`w-full ${background} ${padding}`}>
      <div className={`${containerWidth} mx-auto px-4`}>
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-xl">Subtitle here</p>
      </div>
    </section>
  )
}

// app/page.tsx (can customize if needed)
export default function Page() {
  return (
    <>
      <HeroSection />
      <HeroSection
        containerWidth="max-w-5xl"
        padding="py-32"
        background="bg-purple-600"
      />
    </>
  )
}
```

### Pros
- Flexible and configurable
- Good defaults with override capability
- Balanced control between page and component
- Reusable across varied contexts

### Cons
- More complex component API
- Can lead to prop sprawl
- String-based styling can be fragile
- Requires discipline to avoid over-configuration

### Best For
- Design systems with variants
- Sections used across multiple pages with variations
- Teams comfortable with prop-based configuration

---

## Pattern 4: Composition with Layout Components

**Concept:** Use dedicated reusable layout wrapper components.

```tsx
// components/layout/section.tsx
export function Section({
  width = "default",
  background,
  padding = "py-16",
  children
}: {
  width?: "narrow" | "default" | "wide" | "full"
  background?: string
  padding?: string
  children: React.ReactNode
}) {
  const widthClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-screen-2xl",
    full: "w-full"
  }

  const containerClass = width === "full"
    ? "w-full px-4"
    : `${widthClasses[width]} mx-auto px-4`

  return (
    <section className={`w-full ${background || ''} ${padding}`}>
      <div className={containerClass}>
        {children}
      </div>
    </section>
  )
}

// components/hero-content.tsx (just content)
export function HeroContent() {
  return (
    <>
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="text-xl">Subtitle here</p>
    </>
  )
}

// app/page.tsx (compose with layout components)
export default function Page() {
  return (
    <>
      <Section width="default" background="bg-blue-600" padding="py-20">
        <HeroContent />
      </Section>

      <Section width="default">
        <FeaturesContent />
      </Section>

      <Section width="narrow" background="bg-gray-50">
        <TestimonialsContent />
      </Section>
    </>
  )
}
```

### Pros
- Clean separation of concerns
- Consistent layout API across pages
- Content components stay maximally reusable
- Page controls layout declaratively
- Layout patterns are reusable

### Cons
- Extra abstraction layer
- Requires building and maintaining layout components
- Learning curve for layout component API

### Best For
- Large projects with many pages
- Teams wanting consistent layout patterns
- Projects with reusable content across varied layouts

---

## Pattern 5: Slot Pattern

**Concept:** Section provides wrapper structure, accepts content via children.

```tsx
// components/hero-section.tsx
export function HeroSection({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`w-full bg-blue-600 py-20 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        {children}
      </div>
    </section>
  )
}

// app/page.tsx
export default function Page() {
  return (
    <>
      <HeroSection>
        <h1>Welcome</h1>
        <p>Subtitle</p>
      </HeroSection>

      <HeroSection className="bg-purple-600">
        <h1>Different content</h1>
      </HeroSection>
    </>
  )
}
```

### Pros
- Flexible content composition
- Simple component API
- Good for section variants with same layout
- Easy to understand

### Cons
- Content structure may be duplicated across uses
- Less encapsulation than self-contained sections
- Layout and content coupling at page level

### Best For
- Sections with consistent layout but varied content
- Simple use cases
- Prototyping and MVP projects

---

## Pattern 6: Split Responsibility (Intra vs Inter)

**Concept:** Component owns **internal** section layout (intra-section). Page owns **spacing between** sections (inter-section).

This is the **recommended pattern** for most marketing websites.

### Ownership Table

| Responsibility | Owner | Examples |
|----------------|-------|----------|
| **Intra-section** (internal) | Component | `max-w-*`, `px-*`, `py-*`, `bg-*`, internal structure |
| **Inter-section** (between) | Page | `mt-*`, `mb-*`, `space-y-*`, section order |

### Implementation

```tsx
// Components own internal layout
export function HeroSection() {
  return (
    <section className="w-full bg-blue-600 py-20">
      {/* Component controls: width, background, padding */}
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-xl">Subtitle</p>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Component controls its own layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Features */}
      </div>
    </section>
  )
}

// Page controls spacing between sections
export default function Page() {
  return (
    <main>
      <HeroSection />

      {/* Page controls: spacing between sections */}
      <FeaturesSection />

      {/* Need extra space? Page adds margin */}
      <div className="mt-16">
        <TestimonialsSection />
      </div>

      {/* Need less space? Use negative margin */}
      <div className="-mt-8">
        <CTASection />
      </div>
    </main>
  )
}
```

### Benefits

**Clear Ownership**
- Component: "I handle my internal layout"
- Page: "I handle composition and rhythm"

**Portable Components**
```tsx
// Works anywhere, always looks right internally
<FeaturesSection />
```

**Easy Rhythm Adjustments**
```tsx
// Adjust spacing site-wide from page
<div className="space-y-8">
  <Section1 />
  <Section2 />
</div>
```

**Component Independence**
- Each section is self-contained
- No dependency on page context
- Easy to move between pages

**Page-Level Control**
```tsx
// Create custom rhythm per page
<HeroSection />
<div className="mt-32" />  {/* Large gap */}
<FeaturesSection />
<div className="mt-8" />   {/* Small gap */}
<PricingSection />
```

### Pros
- Clear separation of concerns
- Components are portable and self-contained
- Page has control over composition
- Easy to maintain and reason about
- Best balance of flexibility and encapsulation

### Cons
- Requires understanding the split responsibility model
- Vertical spacing can get complex (see container-patterns.md for solutions)

### Best For
- **Most marketing websites** (highly recommended)
- Projects wanting component portability with page control
- Teams that understand the intra/inter distinction

---

## Comparison Matrix

| Pattern | Component Reusability | Page Control | Code Complexity | Flexibility |
|---------|----------------------|--------------|-----------------|-------------|
| **Page Owns Layout** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Section Owns Everything** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Hybrid (Props)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Composition** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Slot Pattern** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Split Responsibility** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Recommended Approach

### For Marketing Websites

Use **Pattern 6 (Split Responsibility)** or **Pattern 2 (Self-Contained)** depending on your needs:

#### Use Pattern 2 (Self-Contained) when:
- Sections are unique to specific pages
- Each section has complex, specific styling
- You want maximum encapsulation
- Team is comfortable with component changes

```tsx
// Each section is complete
<HomepageHero />
<AboutTeamSection />
<ContactCTASection />
```

#### Use Pattern 6 (Split Responsibility) when:
- Need component portability
- Want page-level spacing control
- Sections are reused across pages
- Team understands intra/inter distinction

```tsx
// Components handle internal, page handles spacing
<HeroSection />
<FeaturesSection />
<div className="mt-24">
  <TestimonialsSection />
</div>
```

#### Hybrid Recommendation

Combine both approaches based on section type:

```tsx
export default function HomePage() {
  return (
    <>
      {/* Pattern 2: Unique, page-specific sections */}
      <HomepageHero />

      {/* Pattern 6: Reusable sections with page spacing control */}
      <FeaturesSection />

      <div className="mt-24">
        <TestimonialsSection />
      </div>

      {/* Pattern 2: Unique footer */}
      <HomepageFooter />
    </>
  )
}
```

---

## File Organization

### By Pattern Type

#### Pattern 2 (Self-Contained)
```
components/
└── sections/
    ├── homepage-hero.tsx      # Page-specific
    ├── about-team.tsx         # Page-specific
    └── contact-cta.tsx        # Page-specific
```

#### Pattern 6 (Split Responsibility)
```
components/
└── sections/
    ├── hero-section.tsx       # Reusable
    ├── features-section.tsx   # Reusable
    └── testimonials-section.tsx # Reusable
```

#### Hybrid Approach
```
components/
├── sections/              # Self-contained page-specific sections
│   ├── homepage-hero.tsx
│   └── about-team.tsx
└── common/               # Reusable section components
    ├── features.tsx
    ├── testimonials.tsx
    └── cta.tsx
```

#### Pattern 4 (Composition)
```
components/
├── layout/               # Layout wrappers
│   ├── section.tsx
│   └── container.tsx
└── content/              # Content-only components
    ├── hero-content.tsx
    ├── features-content.tsx
    └── testimonials-content.tsx
```

---

## Practical Guidelines

### 1. Split Responsibilities Clearly

```tsx
// ✅ Good: Clear separation
<section className="max-w-7xl mx-auto px-4 py-16">
  <FeatureGrid items={data} />
</section>

// ❌ Avoid: Mixed concerns
<FeatureGrid
  items={data}
  containerWidth="max-w-7xl"
  padding="py-16"
/>
```

### 2. Use Semantic Component Names

```tsx
// ✅ Good: Clear intent
<HeroSection />
<FeaturesSection />
<TestimonialsSection />

// ❌ Avoid: Generic names
<Section1 />
<ContentBlock2 />
<Component3 />
```

### 3. Keep Layout Props Minimal

```tsx
// ✅ Good: Semantic, limited props
<Section width="narrow" background="gray">
  <Content />
</Section>

// ❌ Avoid: Too many layout props
<Section
  maxWidth="max-w-7xl"
  paddingX="px-4"
  paddingY="py-16"
  marginTop="mt-8"
  backgroundColor="bg-gray-50"
>
  <Content />
</Section>
```

### 4. Use Composition Over Configuration

```tsx
// ✅ Good: Compose sections
<>
  <HeroSection />
  <FeaturesSection />
  <TestimonialsSection />
</>

// ❌ Avoid: Over-configuration
<PageBuilder
  sections={[
    { type: 'hero', width: 'full', bg: 'blue' },
    { type: 'features', width: 'default' },
    { type: 'testimonials', width: 'narrow' }
  ]}
/>
```

### 5. Document Your Pattern Choice

Add to your project's README or CLAUDE.md:

```markdown
## Layout Ownership Pattern

This project uses **Split Responsibility (Pattern 6)**:
- Components own internal layout (width, padding, backgrounds)
- Pages own inter-section spacing (margins between sections)
- Standard padding: `py-16` for sections, `py-20` for heroes
```

---

## Related Documentation

- **container-patterns.md** - Reference for container widths, padding values, and vertical spacing strategies
- **CLAUDE.md** - Project-specific conventions and patterns

---

## Decision Flowchart

```
Are sections reused across pages?
├─ Yes → Is layout consistent or varied?
│  ├─ Consistent → Pattern 2 (Self-Contained)
│  └─ Varied → Pattern 4 (Composition) or Pattern 6 (Split)
└─ No (page-specific) → Pattern 2 (Self-Contained)

Need page-level spacing control?
├─ Yes → Pattern 6 (Split Responsibility)
└─ No → Pattern 2 (Self-Contained)

Components used in different contexts with different layouts?
├─ Yes → Pattern 1 (Page Owns) or Pattern 4 (Composition)
└─ No → Pattern 2 (Self-Contained) or Pattern 6 (Split)

Team prefers centralized control?
├─ Yes → Pattern 1 (Page Owns)
└─ No → Pattern 2 (Self-Contained) or Pattern 6 (Split)
```

**Default recommendation:** Start with **Pattern 6 (Split Responsibility)** for marketing websites. It provides the best balance of component portability and page control.
