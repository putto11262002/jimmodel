"use client";

import React, { useEffect, useRef, useState } from "react";

type MotionProps = {
  children?: React.ReactNode;
  className?: string;
  initial?: Record<string, number | string> | string;
  animate?: Record<string, number | string> | string;
  whileInView?: Record<string, number | string>;
  transition?: { duration?: number; delay?: number; ease?: string; [key: string]: unknown };
  viewport?: { once?: boolean; amount?: number };
  style?: React.CSSProperties;
  variants?: Record<string, Record<string, number | string>>;
  exit?: Record<string, number | string> | string;
  custom?: number;
  key?: string | number;
  onClick?: () => void;
  [key: string]: unknown;
};

function MotionComponent(
  {
    children,
    className,
    initial,
    animate,
    whileInView,
    transition,
    viewport,
    style,
    variants,
    ...rest
  }: MotionProps,
  ref: React.Ref<HTMLElement>,
) {
  const localRef = useRef<HTMLElement>(null);
  const elementRef = (ref as React.RefObject<HTMLElement>) || localRef;
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!whileInView || !elementRef || !("current" in elementRef)) return;
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (viewport?.once) observer.disconnect();
        } else if (!viewport?.once) {
          setIsInView(false);
        }
      },
      { threshold: viewport?.amount || 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [whileInView, viewport, elementRef]);

  const targetObj =
    typeof animate === "string"
      ? variants?.[animate]
      : whileInView
        ? (isInView ? whileInView : initial as Record<string, number | string> | undefined)
        : typeof animate === "object"
          ? animate
          : undefined;
  const initialObj = typeof initial === "object" ? initial : undefined;

  const cssStyle: React.CSSProperties = {
    ...style,
    transition: `all ${transition?.duration || 0.5}s ${transition?.ease || "ease"} ${transition?.delay || 0}s`,
    opacity: isMounted ? (targetObj?.opacity ?? initialObj?.opacity ?? 1) : (initialObj?.opacity ?? 1),
    transform: isMounted
      ? `translateY(${targetObj?.y ?? initialObj?.y ?? 0}px) translateX(${targetObj?.x ?? initialObj?.x ?? 0}px) scale(${targetObj?.scale ?? initialObj?.scale ?? 1})`
      : `translateY(${initialObj?.y ?? 0}px) translateX(${initialObj?.x ?? 0}px) scale(${initialObj?.scale ?? 1})`,
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={cssStyle} {...rest}>
      {children}
    </div>
  );
}

export const motion = {
  div: React.forwardRef(MotionComponent),
  section: React.forwardRef(MotionComponent),
  span: React.forwardRef(MotionComponent),
  h1: React.forwardRef(MotionComponent),
  h2: React.forwardRef(MotionComponent),
  h3: React.forwardRef(MotionComponent),
  p: React.forwardRef(MotionComponent),
  button: React.forwardRef(MotionComponent),
  img: React.forwardRef(MotionComponent),
  a: React.forwardRef(MotionComponent),
  ul: React.forwardRef(MotionComponent),
  li: React.forwardRef(MotionComponent),
  line: React.forwardRef(MotionComponent),
  path: React.forwardRef(MotionComponent),
};

export function useScroll(_options?: {
  target?: React.RefObject<HTMLElement | null>;
  offset?: string[];
}) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return { scrollY: { get: () => scrollY }, scrollYProgress: { get: () => 0 } };
}

export function useTransform(
  _value: { get: () => number },
  _input: number[],
  _output: (string | number)[],
): { current: string | number } {
  const ref = useRef<string | number>(_output[0]);
  return ref;
}

export function useInView(
  _ref: React.RefObject<HTMLElement | null>,
  options?: { once?: boolean; amount?: number },
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!_ref || !("current" in _ref) || !_ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.once) observer.disconnect();
        }
      },
      { threshold: options?.amount || 0.1 },
    );
    observer.observe(_ref.current);
    return () => observer.disconnect();
  }, [_ref, options]);
  return inView;
}

export function useMotionValue(initial: number) {
  const ref = useRef(initial);
  return {
    get: () => ref.current,
    set: (v: number) => {
      ref.current = v;
    },
    on: (_event: string, _callback: (v: number) => void) => () => {},
  };
}

export function useSpring(
  value: { get: () => number; on?: (event: string, cb: (v: number) => void) => () => void },
  _options?: { duration?: number },
) {
  return {
    ...value,
    on: (_event: string, _callback: (v: number) => void) => () => {},
  };
}

export function AnimatePresence({
  children,
}: {
  children: React.ReactNode;
  initial?: boolean;
  custom?: number;
  mode?: string;
}) {
  return <>{children}</>;
}
