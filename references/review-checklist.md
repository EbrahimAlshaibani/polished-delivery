# Self-review checklist

Answer every line. Fix each "no", or report clearly why it stays.

## Failure modes that get agent work rejected

Check your change for each one specifically.

1. **Parallel invention:** a new dialog, component, style, helper or permission check built beside an existing one that already does the job (for example a separate "@ mention" dialog when the input already has an inline suggestion list for another trigger).
2. **Foreign look:** invented colour variables or hard-coded values, inline styles, a different icon style, typed glyphs as buttons, spacing that does not match neighbouring screens.
3. **Raw framework output:** auto-rendered forms, default widgets, untranslated default messages or placeholders, debug-looking tables.
4. **Happy path only:** no empty, error, loading, permission or long-content states.
5. **Desktop only:** sideways scrolling, hidden or squeezed actions, tables that push columns off-screen, menus or popovers clipped inside scrolling containers, controls under fixed bars or the keyboard.
6. **Leaky data:** new lists, counts, dropdowns, switchers, search, exports, notifications or API payloads that ignore the permission/scope layer; IDs that can be guessed.
7. **Breaking existing users:** new restrictions or required fields with no default for existing records, so people lose access or forms fail after deploy.
8. **Half-wired concept:** a new field or entity added in one place but not in the filters, forms, detail pages, reports, API or mobile views where users will expect it.
9. **Inconsistent words:** new names for things the product already names; mixed languages; vague messages.
10. **Unproven claims:** "tested" without running tests, "works on mobile" without checking at phone width, verification in a background tab presented as complete.
11. **Messy diff:** unrelated refactors or formatting, files from another agent staged or reverted, debug code left in, secrets or local data committed.

## Checklist

**Fits the product**
- [ ] Structure, components and styling match the reference screens.
- [ ] Reused existing components, helpers, services and patterns; anything new lives in the shared place with consistent naming.
- [ ] Copy uses the product's language, voice and terminology; no leftover defaults.

**Works for every user**
- [ ] Main flow is short and obvious; success feedback and next step are clear.
- [ ] Empty, loading, error, no-permission, long-content and many-items states are handled.
- [ ] Phone width works: no sideways scroll, reachable actions, readable cards, usable dialogs.
- [ ] Keyboard, focus and screen-reader basics are in place.

**Correct and safe**
- [ ] Authorization and validation on the server through the project's permission layer.
- [ ] Every data surface (lists, counts, dropdowns, search, exports, notifications, APIs, assistant/automation tools) respects it.
- [ ] Existing data and users keep working after deploy; migrations follow project rules.
- [ ] No N+1 queries or unbounded lists; side effects (emails, notifications, audit) match similar features.

**Proven**
- [ ] New tests cover allowed, denied, empty and invalid cases; full suite result is known.
- [ ] Used the feature in a browser/device at desktop and phone sizes; console clean; layout audit clean or explained.
- [ ] Screenshots reviewed against the reference screens.
- [ ] Only my changes are in the diff; nothing committed, pushed or sent without being asked.
