"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════════════
   KREO CINEMATIC LASER TRANSITION SYSTEM
   ─────────────────────────────────────────────────────────────────────────
   Entry  : dark veil retreats left→right behind a golden laser beam
   Exit   : golden laser sweeps left→right, darkness follows behind it
   Extra  : scanlines + chromatic aberration flash for cinema-grade feel
═══════════════════════════════════════════════════════════════════════════ */

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });

export function useKreoNav() {
  return useContext(TransitionCtx);
}

export function KreoTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isNavigating = useRef(false);

  /* ── entry animation fires on every pathname change ── */
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    // reset first so animation re-plays on same-phase navigation
    el.removeAttribute("data-phase");
    const raf = requestAnimationFrame(() => {
      el.setAttribute("data-phase", "entry");
    });
    const t = setTimeout(() => el.removeAttribute("data-phase"), 750);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;

      const el = overlayRef.current;
      if (!el) {
        router.push(href);
        isNavigating.current = false;
        return;
      }

      el.removeAttribute("data-phase");
      requestAnimationFrame(() => {
        el.setAttribute("data-phase", "exit");
      });

      setTimeout(() => {
        router.push(href);
        isNavigating.current = false;
      }, 480);
    },
    [router]
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      {/* ── Transition overlay — lives above everything ── */}
      <div
        ref={overlayRef}
        className="kreo-pt"
        aria-hidden="true"
        data-phase=""
      >
        {/* Dark veil — expands / retreats */}
        <div className="kreo-pt-veil" />

        {/* Golden laser beam */}
        <div className="kreo-pt-laser" />

        {/* CRT scanlines flash */}
        <div className="kreo-pt-scanlines" />

        {/* Chromatic aberration flash on entry */}
        <div className="kreo-pt-chromatic" />
      </div>
    </TransitionCtx.Provider>
  );
}

/* ── Thin wrapper so any component can trigger a cinematic navigation ── */
export function TransitionLink({
  href,
  children,
  className,
  style,
  title,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: () => void;
}) {
  const { navigate } = useKreoNav();
  return (
    <a
      href={href}
      className={className}
      style={style}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
