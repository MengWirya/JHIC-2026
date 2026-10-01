"use client";

import { useEffect } from "react";

export function LegacyInteractions() {
  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>(
      ".legacy-page .navbar-header .navbar"
    );
    const toggler = document.querySelector<HTMLButtonElement>(
      ".legacy-page .navbar-toggler"
    );
    const collapse = document.querySelector<HTMLElement>(
      ".legacy-page .navbar-collapse"
    );

    if (!navbar) return;

    const updateStickyState = () => {
      navbar.classList.toggle("sticky", window.scrollY > 40);
    };

    updateStickyState();
    window.addEventListener("scroll", updateStickyState, { passive: true });

    const toggleMenu = () => {
      if (!toggler || !collapse) return;
      const isOpen = collapse.classList.toggle("show");
      toggler.setAttribute("aria-expanded", String(isOpen));
    };

    toggler?.addEventListener("click", toggleMenu);

    return () => {
      window.removeEventListener("scroll", updateStickyState);
      toggler?.removeEventListener("click", toggleMenu);
    };
  }, []);

  return null;
}
