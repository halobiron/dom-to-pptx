# Design Philosophy: Premium UI/UX Engine

This document outlines the elite design principles for generating breathtaking PowerPoint slides using the `dom-to-pptx` skill.

## 1. Aesthetic Signatures

### Luminous Design Bias

Prioritize "Luminous Design Systems." Light themes are highly appreciated as they evoke clarity, premium editorial quality, and high-end brand sophistication (reminiscent of Apple, Leica, or Aesop). Use off-whites, bone, ivory, and light-grey washes to create sophisticated layers.

### Typography Soul

- **Super-Titles**: `font-size: 80px; font-weight: 200; tracking: -0.05em; line-height: 1.1;`
- **Sub-Titles**: `font-size: 14px; font-weight: 800; tracking: 0.3em; text-transform: uppercase; color: [ACCENT];`
- **Body Copy**: `font-size: 24px; font-weight: 400; line-height: 1.6; color: [TYPE-SECONDARY];`

### Materiality & Physics

- **Glassmorphism (Safe)**: Use `background: rgba(255,255,255,0.8)` with a 1px solid white border. Do NOT use `backdrop-filter`.
- **Shadow Layering**: Use multi-layered shadows for depth.
  Example: `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);`
- **Micro-Details**: Add subtle aesthetic details like a glowing dot next to a title or a 1px separator line (`height: 1px; width: 48px; background: [ACCENT]; margin-bottom: 16px;`).

---

## 2. Advanced Layout Strategies

### The Asymmetrical Editorial

Staggered layout where text and images overlap slightly.

- Massive image (e.g., width: 60%) positioned on one side.
- Floating text card overlapping the image by 10% (use `left` or `right` math to overlap).

### The Dynamic Bento-Box

Utilize a structured grid of cards with varying sizes.

- Never make boxes equal sizes.
- One "Hero" box spans two columns/rows.
- Smaller adjacent boxes for secondary data or icons.

### The Typographic Poster

For key quotes or statements.

- Massive, overlapping typography as the primary visual element.
- Treat text as art: `font-size: 200px; opacity: 0.05; position: absolute; top: -40px;`

### The Vogue Split-Screen

- One half: Stunning edge-to-edge masked image (`border-radius: 32px`).
- Other half: Vertically centered, highly spaced typography with generous padding.

---

## 3. Spatial Geometry & Anti-Overflow

### The Rule of Three

Never stack 3 or more cards vertically in a single column. If you have 3+ items, distribute them horizontally or use a Bento layout.

### Ruthless Brevity

Limit body text to a maximum of 15 words per block. Edit down content to its most punchy form.

### CSS Shrink-Wrapping

Every flex child and text container must have `min-height: 0` and `overflow: hidden`. This prevents vertical blowout, which is a critical failure in PPT exports.

---

## 4. Imagery

Images must feel premium and be locally accessible for high-fidelity rendering.

- **Prompting**: Use keywords like "cinematic lighting", "minimalist studio", "high-end editorial", "architectural photography".
- **Local Storage**: Always save generated images into an `images/` directory in the project root.
- **Relative Pathing**: Reference images in HTML using `/images/filename.png` to ensure compatibility with local dev servers.
- **Styling**: Always use `object-fit: cover` and `border-radius: 32px`.
