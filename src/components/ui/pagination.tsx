"use client";

import { useEffect } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage?: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
}: PaginationProps) {
  useEffect(() => {
    if (currentPage < totalPages && onNextPage) {
      onNextPage();
    }
  }, [currentPage, totalPages, onNextPage]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  const renderPageButton = (page: number) => (
    <Button
      key={page}
      variant={page === currentPage ? "default" : "outline"}
      size="icon"
      onClick={() => onPageChange(page)}
      disabled={page === currentPage}
    >
      {page}
    </Button>
  );

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index, array) => {
        if (index > 0 && page - array[index - 1] > 1) {
          return (
            <div key={`ellipsis-${page}`} className="flex items-center gap-2">
              <span className="text-muted-foreground">...</span>
              {renderPageButton(page)}
            </div>
          );
        }
        return renderPageButton(page);
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
