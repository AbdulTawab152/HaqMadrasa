"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const RouteProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const completionTimeoutRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const clearScheduledUpdates = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];

    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const hideProgress = useCallback(() => {
    setIsVisible(false);
    setProgress(0);
    isAnimatingRef.current = false;
  }, []);

  const finishProgress = useCallback(() => {
    if (!isAnimatingRef.current) return;

    clearScheduledUpdates();
    setProgress(100);

    completionTimeoutRef.current = window.setTimeout(() => {
      hideProgress();
    }, 200);
  }, [clearScheduledUpdates, hideProgress]);

  const startProgress = useCallback(() => {
    clearScheduledUpdates();
    isAnimatingRef.current = true;
    setIsVisible(true);
    setProgress(12);

    const checkpoints = [38, 56, 74, 87];
    checkpoints.forEach((value, index) => {
      const timeout = window.setTimeout(() => {
        setProgress((previous) => (previous < value ? value : previous));
      }, 120 + index * 140);
      timeoutsRef.current.push(timeout);
    });
  }, [clearScheduledUpdates]);

  useEffect(() => {
    const handleLinkNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel") === "external") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const currentUrl = new URL(window.location.href);
      const destinationUrl = new URL(anchor.href);

      const isSameOrigin = currentUrl.origin === destinationUrl.origin;
      const isSameLocation =
        currentUrl.pathname === destinationUrl.pathname &&
        currentUrl.search === destinationUrl.search;

      if (isSameOrigin && !isSameLocation) {
        startProgress();
      }
    };

    document.addEventListener("click", handleLinkNavigation);
    return () => document.removeEventListener("click", handleLinkNavigation);
  }, [startProgress]);

  useEffect(() => {
    if (!isAnimatingRef.current) return;
    finishProgress();
  }, [pathname, searchParams, finishProgress]);

  useEffect(() => {
    startProgress();
    const initialCompletion = window.setTimeout(() => {
      finishProgress();
    }, 300);

    return () => window.clearTimeout(initialCompletion);
  }, [startProgress, finishProgress]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-transparent">
      <div className="h-full overflow-hidden rounded-full bg-primary-100/50">
        <div
          className="h-full bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default RouteProgressBar;
