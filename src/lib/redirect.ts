const DEFAULT_REDIRECT = "/dashboard";

const AUTH_PATHS = new Set(["/login", "/register"]);

export function safeNextPath(
  value: string | string[] | null | undefined,
  fallback = DEFAULT_REDIRECT,
): string {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return fallback;
  }

  try {
    const base = "http://internal.local";
    const url = new URL(raw, base);

    if (url.origin !== base) {
      return fallback;
    }

    if (
      AUTH_PATHS.has(url.pathname) ||
      url.pathname.startsWith("/login/") ||
      url.pathname.startsWith("/register/")
    ) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
