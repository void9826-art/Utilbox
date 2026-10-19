"use client";

import * as React from "react";

/**
 * Registers /sw.js, which keeps pages and tools you have opened working with
 * no connection. Production only: in development a caching worker would serve
 * yesterday's code and make every edit look broken.
 */
export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const register = () => {
      // A failed registration only means no offline support; the site works as before.
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
