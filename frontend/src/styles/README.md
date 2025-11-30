# Styling conventions

- **Prefer utility-first classes** for layout, spacing, typography, and colors on route and component JSX. The project leans on Tailwind-friendly class names alongside design tokens from `theme.css`, so reach for inline utilities before adding new CSS selectors.
- **Use component-scoped CSS (modules or colocated files)** only when a pattern cannot be expressed cleanly with utilities (e.g., keyframe animations, complex stateful styling, or third-party overrides). Keep selectors narrow to avoid leaking styles globally.
- **Keep global styles minimal.** Shared variables and resets live in `src/styles/theme.css` and `src/index.css`. Avoid introducing new top-level stylesheets; instead, extend the theme variables or component styles as needed.

Following these guardrails should help prevent duplicated gradients or layout rules while keeping most styling self-contained.
