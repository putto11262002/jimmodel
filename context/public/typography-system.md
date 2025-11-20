# Typography System - Public Application

**Status:** Proposal - Awaiting Approval
**Last Updated:** 2025-11-19
**Scope:** All public-facing pages (landing, portfolio, about, contact, etc.)

## Overview

This typography system ensures visual consistency and hierarchy across all public-facing pages of the J.I.M. Modeling Agency website. It establishes clear rules for font usage, sizing, spacing, and color application using only shadcn semantic variables for theme compatibility.

---

## 1. Font Families

### Available Fonts

The public application uses three font families loaded in `app/(public)/layout.tsx`:

```typescript
// Sora - Primary heading font
const sora = Sora({
  variable: "--font-heading",
  weights: ["300", "400", "500", "600", "700", "800"]
});

// Inter - Body text font
const inter = Inter({
  variable: "--font-body"
});

// Playfair Display - Serif accent font
const playfair = Playfair_Display({
  variable: "--font-serif",
  weights: ["400", "500", "600", "700", "800", "900"]
});
```

### Usage Rules

| Font Family | CSS Variable | When to Use | Class | Example Usage |
|-------------|--------------|-------------|-------|---------------|
| **Sora** | `--font-heading` | All headings, display text, stats, UI elements | Default (no class) | Section titles, hero headlines, navigation |
| **Inter** | `--font-body` | Body paragraphs, long-form content, readable text | `font-sans` or default | Descriptions, articles, card content |
| **Playfair Display** | `--font-serif` | Emphasis words only, luxury highlights, elegant accents | `font-serif italic` | Emphasis within headlines (e.g., "*Talent*", "*Excellence*") |

**Critical Rule:** Use serif sparingly - limit to 1-2 emphasis words per section to maintain luxury feel without overwhelming.

---

## 2. Type Scale & Hierarchy

### Display Styles
Used for hero sections and major page headings.

| Style | Size Classes | Weight | Tracking | Line Height | Usage |
|-------|--------------|--------|----------|-------------|-------|
| **Display XL** | `text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]` | `font-light` | `tracking-tight` | `leading-[0.9]` | Hero main headline only (1 per page) |
| **Display L** | `text-4xl sm:text-5xl md:text-6xl` | `font-light` | `tracking-tight` | `leading-tight` | Major section titles (Our Services, About) |
| **Display M** | `text-3xl sm:text-4xl lg:text-5xl` | `font-light` | Normal | `leading-tight` | Subsection headings, feature intros |

### Heading Styles
Used for content structure and hierarchy within sections.

| Style | Size Classes | Weight | Tracking | Line Height | Usage |
|-------|--------------|--------|----------|-------------|-------|
| **Heading XL** | `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` | `font-light` | Normal | `leading-none` | Portfolio work titles (animated/scroll effects) |
| **Heading L** | `text-3xl sm:text-4xl` | `font-light` | Normal | `leading-snug` | Card headings, feature titles |
| **Heading M** | `text-2xl sm:text-3xl` | `font-light` | Normal | `leading-snug` | Subsection titles, article headings |
| **Heading S** | `text-xl` | `font-medium` | Normal | `leading-normal` | Card titles, list headings |

### Body Styles
Used for paragraphs, descriptions, and readable content.

| Style | Size Classes | Weight | Line Height | Usage |
|-------|--------------|--------|-------------|-------|
| **Body L** | `text-lg sm:text-xl` | Normal (400) | `leading-relaxed` | Large descriptions, intro paragraphs, portfolio descriptions |
| **Body M** | `text-base lg:text-lg` | Normal (400) | `leading-relaxed` | Standard paragraphs, default body text |
| **Body S** | `text-sm` | Normal (400) | `leading-relaxed` | Supporting text, captions, footnotes |

### Subtitle Styles
Used for descriptive text under section headings (secondary to main heading).

| Style | Size Classes | Weight | Line Height | Usage |
|-------|--------------|--------|-------------|-------|
| **Subtitle** | `text-base lg:text-lg` | Normal (400) | `leading-relaxed` | Section heading descriptions, supporting text under titles |

