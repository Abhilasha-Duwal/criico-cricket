export type SearchParamValue = string | string[] | undefined;

export type PaginationMeta = {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  start: number;
  end: number;
};

export function parsePage(value: SearchParamValue): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function getPaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safeTotal = Math.max(0, Math.floor(totalItems));
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const end = Math.min(safePage * safePageSize, safeTotal);

  return {
    totalItems: safeTotal,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    start,
    end,
  };
}

export function buildPageHref(
  basePath: string,
  searchParams: Record<string, SearchParamValue>,
  page: number,
  hash?: string,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return `${basePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function getPageNumbers(
  page: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visible = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...visible]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right);

  const result: Array<number | "ellipsis"> = [];
  let previous = 0;

  for (const value of pages) {
    if (previous > 0 && value - previous > 1) {
      result.push("ellipsis");
    }

    result.push(value);
    previous = value;
  }

  return result;
}
