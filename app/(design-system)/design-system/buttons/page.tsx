import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ButtonsPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Buttons</h1>
        <p className="text-muted-foreground">
          Button components with various variants and sizes
        </p>
      </div>

      {/* Button Variants */}
      <section className="space-y-6" id="variants">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Variants</h2>
          <p className="text-sm text-muted-foreground mb-6">
            All available button variants with their respective styling
          </p>
        </div>

        <div className="space-y-8">
          {/* Default */}
          <div className="space-y-3" id="variant-default">
            <h3 className="text-sm font-medium text-muted-foreground">
              Default
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default Button</Button>
              <Button variant="default" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Destructive */}
          <div className="space-y-3" id="variant-destructive">
            <h3 className="text-sm font-medium text-muted-foreground">
              Destructive
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive">Delete Item</Button>
              <Button variant="destructive" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3" id="variant-info">
            <h3 className="text-sm font-medium text-muted-foreground">Info</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="info">View Details</Button>
              <Button variant="info" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Success */}
          <div className="space-y-3" id="variant-success">
            <h3 className="text-sm font-medium text-muted-foreground">
              Success
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="success">Save Changes</Button>
              <Button variant="success" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="space-y-3" id="variant-warning">
            <h3 className="text-sm font-medium text-muted-foreground">
              Warning
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="warning">Review Changes</Button>
              <Button variant="warning" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Outline */}
          <div className="space-y-3" id="variant-outline">
            <h3 className="text-sm font-medium text-muted-foreground">
              Outline
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Outline Button</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-3" id="variant-secondary">
            <h3 className="text-sm font-medium text-muted-foreground">
              Secondary
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Ghost */}
          <div className="space-y-3" id="variant-ghost">
            <h3 className="text-sm font-medium text-muted-foreground">Ghost</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="ghost" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Link */}
          <div className="space-y-3" id="variant-link">
            <h3 className="text-sm font-medium text-muted-foreground">Link</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="link">Link Button</Button>
              <Button variant="link" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-6" id="sizes">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Available button sizes for different use cases
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3" id="size-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Small</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small Button</Button>
              <Button size="sm" variant="outline">
                Small Outline
              </Button>
              <Button size="sm" variant="ghost">
                Small Ghost
              </Button>
            </div>
          </div>

          <div className="space-y-3" id="size-default">
            <h3 className="text-sm font-medium text-muted-foreground">
              Default
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="default">Default Button</Button>
              <Button size="default" variant="outline">
                Default Outline
              </Button>
              <Button size="default" variant="ghost">
                Default Ghost
              </Button>
            </div>
          </div>

          <div className="space-y-3" id="size-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Large</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">Large Button</Button>
              <Button size="lg" variant="outline">
                Large Outline
              </Button>
              <Button size="lg" variant="ghost">
                Large Ghost
              </Button>
            </div>
          </div>

          <div className="space-y-3" id="size-icon">
            <h3 className="text-sm font-medium text-muted-foreground">
              Icon Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="icon-sm" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
              <Button size="icon" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
              <Button size="icon-lg" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4" id="usage">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            Buttons trigger actions and events. Choose the appropriate variant
            based on the action&apos;s importance, context, and hierarchy.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Variant Usage</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <a href="#variant-default" className="text-foreground underline">
                    Default
                  </a>
                  : Use for primary actions and main CTAs (e.g., Submit, Create,
                  Continue)
                </li>
                <li>
                  <a
                    href="#variant-destructive"
                    className="text-foreground underline"
                  >
                    Destructive
                  </a>
                  : Use for dangerous actions that cannot be easily undone (e.g.,
                  Delete, Remove, Cancel Subscription). See{" "}
                  <Link
                    href="/design-system/colors#semantic-destructive"
                    className="text-foreground underline"
                  >
                    destructive color
                  </Link>
                </li>
                <li>
                  <a href="#variant-info" className="text-foreground underline">
                    Info
                  </a>
                  : Use for informational actions (e.g., View Details, Learn More,
                  Help)
                </li>
                <li>
                  <a href="#variant-success" className="text-foreground underline">
                    Success
                  </a>
                  : Use for positive confirmations (e.g., Save, Confirm, Approve).
                  See{" "}
                  <Link
                    href="/design-system/colors#semantic-success"
                    className="text-foreground underline"
                  >
                    success color
                  </Link>
                </li>
                <li>
                  <a href="#variant-warning" className="text-foreground underline">
                    Warning
                  </a>
                  : Use for actions requiring caution (e.g., Review, Verify,
                  Proceed with Caution). See{" "}
                  <Link
                    href="/design-system/colors#semantic-warning"
                    className="text-foreground underline"
                  >
                    warning color
                  </Link>
                </li>
                <li>
                  <a href="#variant-outline" className="text-foreground underline">
                    Outline
                  </a>
                  : Use for secondary actions with less visual emphasis (e.g.,
                  Cancel, Go Back)
                </li>
                <li>
                  <a
                    href="#variant-secondary"
                    className="text-foreground underline"
                  >
                    Secondary
                  </a>
                  : Use for alternative primary actions
                </li>
                <li>
                  <a href="#variant-ghost" className="text-foreground underline">
                    Ghost
                  </a>
                  : Use for tertiary actions with minimal emphasis (e.g., menu
                  items, toolbar actions)
                </li>
                <li>
                  <a href="#variant-link" className="text-foreground underline">
                    Link
                  </a>
                  : Use for navigation or text-like actions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-3">Size Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <a href="#size-sm" className="text-foreground underline">
                    Small
                  </a>
                  : Use in compact spaces, tables, or when multiple buttons appear
                  together
                </li>
                <li>
                  <a href="#size-default" className="text-foreground underline">
                    Default
                  </a>
                  : Use for most cases, balanced size for forms and general UI
                </li>
                <li>
                  <a href="#size-lg" className="text-foreground underline">
                    Large
                  </a>
                  : Use for prominent CTAs, hero sections, or marketing pages
                </li>
                <li>
                  <a href="#size-icon" className="text-foreground underline">
                    Icon sizes
                  </a>
                  : Use for icon-only buttons in toolbars, action menus, or compact
                  layouts
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-3">Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  Use only one primary (default) button per section to maintain
                  clear hierarchy
                </li>
                <li>
                  Place destructive actions away from primary actions to prevent
                  accidental clicks
                </li>
                <li>Always provide clear, action-oriented button labels</li>
                <li>Use disabled state sparingly and provide feedback why</li>
                <li>Ensure sufficient spacing between adjacent buttons (minimum 8px)</li>
                <li>
                  Use consistent button variants throughout the application for the
                  same action types
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