### Label Styles
Used for UI elements, tags, metadata, and buttons.

| Style | Size Classes | Weight | Tracking | Transform | Usage |
|-------|--------------|--------|----------|-----------|-------|
| **Label M** | `text-sm` | `font-medium` | `tracking-[0.15em]` | `uppercase` | Section tags, button text, categories |
| **Label S** | `text-xs` | `font-medium` | `tracking-[0.15em]` | `uppercase` | Stats labels, metadata, small tags |

### Stat Styles
Used for numbers and metrics.

| Style | Size Classes | Weight | Usage |
|-------|--------------|--------|-------|
| **Stat L** | `text-4xl sm:text-5xl` | `font-light` | Large metrics (40+ Years, 500+ Models) |
| **Stat M** | `text-3xl sm:text-4xl` | `font-light` | Medium metrics, secondary stats |

---

## 3. Color Usage (Shadcn Semantic Variables)

### Text Colors

**Critical Rule:** NEVER use hardcoded colors (`zinc-900`, `white`, `gray-500`). Always use shadcn semantic variables for proper theme support.

| Variable | Usage Context | Examples |
|----------|---------------|----------|
| `text-foreground` | **Primary text:** All headings, display text, important content | Main headlines, section titles, stat numbers |
| `text-muted-foreground` | **Secondary text:** Descriptions, body paragraphs, labels, captions | Body text, stat labels, section tags, supporting text |
| `text-primary-foreground` | **Button text** on primary-colored backgrounds | CTA button text (on `bg-primary`) |
| `text-background` | **Inverted text** on dark/foreground backgrounds | Icon/text on hover states with `bg-foreground` |

### Background Colors

| Variable | Usage Context |
|----------|---------------|
| `bg-background` | Main page background, primary section backgrounds |
| `bg-muted` | Image placeholders, subtle section backgrounds, alternating sections |
| `bg-muted/50` or `bg-muted/30` | Very subtle section differentiation with opacity |
| `bg-card` | Card backgrounds, elevated UI elements |
| `bg-accent` | Highlighted areas (use sparingly for emphasis) |
| `bg-primary` | CTA buttons, primary action elements |
| `bg-foreground` | Inverted sections (rare), icon hover backgrounds |

### Border & Divider Colors

| Variable | Usage Context |
|----------|---------------|
| `border-border` | Default borders, dividers, card outlines |
| `border-foreground` | Emphasized borders (button outlines, focused states) |
| `border-foreground/20` | Subtle hover borders with opacity |

---

## 4. Letter Spacing (Tracking) Rules

Consistent letter spacing ensures visual harmony and readability.

| Tracking Class | When to Use | Example |
|----------------|-------------|---------|
| `tracking-tight` | Display XL and Display L headings (counteracts large font size) | Hero headlines, major section titles |
| `tracking-[0.15em]` | **ALL uppercase text** (labels, tags, buttons) | "OUR SERVICES", "YEARS", "VIEW PORTFOLIO" |
| Normal (no class) | Body text, regular headings, stats | Paragraphs, descriptions, numbers |

**Critical Rule:** Only use `tracking-[0.15em]` for uppercase text. No other custom tracking values allowed.

---

## 5. Component-Specific Patterns

### Hero Section Pattern

```tsx
{/* Optional small label */}
<p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
  Section Tag
</p>

{/* Main headline with serif emphasis */}
<h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-light leading-[0.9] tracking-tight text-foreground">
  Discover <span className="italic font-serif">Talent</span>
</h1>

{/* Description */}
<p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
  Supporting description text...
</p>

{/* Primary CTA */}
<button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium">
  <span>Button Text</span>
  <Icon className="w-5 h-5" />
</button>

{/* Stats section */}
<div className="flex gap-12 pt-8 border-t border-border">
  <div>
    <p className="text-3xl sm:text-4xl font-light text-foreground">40+</p>
    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Years</p>
  </div>
</div>
```

### Section Header Pattern

