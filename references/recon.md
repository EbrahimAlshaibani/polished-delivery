# Learning a project quickly

Goal: in a few minutes, know what to reuse and which rules to obey. Prefer reading real files and the running app over guessing from names.

## Fast searches (adapt to the repo)

- Instructions: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `CONTRIBUTING*`, `docs/`, `README*`.
- Tokens and theme: search for `:root`, `--color`, `--brand`, `theme`, `tokens`, `tailwind.config`, `ThemeData`, `colors.ts`, `variables.scss`.
- Shared UI: `components/`, `ui/`, `shared/`, `partials/`, `templates/components`, `templatetags`, `widgets/`, Storybook stories.
- Icons: an SVG sprite, an icon component, a font, or a package (lucide, heroicons, material). Use the same set and size scale.
- Permissions: search for `permission`, `policy`, `can_`, `authorize`, `scope`, `visible_`, `for_user`, `abilities`, `guard`, `RLS`, middleware and decorators on similar views.
- Business logic: `services/`, `actions/`, `use_cases/`, `domain/`, model methods, signals/observers, jobs, `audit`.
- i18n: `locale/`, `i18n/`, `lang/`, `.po`, `messages`, `t(` / `gettext` / `__(` usage; check `dir="rtl"`.
- Tests: `tests/`, `test_*.py`, `*.spec.*`, `*_test.go`, CI workflow files (they show the real test command).
- Run/seed: `package.json` scripts, `Makefile`, `manage.py`, `docker-compose`, `.env.example`, launch configs, seed/fixture commands.

## Where things usually live

| Stack | Look at |
|---|---|
| Django | `templates/` base and components, `templatetags/` (form field helpers), `forms.py` base form classes, mixins for permissions/modals, `services.py`, `static/` main stylesheet and JS entry, `context_processors.py` (navigation), `tests*.py` |
| Rails | `app/views/layouts`, `app/views/shared`, ViewComponents, helpers, Pundit/CanCan policies, `app/javascript` (Stimulus/Turbo), `config/locales` |
| Laravel | `resources/views/layouts` and `components`, Blade components, Policies/Gates, Form Requests, `lang/`, Livewire/Inertia pages |
| React / Next.js | `components/ui`, design-system package, theme provider, data hooks, route guards, API handlers' auth checks, `app/` or `pages/` layout files |
| Vue / Nuxt | `components/`, composables, Pinia stores, layout files, plugin registrations, middleware |
| Flutter / mobile | theme (`ThemeData`, `AppColors`), shared widgets, router guards, API client and models, l10n (`.arb`), platform-specific settings |
| API only | serializers/DTOs, auth middleware, existing endpoints' error format, pagination format, versioning |

## Reference implementations

Pick the existing features closest to yours in shape (list + filters, detail page, multi-step form, dashboard, chat input, upload…). For each, note: page structure, components used, how errors and empty states look, how permissions are applied, how it behaves on a phone, how it is tested. Build yours the same way unless it is visibly worse than the newest screens.

## Signals of how the team works

- Recent commits show message style, test habits and which areas were recently redesigned (use the newest pattern).
- Lint/format configs: run the project's formatter on your files only.
- Ignored files (`.gitignore`) can be intentional (for example generated migrations); follow project rules rather than "fixing" them.
