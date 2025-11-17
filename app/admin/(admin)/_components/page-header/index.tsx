import { Suspense } from "react";
import { BackButton } from "./back-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Suspense fallback={<div className="h-10 w-10" />}>
            <BackButton />
          </Suspense>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
