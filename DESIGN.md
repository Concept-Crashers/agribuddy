# Visual Theme & Atmosphere
AgriBuddy Premium uses a Vercel-inspired aesthetic. It relies on stark black-and-white minimalism, precise typography, tight spacing, and minimal borders. Color is used exceptionally sparingly—only for primary actions and active states.

- **Vibe:** Technical, precise, clean, distraction-free.
- **Lighting:** Flat, border-defined (no heavy drop shadows, only subtle soft-shadows on cards).

# Color Palette & Roles

| Semantic Name | Hex | Role |
| :--- | :--- | :--- |
| `background` | `#FFFFFF` | Page background (Light mode) |
| `background-dark`| `#0A0A0A` | Page background (Dark mode) |
| `foreground` | `#000000` | Primary text (Light mode) |
| `foreground-alt`| `#FAFAFA` | Primary text (Dark mode) |
| `muted` | `#666666` | Secondary text, helper labels |
| `border` | `#EAEAEA` | Panel dividers, input borders |
| `border-dark` | `#333333` | Panel dividers, input borders (Dark) |
| `primary` | `#10B981` | Main brand color (Emerald Green) - used for primary CTAs |

# Typography Rules

Font Family: `Inter`, system-fonts (Geist, SF Pro).

| Element | Size / Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- |
| **H1** | 24px - 32px / `font-bold` | `tracking-tight` (-0.02em) | Main page titles, Auth Headers |
| **H2** | 20px / `font-semibold`| `tracking-tight` | Section headers |
| **Body text**| 14px / `font-medium` | `tracking-normal` | Paragraphs, descriptions |
| **Label** | 12px / `font-medium` | `tracking-normal` | Form labels, hints |

# Component Stylings

## Buttons
- **Primary:** `bg-black text-white hover:bg-black/90` (or `bg-primary` for the main green CTA).
- **Secondary:** `bg-white text-black border border-border hover:bg-slate-50`.
- **Shape:** `rounded-md` (usually 6px - 8px radius, no pills).

## Inputs
- **Base:** `bg-white border border-border rounded-md px-3 py-2 text-sm text-foreground`.
- **Focus state:** `focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`.

## Cards/Panels
- **Base:** `bg-white border border-border rounded-lg shadow-sm`.

# Layout Principles
- **Spacing Scale:** Use standard Tailwind spacing (`p-4`, `p-6`, `p-8`).
- **Alignment:** Center-aligned auth flows (max-width `md:max-w-md` -> ~400px wide).  
- **Visual Noise:** Reduce as much as possible. No background gradients, no illustrations on form panels.

# Do's and Don'ts
- Use `gap-4` or `gap-6` for form layout spacing.
- Don't use large radius (`rounded-2xl` or `rounded-full`). Clean `rounded-md` or `rounded-lg` only.
- Don't center-align form labels (keep them left-aligned).
