export default function ColorsPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Colors</h1>
        <p className="text-muted-foreground">
          Core color system and semantic color variables
        </p>
      </div>

      {/* Color Palette */}
      <section className="space-y-6" id="palette">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Core color variables used throughout the application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary */}
          <div className="space-y-2" id="color-primary">
            <div className="h-20 rounded-lg bg-primary border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground font-mono">
                --primary
              </p>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-2" id="color-secondary">
            <div className="h-20 rounded-lg bg-secondary border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground font-mono">
                --secondary
              </p>
            </div>
          </div>

          {/* Destructive */}
          <div className="space-y-2" id="color-destructive">
            <div className="h-20 rounded-lg bg-destructive border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground font-mono">
                --destructive
              </p>
            </div>
          </div>

          {/* Success */}
          <div className="space-y-2" id="color-success">
            <div className="h-20 rounded-lg bg-success border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-muted-foreground font-mono">
                --success
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="space-y-2" id="color-warning">
            <div className="h-20 rounded-lg bg-warning border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Warning</p>
              <p className="text-xs text-muted-foreground font-mono">
                --warning
              </p>
            </div>
          </div>

          {/* Muted */}
          <div className="space-y-2" id="color-muted">
            <div className="h-20 rounded-lg bg-muted border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground font-mono">
                --muted
              </p>
            </div>
          </div>

          {/* Accent */}
          <div className="space-y-2" id="color-accent">
            <div className="h-20 rounded-lg bg-accent border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground font-mono">
                --accent
              </p>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-2" id="color-background">
            <div className="h-20 rounded-lg bg-background border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground font-mono">
                --background
              </p>
            </div>
          </div>

          {/* Foreground */}
          <div className="space-y-2" id="color-foreground">
            <div className="h-20 rounded-lg bg-foreground border" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Foreground</p>
              <p className="text-xs text-muted-foreground font-mono">
                --foreground
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="space-y-6" id="semantic-colors">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Semantic Colors</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Colors with specific meaning and usage contexts
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              name: "Destructive",
              color: "destructive",
              description:
                "Used for destructive actions, errors, and critical alerts",
            },
            {
              name: "Success",
              color: "success",
              description:
                "Used for successful operations, confirmations, and positive feedback",
            },
            {
              name: "Warning",
              color: "warning",
              description:
                "Used for warnings, cautions, and actions requiring attention",
            },
          ].map(({ name, color, description }) => (
            <div key={color} className="space-y-3" id={`semantic-${color}`}>
              <div>
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[5, 10, 20, 30, 50].map((opacity) => (
                  <div key={opacity} className="space-y-2">
                    <div
                      className={`h-16 rounded-lg border bg-${color}/${opacity}`}
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {opacity}% opacity
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4" id="usage">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        <div className="prose prose-sm max-w-none">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              Use{" "}
              <a href="#color-primary" className="text-foreground underline">
                primary
              </a>{" "}
              for main actions and brand elements
            </li>
            <li>
              Use{" "}
              <a
                href="#semantic-destructive"
                className="text-foreground underline"
              >
                destructive
              </a>{" "}
              sparingly for dangerous actions and errors
            </li>
            <li>
              Use{" "}
              <a href="#semantic-success" className="text-foreground underline">
                success
              </a>{" "}
              to indicate positive outcomes
            </li>
            <li>
              Use{" "}
              <a href="#semantic-warning" className="text-foreground underline">
                warning
              </a>{" "}
              for actions requiring user attention
            </li>
            <li>
              Use{" "}
              <a href="#color-muted" className="text-foreground underline">
                muted
              </a>{" "}
              for secondary content and backgrounds
            </li>
            <li>
              Use low opacity (5-20%) for subtle backgrounds, medium opacity
              (30-50%) for more prominent elements
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