```tsx
{/* Optional section tag */}
<p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground mb-6">
  Our Mission
</p>

{/* Section heading */}
<h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight text-foreground">
  Section Title
</h2>

{/* Optional subtitle/description (Subtitle style) */}
<p className="text-base lg:text-lg leading-relaxed text-muted-foreground max-w-3xl">
  Section description or intro paragraph...
</p>
```

### Card Pattern

```tsx
<div className="bg-card border border-border rounded-2xl p-8">
  {/* Card icon (optional) */}
  <div className="mb-6">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
      <Icon className="w-6 h-6 text-foreground" />
    </div>
  </div>

  {/* Card title */}
  <h3 className="text-xl font-medium text-foreground mb-2">
    Card Title
  </h3>

  {/* Card description */}
  <p className="text-sm text-muted-foreground leading-relaxed">
    Card description or supporting text...
  </p>
</div>
```

### Button/CTA Patterns

```tsx
{/* Primary button */}
<button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all duration-300 hover:opacity-90">
  <span>Button Text</span>
  <ArrowRight className="w-5 h-5" />
</button>

{/* Secondary button */}
<button className="inline-flex items-center gap-2 border border-foreground text-foreground rounded-full px-6 py-3 font-medium hover:bg-foreground hover:text-background transition-all duration-300">
  <span className="uppercase tracking-[0.15em] text-sm">Button Text</span>
  <Icon className="w-4 h-4" />
</button>
```

### Portfolio Work Title Pattern (Animated)

```tsx
<h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-foreground leading-none">
  Fashion Show
</h3>
<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
  Runway excellence and high-fashion presentations...
</p>
```

---

## 6. Responsive Scaling Pattern

Use consistent breakpoint patterns for predictable scaling:

### Standard 2-Breakpoint Pattern
```
Mobile → Tablet/Desktop
text-base → lg:text-lg
text-3xl → sm:text-4xl
```

### Standard 3-Breakpoint Pattern
```
Mobile → Tablet → Desktop
text-3xl → sm:text-4xl → lg:text-5xl
text-4xl → sm:text-5xl → md:text-6xl
```

### Display XL Pattern (4 breakpoints)
```
Mobile → Small → Large → XLarge
text-[3.5rem] → sm:text-[4.5rem] → lg:text-[5.5rem] → xl:text-[6.5rem]
```

**Critical Rule:** Always scale in 2-3 breakpoints maximum. Use `sm:` and `lg:` primarily (skip `md:` unless necessary). Only Display XL uses 4 breakpoints.

---

## 7. Complete Usage Examples

### Example 1: Landing Page Hero

```tsx
<section className="relative w-full h-auto md:h-[calc(100vh-theme(spacing.16))] bg-background overflow-hidden flex items-center">
  <div className="relative mx-auto container px-6 sm:px-8 lg:px-12 py-6 w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="space-y-8">
        {/* Main Heading */}
        <h1 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-light leading-[0.9] tracking-tight text-foreground">
          Discover
          <br />
          Exceptional
          <br />
          <span className="italic font-serif">Talent</span>
        </h1>

        {/* Description */}
        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground max-w-md">
          Thailand's premier modeling agency. 40+ years connecting talent with global opportunities.
        </p>

        {/* CTA */}
        <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium">
          <span>View Portfolio</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Section with Header

```tsx
<section className="relative w-full py-24 sm:py-32 bg-background">
  <div className="mx-auto container px-6 sm:px-8 lg:px-12">
    {/* Section Header */}
    <div className="text-center mb-16">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground mb-6">
        Our Mission
      </p>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-foreground">
        Connecting exceptional talent with global opportunities
      </h2>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border max-w-2xl mx-auto">
      <div>
        <p className="text-4xl sm:text-5xl font-light text-foreground mb-2">40+</p>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Years of Excellence</p>
      </div>
      <div>
        <p className="text-4xl sm:text-5xl font-light text-foreground mb-2">500+</p>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Professional Models</p>
      </div>
      <div>
        <p className="text-4xl sm:text-5xl font-light text-foreground mb-2">Global</p>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Network Reach</p>
      </div>
    </div>
  </div>
