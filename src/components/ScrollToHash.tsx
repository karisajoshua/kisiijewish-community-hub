import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to #hash anchors on route change.
 * Sticky navbar offset is handled per-section via `scroll-mt-28`.
 */
export const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const id = hash.replace("#", "");
    // Wait a tick for lazy content / Suspense to render
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
};
