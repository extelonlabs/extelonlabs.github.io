---
name: Extelon Library
description: A quiet personal workspace for static websites.
colors:
  background: "#141519"
  sidebar: "#191a1f"
  panel: "#1d1e24"
  raised: "#26272f"
  line: "#303138"
  text: "#f1f0f3"
  muted: "#a4a3af"
  accent: "#c6b5f3"
  accent-ink: "#272034"
  green: "#a6c3b0"
typography:
  body:
    fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  display:
    fontSize: "clamp(40px, 3.7vw, 60px)"
    fontWeight: 500
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  display-emphasis:
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
rounded:
  control: "8px"
  card: "14px"
  dialog: "16px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
  page: "42px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
---

## Overview

Dark graphite surfaces with soft violet controls and warm white typography. The homepage welcomes the owner; the navigation and project controls behave like a familiar working library. This records the builder's implementation choices, not a user-specified brand system.

## Colors

Violet marks active navigation, primary actions, and focus. Sage, amber, blue, rose, and violet distinguish project covers; they do not imply project health or availability. Preserve the existing RimWorld project’s own styling inside its page.

## Typography

Use the system UI stack for navigation and controls. A Georgia italic word gives the welcome heading its softer character. Real interface text is at least 11px, normally 12–14px; only decorative browser-window artwork uses smaller lettering. Metadata stays secondary to project names.

## Layout

A fixed 244px sidebar sits beside a top search bar and bounded main content. At 1150px the sidebar becomes 220px and the project grid has two columns. At 850px navigation becomes a dismissible drawer. At 570px projects become one column and the decorative hero disappears. The list layout remains an alternate view of the same project data.

## Elevation & Depth

Project cards use borders without shadows. Dialogs, the toast, and the decorative stacked windows use soft downward shadows. The background is flat; there are no external texture or font dependencies.

## Shapes

Controls use 6–8px corners, project cards 14px, and dialogs 16px. Icons are one consistent inline SVG stroke system. Cover artwork uses simple geometric browser windows; the RimWorld card uses actual repository imagery.

## Components

Native dialogs contain project editing, backups, confirmation, and isolated HTML previews. Every action has a visible label or accessible name. Search, project type, sort, and layout controls apply to the collection below them. Empty states explain how to recover. User-created metadata is escaped before rendering.

## Do's and Don'ts

- Keep additions visibly local to this browser; do not imply cloud sync or GitHub publishing from the form.
- Use real projects and counts. Do not seed fictional work to fill the grid.
- Keep bundled project files independent from the library shell.
- Respect reduced motion and retain keyboard focus indicators.
