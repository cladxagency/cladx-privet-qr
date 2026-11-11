# QRCo — UX contract

## Scope and sources
This contract records observable UI behavior for the static HTML/CSS/JavaScript dashboard and Cloudflare Pages Functions. Existing Cloudflare KV/API behavior is preserved. The attached `UI.txt`, existing `README.md`, current API handlers, and current sibling workflows are implementation/business evidence.

## Navigation and route titles
- Desktop: persistent sidebar; mobile: overlay sidebar plus five-item bottom navigation.
- The avatar opens a compact, dismissible account popover positioned beside the trigger.
- The QR editor is a distinct create/edit workflow. Create always starts a new draft; edit loads the selected record.
- The page document owns scrolling. The editor preview is sticky on desktop but never internally scrollable.
- The save action floats only while its in-flow position is outside the usable viewport; on mobile it clears the bottom navigation.

## QR record lifecycle
- Records are stored under `qr:<id>` in Cloudflare KV through the existing authenticated links API.
- Existing record types remain supported. `bio` is an additional accepted type.
- Bio links is a singleton record with immutable ID `bio` and public path `/go/bio`. Only one Bio links record can exist at a time. It remains editable from the QR library; the type cannot be converted to another type while editing.
- Bio links requires a company name and at least one complete link label + HTTP(S) URL. Social links are optional.
- Link fields without a scheme are normalized to HTTPS before validation/save. `tel:` and `mailto:` are retained for the matching Bio social platform types.
- Successful saves return to the QR library and update the local cache after the server confirms the save.

## Public destinations
- Active `url` and `phone` records preserve direct destination behavior.
- Page-based records render through `public.html`; inactive and missing records retain the existing 410/404 behavior.
- Bio links renders a centered fixed avatar, company identity, description, social links, link cards, optional subtitle, share action, and attribution.
- Payments and Bio links share the same two-column desktop / one-column mobile link-card system. Bank rows include labels and copy actions.
- Public pages use `avatar.webp` for their favicon and social preview image. Dashboard uses `favicon.webp`; PWA install uses both favicon assets.

## Preferences and localization
- English remains the original default unless the user saves a different default in Settings.
- Arabic switches the document to RTL. Theme and language choices persist in local storage.
- The company name is stored locally and seeds new QR names and Bio company-name defaults.
- User edits to a generated QR name prevent automatic type-switch renaming. Untouched generated names receive an incrementing suffix when the base name already exists.

## Failure and recovery
- Cloudflare KV/API failures must not be represented as successful saves.
- Existing local cache, backup, restore, authentication, scan analytics, and notification flows remain in place.
- A Bio record is not silently overwritten by creating a second one; the create type is disabled while the singleton exists.
