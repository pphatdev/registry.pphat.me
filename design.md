# Design System & Architecture Guidelines: `icons.pphat.me`

`icons.pphat.me` is a modern, developer-first Vector Icon Studio and Registry Explorer built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **`@pphatdev/registry`**.

---

## 🎨 1. Design Identity & Aesthetics

### A. Color Palette & HSL Tokens
The application utilizes a dark/light responsive color palette defined with HSL CSS custom variables in `globals.css` with `@theme inline` in Tailwind CSS v4:

| Token | Light Mode (Default) | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `hsl(0, 0%, 100%)` | `hsl(240, 10%, 11%)` | Main viewport & canvas backdrop |
| `--foreground` | `hsl(240, 10%, 11%)` | `hsl(0, 0%, 100%)` | Primary text & icon defaults |
| `--primary` | `hsl(163, 96%, 25%)` | `hsl(163, 96%, 25%)` | Brand accent (Emerald), active states, badges |
| `--muted` | `hsl(240, 4.8%, 95.9%)` | `hsl(240, 5.9%, 10%)` | Background fills for controls & pills |
| `--border` | `hsl(240, 5.9%, 90%)` | `hsl(240, 5.9%, 20%)` | Subtly defined component boundaries |

### B. Typography
- **Display & UI Font**: `Plus Jakarta Sans` (`font-sans`).
- **Code & Monospace**: `JetBrains Mono` (`font-mono`).

### C. Visual Effects & Glassmorphism
- **Unified Glass Container**: `.glass-panel` utility applies backdrop blur (`backdrop-blur-lg`), subtle borders, and glassmorphic translucency.
- **Edge-to-Edge Divider Padding**: Top window header bar uses `px-4 sm:px-5 py-3 border-b border-border/40` extending edge-to-edge, while the parent container has `overflow-hidden` without outer padding.

---

## 🖥️ 2. Single Card 2-Side Studio Stage Architecture

The interactive playground stage is unified inside a single glassmorphic card, divided into **2 distinct 6-column sides**:

```
+-----------------------------------------------------------------------------------+
| (o)(o)(o) @pphatdev/registry                                      v1.1.0 Playground |
+-----------------------------------------------------------------------------------+
|  SIDE 1: VECTOR ICON PREVIEW (6 Cols)   | SIDE 2: CONTROLS & CODE OUTPUT (6 Cols) |
|  +------------------------------------+ | +-------------------------------------+ |
|  | Vector Icon Preview        [64x64] | | | Controls & Code Output [Next|Nuxt|SVG]| |
|  +------------------------------------+ | +-------------------------------------+ |
|  | [Arrow] [Search] [Code] [Sparkles] | | | Size: [16|24|32|48|64] Rotate: [0°] | |
|  |                                    | | | Color: (●) (●) (●) (●) (●)          | |
|  | +--------------------------------+ | | +-------------------------------------+ |
|  | | [CAD|Checker]                  | | | | CODE INSPECTOR (VS Code Dark+)      | |
|  | |                                | | | | import React, { forwardRef } ...  | |
|  | |          [  ICON  ]            | | | | export const ArrowRightIcon = ...   | |
|  | |                                | | | +-------------------------------------+ |
|  | | [Size: 64px]      [Rotate: 0°] | | | | CLI TERMINAL INSTALLER              | |
|  | +--------------------------------+ | | | $ npx @pphatdev/registry add ... [>]| |
|  +------------------------------------+ | +-------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### A. Side 1: Vector Icon Preview (Left 6 Cols)
- **Section Header**: `Vector Icon Preview` with active stage size readout (`h-8`).
- **Vector Asset Selector**: Horizontal scrolling pill bar featuring live mini SVG icons (`Arrow`, `Search`, `Code`, `Sparkles`, `Cmd`, `Zap`, `Shield`, `Globe`).
- **Artboard Viewport Canvas**:
  - **Height**: Flexible viewport canvas (`min-h-[300px] flex-1`) stretching to match the height of Side 2.
  - **Floating Grid Switcher**: Top-left glassmorphic overlay to toggle between **CAD** grid (`radial-gradient`) and **Checker** pattern (`linear-gradient`), with **CAD** set as default.
  - **Center Graphic**: Primary vector preview badge displaying actual size pill (`64px Asset`).
  - **Status Overlay**: Floating status bar showing active `Size: 64px` and `Rotate: 0°`.

### B. Side 2: Controls & Code Output (Right 6 Cols)
- **Section Header**: `Controls & Code Output` featuring format switcher tabs (`Next.js`, `NuxtJS`, `SVG`) with matching `h-8` height.
- **Inline Controls Bar**:
  - **Size Selector**: Pill buttons (`16`, `24`, `32`, `48`, `64`).
  - **Rotation Dial**: Angle buttons (`0°`, `90°`, `180°`, `270°`).
  - **Color Theme**: Swatches (`currentColor`, `#10b981`, `#38bdf8`, `#f59e0b`, `#ec4899`, `#8b5cf6`).
- **VS Code Dark+ Code Inspector**:
  - Real-time code generation updated dynamically whenever any option changes (asset, format, size, rotation angle, or color theme).
  - Uses exact VS Code Dark+ syntax highlighting (`#ce9178` strings, `#c586c0` keywords, `#569cd6` tags, `#9cdcfe` attributes).
  - Includes 1-click **Copy Code** button with copied state feedback.
- **Terminal CLI Installer Box**:
  - Displays ready-to-run installation prompt (`$ npx @pphatdev/registry add arrow-right --type nextjs`).
  - Includes 1-click **Copy Command** trigger.

---

## ⚡ 3. Real-Time Dynamic Code Generation

`icons.pphat.me` generates live code output matching the active state:

1. **PascalCase Naming**: Converts hyphenated icon identifiers (`arrow-right`) to component names (`ArrowRightIcon`).
2. **Inner Vector Path Injection**: Injects exact `<path>`, `<circle>`, or `<polygon>` SVG elements per selected icon.
3. **Dynamic Attributes**: Automatically updates `width`, `height`, `color`, `strokeWidth`, and transform rotation attributes (`style={{ transform: 'rotate(90deg)' }}`).

---

## 🌐 4. Footer Architecture (Khmer-DateTime Style)

The application footer (`Footer.tsx`) follows the clean, modern layout inspired by `khmer-datetime.pphat.me`:

- **Ambient Background Glow**: Radial emerald lighting blur (`bg-primary/10 blur-[100px]`).
- **Top Gradient Beam**: Center-aligned horizontal beam divider line (`via-border`).
- **Glassmorphic Badge Pill**:
  - **Created by / PPhat**: Features the GitHub profile avatar (`https://github.com/pphatdev.png`) with smooth grayscale-to-color transition and title `Senior Front End Developer`.
