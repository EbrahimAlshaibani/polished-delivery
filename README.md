# Polished Delivery

Polished Delivery is a Codex skill for building and fixing features in an existing product. It guides Codex to find the closest working screen, reuse its components and permission rules, and test the change the way someone will actually use it.

## Install

With Git installed, run this command in PowerShell, Terminal on macOS, or a Linux shell. It makes the skill available across your local Codex projects.

```sh
git clone https://github.com/EbrahimAlshaibani/polished-delivery.git "$HOME/.agents/skills/polished-delivery"
```

In the Codex CLI or IDE extension, type `$` and look for **Polished Delivery**. If it doesn't appear, restart Codex and check again. [Codex skill discovery](https://developers.openai.com/codex/skills/)

## Use it

Open the project you want to change in Codex. Mention `$polished-delivery` in your request and describe what the user should be able to do. If there's an existing screen it should resemble, name that too.

**Add a feature**

> Use $polished-delivery to add a status filter to the orders list. Follow the invoices list's filter pattern. Keep the selection when I open an order and come back.

**Fix a broken flow**

> Use $polished-delivery to fix the Save button on the profile form. At phone width the sticky footer covers it. Check that I can reach Save, see a validation error, and submit the corrected form.

## What to expect

1. **Before editing**, Codex reads the project instructions and traces a similar feature to find the shared UI, data access rules, and tests it can reuse.
2. **During implementation**, it accounts for loading, empty results, invalid input, and restricted users. It follows the product's existing language and layout conventions.
3. **During verification**, it runs the project's tests and exercises the flow on desktop and phone layouts. The included browser script flags issues such as clipped controls, horizontal overflow, and missing accessible names. [Layout audit script](scripts/layout_audit.js)
4. **At handoff**, it reports which flows, roles, and viewport sizes it checked, the test results, and any checks the environment prevented. [Verification guide](references/verify.md)

The full workflow lives in [SKILL.md](SKILL.md).
