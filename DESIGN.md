---
version: alpha
colors:
  background: "#000000"
  panel: "#090d10"
  field: "#12171B"
  cyan: "#00b5d9"
  aqua: "#00ffff"
  text: "#f2fbfd"
  muted: "#81949b"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
rounded:
  control: "30px"
  card: "30px"
spacing:
  base: "8px"
components:
  button:
    radius: "30px"
    gradient: "linear-gradient(135deg, #00b5d9, #00ffff)"
  input:
    radius: "30px"
    background: "#12171B"
  public-page:
    radius: "30px"
    background: "#080e12"
---
# QRCo — Design context

## Overview
QRCo is the private company workspace for creating, editing, publishing, and monitoring dynamic QR experiences. The interface is a product/admin surface, not a marketing landing page. Preserve the existing CLADx identity and use QRCo as the system name.

## Colors
The base is black with deep charcoal panels and input surfaces. Cyan-to-aqua gradients are reserved for primary actions and small state icons. Light mode uses cool grey-blue surfaces while preserving the same cyan identity.

## Typography
Use Space Grotesk for display/section headings and DM Sans for body, form, and utility text. Keep English and Arabic readable with system fallbacks.

## Layout
Desktop uses a persistent left sidebar and a two-column QR editor with a sticky preview column that follows the document scroll. Mobile uses an overlay navigation drawer, bottom navigation, and one-column editor. The page itself owns vertical scrolling; the preview column must not create a nested scrollbar.

## Elevation & Depth
Cards use subtle cyan-tinted borders and restrained shadows. Popovers and the account menu float above the page without changing document flow.

## Shapes
Controls, cards, fields, link rows, and image containers use the 30px radius family. The CLADx wordmark remains square-cornered. The Bio profile portrait and social icons are circular by their role.

## Components
Primary actions use the 135-degree cyan-to-aqua gradient. Header language/theme actions are icon-only; the avatar opens a compact floating account menu. Public link rows use a circular image at the start, centered label, and circular arrow action at the end.

## Do's and Don'ts
- Keep QRCo/CLADx brand colors and existing application workflows.
- Keep QR code and destination-page previews together, with destination-page preview above QR preview.
- Do not add a nested scrollbar to the editor preview.
- Do not make Bio links configurable by ID: its public path is the singleton `/go/bio`.
- Keep the Bio page free of the CLADx wordmark at its top; use the supplied avatar artwork instead.
