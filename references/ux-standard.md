# UX standard

Apply with the project's own components and conventions. When the product already does something one way, consistency beats any rule here.

## Flow

- One obvious primary action per screen; secondary actions are quieter (ghost buttons, an overflow menu when there are more than two per row).
- Creating or editing something small happens in place (dialog, drawer, inline) if the product does that; long forms become sections or steps with progress, validating each step before moving on, and editing lets the user jump to any step.
- After an action: confirm success briefly (toast or inline), show the result where the user expects it, keep their context (filters, scroll, selection).
- Destructive actions ask for confirmation in plain words and say what happens; prefer soft-delete or undo when the product supports it.
- Closing a dialog by clicking outside or pressing Escape cancels it; if the user typed something, ask before discarding.
- Long operations show progress immediately (pressed state, spinner or progress bar) and prevent double submission.

## Lists, tables and filters

- Columns must fit the common desktop width without hiding actions; merge related columns (name + role + email in one cell), move rarely-needed data to the detail view, and use one overflow menu for row actions.
- Search is the first control; secondary filters collapse behind one button on phones and show how many are active. Tabs with counts for the main segments are better than a status dropdown.
- Empty list: say why it is empty and what to do next, with the action button. Empty search: suggest clearing filters.
- On phones, tables become cards: title + status + actions on the first line, details in two short columns.
- Paginate or limit long lists; keep filters in the URL.

## Forms

- Labels above fields, help text only when it prevents mistakes, required marks, sensible defaults (current user, current project, today).
- Selects with many options are searchable; 2–4 exclusive options read better as choice cards or segmented controls.
- Errors appear next to the field, in the product language, after submit and when correcting; the form keeps what the user typed.
- Inputs use the right type (email, tel, date, number) and are at least 16px on phones to avoid zoom.

## Feedback and states

Design each explicitly: empty, loading (skeleton or spinner where content will appear), error (what happened + what to do), no permission (hide the entry point; the URL returns 403/404), partial data, very long names, hundreds of items, slow network.

## Visual quality

- Same spacing scale, radius, shadows, typography and colours as the reference screens. Align to the grid; no stray margins.
- Truncate long text with an accessible full value (title or detail view) or wrap it with `overflow-wrap: anywhere` for URLs and IDs.
- Icons from the product's set, same size and stroke; never typed glyphs (×, ✓, @) as buttons.
- Status uses colour plus text, never colour alone.

## Mobile

- Nothing scrolls sideways at 375px; wide content scrolls inside its own container.
- Touch targets ≥ 40px; primary action reachable (bottom area or full-width button); header actions in one row (swipeable if needed).
- Dialogs become full-screen sheets; menus stay inside the viewport; content is not hidden behind fixed bars or the keyboard.
- Gestures where users expect them (swipe to reply, pull to refresh) only if the product already uses that idiom or it clearly helps; always keep a visible alternative.

## Language, direction and copy

- Write in the product's language and voice; use the exact terms the product already uses for the same things.
- Messages are specific: "Saved Ali's permissions", not "Operation completed successfully".
- RTL: logical properties (`margin-inline-start`, `inset-inline-end`), mirrored directional icons, numbers and codes isolated (`dir="ltr"` or `unicode-bidi: isolate`) where needed.
- No leftover framework defaults or English placeholders in a non-English UI.

## Accessibility

Semantic elements (`button`, `a`, `label`, headings in order), accessible names for icon buttons, visible focus, sufficient contrast, keyboard operation for dialogs and menus, `aria-live` for async results.

## Data and permissions as part of UX

- Users see only what they may use: navigation, switchers, dropdowns, counts, search, exports, notifications and API payloads are all filtered the same way.
- New restrictions must not lock existing users out on deploy: choose defaults that keep current behaviour until an admin configures the new setting, and make the unconfigured state visible to admins.