</section>
```

### Example 3: Services Cards

```tsx
<section className="relative w-full py-20 sm:py-28 bg-muted/50">
  <div className="mx-auto container px-6 sm:px-8 lg:px-12">
    {/* Section Header */}
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground text-center mb-16">
      Our Services
    </h2>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="bg-card border border-border rounded-2xl p-8 hover:border-foreground/20 transition-all duration-300">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-medium text-foreground mb-2">
          Model Representation
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Men, Women, Kids, Seniors, Diversity
        </p>
      </div>
    </div>
  </div>
</section>
```

### Example 4: Portfolio Section with Subtitle

```tsx
<section className="relative w-full py-16 md:py-24 bg-background">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    {/* Section Heading */}
    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground">
      Our Work
    </h2>

    {/* Subtitle - Smaller than description, larger than body text */}
    <p className="mt-6 text-base lg:text-lg leading-relaxed text-muted-foreground max-w-3xl">
      Showcasing our expertise across fashion shows, commercials, editorial
      campaigns, lookbooks, and beauty collaborations
    </p>
  </div>
</section>
```

---

## 8. Implementation Checklist

When applying this system to a new component:

- [ ] Use only shadcn semantic variables for colors (no hardcoded colors)
- [ ] Apply appropriate type scale from the hierarchy
- [ ] Use `tracking-[0.15em]` for ALL uppercase text
- [ ] Use `font-light` for headings, `font-medium` for labels/buttons
- [ ] Use serif (`font-serif italic`) sparingly for emphasis only
- [ ] Apply 2-3 responsive breakpoints maximum
- [ ] Ensure proper line height for readability
- [ ] Use semantic spacing (space-y-*, gap-*)
- [ ] Test in both light and dark modes

---

## 9. Questions for Approval

Before applying this system across the entire public application, please review:

1. **Font Family Distribution:**
   - Is the Sora (headings) / Inter (body) / Playfair Display (accent) distribution appropriate for a fashion/modeling brand?
   - Should serif font be used more or less frequently?

2. **Type Scale:**
   - Are the responsive sizes appropriate? (e.g., Display XL scaling from 3.5rem to 6.5rem)
   - Should any sizes be adjusted for better mobile/desktop balance?

3. **Font Weights:**
   - Light (300) for headings, Medium (500) for labels - is this acceptable?
   - Should any components use different weights?

4. **Letter Spacing:**
   - Is `tracking-[0.15em]` the right amount for uppercase text?
   - Should `tracking-tight` be used for more/fewer headings?

5. **Component Patterns:**
   - Are the provided component patterns (hero, sections, cards) comprehensive?
   - Are there any missing patterns we should document?

6. **Scope:**
   - Should this apply to ALL public pages or are there exceptions?
   - Should any pages have different typography rules?

---

## 10. Files to Update

Once approved, this system will be applied to:

**Current (design1 - already updated):**
- `app/(public)/design1/_components/hero.tsx` ✓
- `app/(public)/design1/_components/dual-cta.tsx` ✓
- `app/(public)/design1/_components/portfolio-showcase.tsx` ✓
- `app/(public)/design1/_components/trust-indicators.tsx` ✓
- `app/(public)/design1/_components/services.tsx` ✓

**Future Pages:**
- `app/(public)/design2/` (if keeping)
- `app/(public)/design3/` (if keeping)
- Any new public landing pages
- About page (when created)
- Contact page (when created)
- Portfolio/Models listing pages
- Any other public-facing components

---

## 11. Maintenance Notes

### Adding New Text Elements

When adding new text elements to the public application:

1. Identify the content type (display, heading, body, label, stat)
2. Choose appropriate style from the type scale
3. Apply semantic color variables
4. Use proper tracking for uppercase text
5. Test responsive scaling

### Updating Existing Components

When refactoring existing components:

1. Replace all hardcoded colors with semantic variables
2. Standardize tracking values (remove custom values)
3. Ensure font weights match the system
4. Update responsive scaling to match patterns
5. Test in light/dark modes

### Version History

- **2025-11-19:** Initial proposal created based on design1 components analysis
