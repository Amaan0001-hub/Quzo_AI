import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export const setLenis = (l: Lenis | null): void => {
  lenisInstance = l;
};

export const getLenis = (): Lenis | null => lenisInstance;

export const scrollToId = (id: string): void => {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "home" ? 0 : -88;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, duration: 1.4 });
  else
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + offset,
      behavior: "smooth",
    });
  el.focus({ preventScroll: true });
  window.history.replaceState(null, "", `#${id}`);
};