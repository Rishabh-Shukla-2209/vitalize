"use client";

import { useEffect } from "react";

function getScrollableParent(el: HTMLElement): HTMLElement | Window {
  let p: HTMLElement | null = el.parentElement;
  while (p) {
    const style = window.getComputedStyle(p);
    if (style.overflowY === "auto" || style.overflowY === "scroll") return p;
    p = p.parentElement;
  }
  return window;
}

export function useKeyboardAvoidance<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
) {
  useEffect(() => {
    const el = ref.current;
    const vv = window.visualViewport;

    if (!el || !vv) return;

    const scrollParent = getScrollableParent(el);

    let active = false;

    const adjust = () => {
      if (!active) return;

      const viewportHeight = vv.height;
      const rect = el.getBoundingClientRect();

      // Only scroll if input is ACTUALLY hidden by keyboard
      if (rect.bottom > viewportHeight) {
        const offset = rect.bottom - viewportHeight + 10;

        if (scrollParent === window) {
          window.scrollBy({ top: offset, behavior: "smooth" });
        } else {
          (scrollParent as HTMLElement).scrollBy({
            top: offset,
            behavior: "smooth",
          });
        }
      } else {
        // Once it's visible, stop listening
        deactivate();
      }
    };

    const activate = () => {
      active = true;
      vv.addEventListener("resize", adjust);
      vv.addEventListener("scroll", adjust);

      // run immediately on focus
      adjust();
    };

    const deactivate = () => {
      active = false;
      vv.removeEventListener("resize", adjust);
      vv.removeEventListener("scroll", adjust);
    };

    // Trigger only when input is focused
    el.addEventListener("focus", activate);
    el.addEventListener("blur", deactivate);

    return () => {
      deactivate();
      el.removeEventListener("focus", activate);
      el.removeEventListener("blur", deactivate);
    };
  }, [ref]);
}
