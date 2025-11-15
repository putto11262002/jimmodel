import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  category,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show on each side of current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className || ""}`}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {hasPrevious ? (
        <Link
          href={`/models/${category}/${currentPage - 1}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-accent hover:border-input transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground cursor-not-allowed"
          disabled
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex items-center justify-center w-10 h-10 text-muted-foreground"
          >
            {page}
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-medium border border-primary"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`/models/${category}/${page}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-accent hover:border-input transition-colors font-medium"
          >
            {page}
          </Link>
        )
      )}

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={`/models/${category}/${currentPage + 1}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-accent hover:border-input transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground cursor-not-allowed"
          disabled
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </nav>
  );
}
