import Link from "next/link";
import {
  buildPageHref,
  getPageNumbers,
  type SearchParamValue,
} from "@/lib/pagination";

type PaginationProps = {
  page: number;
  totalItems: number;
  totalPages: number;
  start: number;
  end: number;
  itemLabel: string;
  basePath: string;
  searchParams?: Record<string, SearchParamValue>;
  hash?: string;
};

const navButtonClassName =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900";
const disabledButtonClassName =
  "pointer-events-none opacity-40";
const activePageClassName =
  "border-emerald-500 bg-emerald-500 text-slate-950 hover:border-emerald-500 hover:bg-emerald-400";

export default function Pagination({
  page,
  totalItems,
  totalPages,
  start,
  end,
  itemLabel,
  basePath,
  searchParams = {},
  hash,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(page, totalPages);
  const hrefForPage = (targetPage: number) =>
    buildPageHref(basePath, searchParams, targetPage, hash);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
      <p className="text-sm text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-200">
          {start}&ndash;{end}
        </span>{" "}
        of <span className="font-semibold text-slate-200">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Link
          href={hrefForPage(page - 1)}
          aria-disabled={page <= 1}
          className={`${navButtonClassName} ${page <= 1 ? disabledButtonClassName : ""}`}
        >
          Previous
        </Link>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-slate-500"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={pageNumber}
              href={hrefForPage(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`${navButtonClassName} ${
                pageNumber === page ? activePageClassName : ""
              }`}
            >
              {pageNumber}
            </Link>
          ),
        )}

        <Link
          href={hrefForPage(page + 1)}
          aria-disabled={page >= totalPages}
          className={`${navButtonClassName} ${
            page >= totalPages ? disabledButtonClassName : ""
          }`}
        >
          Next
        </Link>
      </nav>
    </div>
  );
}
