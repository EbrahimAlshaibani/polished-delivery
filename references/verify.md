# Verification

Evidence types are different; report each separately: tests passed, page renders, flow completed in the UI, checked at phone width, checked as a restricted user, checked on a real device.

## Tests

- Find the real command in CI config or project docs. Run the affected tests while iterating and the full suite before handing off; quote the final count and status.
- Cover: allowed and denied users (including a user from another team/project/tenant), empty data, invalid input, the API/JSON shape the UI depends on, and a regression test for the bug you fixed.
- A test that only proves a mock was called does not prove behaviour.

## Running the app

- Start the dev server the project way (scripts, launch config, Makefile). Use seed data or create minimal local fixtures; never point local testing at production data or send real messages, payments or notifications.
- Log in as different roles. If logging in through the UI needs credentials you do not have, prefer a supported dev mechanism (fixtures, a management command or shell session creation) over guessing passwords.

## Browser checks

At about 1280×800 and 375×812 (and the product's other target sizes):

1. Complete the main flow through the real UI and confirm the result persisted (reload).
2. Submit invalid data; trigger the empty state; try very long text.
3. Open every menu, dialog and dropdown you touched; confirm they are fully visible and usable.
4. Read the console and server log; fix errors and warnings you introduced.
5. Run `scripts/layout_audit.js` in the page console (or pass its contents to your browser tool's evaluate function; the last expression returns the report). It returns JSON with `overflow`, `clipped`, `underFixedBars`, `smallTargets`, `unnamedControls`, `brokenImages` and `nativeDefaults` (leftover framework defaults such as "Select an option", or "undefined"). Fix every `overflow`, `clipped`, `unnamedControls`, `brokenImages` and `nativeDefaults` entry you introduced. `underFixedBars` is informational: the control sits under a fixed header or tab bar right now; confirm scrolling reveals it. `overflow` is checked even when the page hides sideways scrolling at the root, because hidden overflow still cuts content off. Open menus and dialogs before running it to check them too.
6. Screenshot both widths and compare with the reference screens before reporting.

If the browser tab is in the background, animations, transitions, scroll events and clipboard access may not run; re-check those in a visible window or say they were not verified.

## Mobile apps

Use the emulator or device the project uses; install the exact build; walk the flow with the relevant roles; check keyboard overlap, safe areas, rotation if supported, slow network.

## When something cannot be verified

State precisely what was not run and why (no browser, missing credentials, external service), and what the user should check. Do not convert "should work" into "works".
