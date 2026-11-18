---
name: polished-delivery
description: Deliver finished, production-quality changes in an existing codebase, especially user-facing features, screens, forms and flows. Learns and reuses the project's own design system, components, permission rules and conventions, designs every state, verifies in a real browser or device at desktop and phone sizes, runs the tests, and self-reviews before reporting. Use when building or changing anything a user will see or rely on; not for quick questions, throwaway scripts or pure research.
---

# Polished delivery

The person who asked will judge the work by using it: on their laptop, on their phone, as a regular user and as an admin. Work that runs but looks foreign to the product, ignores existing components, handles only the happy path, breaks on a small screen, or leaks data is not done, and they will have to send it back.

**The bar: someone who knows the product cannot tell your change apart from its best existing screens, and nothing they try in the first five minutes breaks it.**

Most rejected work fails the same way: the agent builds something new beside the project instead of finding what the project already has and extending it. Spend the first part of every task learning the project.

## 1. Understand the request

- Restate to yourself the user's goal, who uses the result, and what "done" looks like for them. Read their wording carefully; the literal ask is usually the minimum.
- Note what they did not say but obviously expect: it works on their phone if the product is used on phones; it respects who may see what; it matches the rest of the product; existing data keeps working.
- Ask one short question only when the answer changes what you build. Otherwise choose what matches the existing product and say so in the report.
- Keep scope: do what was asked, completely. Do not refactor or restyle unrelated areas. Mention worthwhile follow-ups instead of doing them.

## 2. Learn the project before designing

Do this every time, even for small changes. Details by stack, and where things usually live: [references/recon.md](references/recon.md).

1. Read the project's own instructions: `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING`, `README`, design docs. Project rules override this skill. If a project-specific skill exists (for example `<project>-polish`), apply it on top of this one.
2. `git status` and recent `git log`: someone else (a person or another agent) may be editing the same tree. Never revert, reformat or stage changes you did not make.
3. Map the essentials and keep a short note of them:
   - **Design system:** tokens/theme (colours, spacing, radius, type), shared components or partials, icon set, layout primitives, existing utility classes, how forms, tables, dialogs, menus, toasts and empty states are built.
   - **Reference implementations:** the 2–3 existing features closest to yours. Open them in the running app and in code. Your feature should look and be structured like them.
   - **Interaction patterns:** how the product does creation (page vs dialog), confirmation, filtering, pagination, inline suggestions, uploads, notifications, mobile navigation.
   - **Data access and permissions:** the single place that decides who can see or change what (policies, scopes, managers, helper functions). Find it; do not re-derive rules in your code.
   - **Business logic location:** services, actions, use-cases, model methods, background jobs, audit logging.
   - **Language and copy:** UI language(s), direction (RTL/LTR), tone, terminology already used for the same concepts, i18n mechanism.
   - **How to run, seed, log in and test** locally.
4. If two existing patterns conflict, follow the newer or more widely used one and keep consistency within your feature.

## 3. Design before coding

Decide these explicitly; [references/ux-standard.md](references/ux-standard.md) has the concrete standard.

- **Entry and flow:** where the user starts, the fewest steps to finish, where they land after, how they undo or cancel.
- **States:** empty, loading, success feedback, validation errors, server failure, no permission, long text, many items, slow network, offline if the product is a PWA or mobile app.
- **Layouts:** desktop and phone (about 375px wide), plus tablet if the product targets it. Decide what collapses, what scrolls inside its own container, where actions go on a small screen.
- **Data and rules:** who can see it, who can change it, what is validated on the server, what is logged or notified, how existing records and deploys keep working (defaults, backfills, backward-compatible migrations).
- **Copy:** exact labels, help text, messages and empty-state sentences in the product's language and terminology.

## 4. Build

- **Reuse first, extend second, create last.** Use existing components, tokens, helpers, services and patterns. When something new is unavoidable, build it in the project's shared place (stylesheet, component library, service module) following its naming, so the next feature can reuse it.
- **No foreign visual language:** no hard-coded colours or sizes when tokens exist, no invented variables, no inline styles or one-off CSS, no new icon style, no raw framework widgets or untranslated default text left on screen.
- **Correct by construction:** authorization and validation on the server through the project's permission layer; every list, count, dropdown, search result, export and API payload starts from the user's visible data; no N+1 queries; bounded lists.
- **Accessible and responsive:** semantic elements, labels, focus states, logical (RTL-safe) properties, touch targets ≥ 40px, nothing wider than the viewport.
- **Keep the diff focused and in the codebase's style:** same naming, comment language, file organisation and test style as neighbouring code.

## 5. Verify like the user, then like a reviewer

Procedures, scripts and what counts as evidence: [references/verify.md](references/verify.md).

1. Write or update tests for the new behaviour, including denied users, empty data and invalid input. Run the affected tests while working and the full suite before handing off. Report the real result.
2. Run the app and use the feature through the real UI at desktop width and at phone width: the main flow, invalid input, empty state, a user without permission. Check the console and server log for errors.
3. Run `scripts/layout_audit.js` in the page (horizontal overflow, clipped or covered controls, small tap targets, unlabeled controls, broken images) at both widths and fix what it finds.
4. Take screenshots and compare them critically with the reference screens. Alignment, spacing, hierarchy, truncation and wording must match their quality.
5. If you cannot run something (no browser, no device, missing credentials), say exactly what was not verified. Never imply verification you did not do.

## 6. Self-review, then report

Go through [references/review-checklist.md](references/review-checklist.md) and fix every "no". It lists the failure modes that most often get agent work rejected.

Report in the user's language and terms: what they can do now and where to find it, what you verified and how (widths, roles, test counts), what is not done or not verified, and any decision you made for them. Keep internal details out unless they matter to the user. Commit, push, deploy or message anyone only when the user asked for it in the current request.
