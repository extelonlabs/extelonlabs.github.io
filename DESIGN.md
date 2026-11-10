---
name: Extelon Labs
description: A public home for Extelon Labs projects.
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
    fontSize: "clamp(48px, 5.7vw, 88px)"
    fontWeight: 500
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  display-emphasis:
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
rounded:
  control: "8px"
  card: "14px"
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

Dark graphite surfaces with soft violet controls and warm white typography. “Things I build.” introduces a public project homepage, with Extelon Labs as the sidebar and top-level identity. Preserve this visual system as the catalog grows.

## Colors

Violet marks active navigation, primary actions, and focus. Project artwork can use secondary colors without implying project health or availability. Preserve each existing project's own styling inside its page.

## Typography

Use the system UI stack for navigation and controls, with a Georgia italic accent in the hero. Project names lead, descriptions explain their purpose, and repository links remain secondary. Keep the hero readable as it scales from desktop to phone.

## Layout

A fixed 238px sidebar sits beside bounded main content. Project cards and sidebar links come from the same manifest. At 1100px the grid uses two columns, at 820px the sidebar becomes top navigation, and at 520px cards use one column. Keep project names and primary destinations readable at every width.

## Elevation & Depth

Project cards use borders without shadows. Decorative artwork uses soft downward shadows. The background is flat; there are no external texture or font dependencies.

## Shapes

Controls use 8px corners and project cards use 14px corners. Icons use a consistent inline SVG stroke system. The catalog uses `rimworld`, `temperature`, `map`, and `launcher` cover treatments. Omit the manifest cover for generic artwork. The RimWorld card uses repository imagery.

## Components

Project cards provide a primary destination and an optional repository link. The primary action label defaults to “Open project” and can be set in the manifest. Sidebar project links jump to those cards. Render manifest copy as text and give links clear accessible names.

## Do's and Don'ts

- Present one shared, repository-maintained project catalog to every visitor.
- Use real projects and counts. Do not seed fictional work to fill the grid.
- Keep individual project files independent from the homepage shell.
- Respect reduced motion and retain keyboard focus indicators.
