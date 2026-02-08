"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const href = (page: number) => `${basePath}?page=${page}`;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {currentPage > 1 && (
        <Link href={href(currentPage - 1)} className="btn-secondary px-2 py-1.5">
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 py-1 text-muted text-sm">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              p === currentPage
                ? "bg-primary text-white"
                : "text-secondary hover:text-white hover:bg-dark-hover"
            }`}
          >
            {p.toLocaleString()}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={href(currentPage + 1)} className="btn-secondary px-2 py-1.5">
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
