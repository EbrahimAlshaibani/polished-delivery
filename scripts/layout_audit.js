/*
 * layout_audit.js — paste into the browser console, or pass the file's contents to your browser
 * tool's "evaluate" function. Run it at desktop width and at phone width (about 375px).
 * Returns a JSON-serializable report; every non-empty list needs a look.
 *
 *   overflow        elements that stick out of the viewport sideways (page would scroll horizontally)
 *   clipped         visible controls whose centre is covered or cut off by another element/container
 *   underFixedBars  controls currently under a fixed header/tab bar (fine if scrolling reveals them)
 *   smallTargets    controls smaller than 36px in either dimension (only reported at widths <= 768px)
 *   unnamedControls buttons/links/inputs without an accessible name
 *   brokenImages    images that failed to load
 *   nativeDefaults  leftover framework/debug text ("Select an option", "[object Object]", "undefined"...)
 */
(() => {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const mobile = viewportWidth <= 768;
  const MAX = 15;

  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim()
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    const text = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || "")
      .replace(/\s+/g, " ").trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
  };
  const isShown = (el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  // Off-canvas drawers and other fixed layers never make the page scroll; skip their contents.
  const inFixedLayer = (el) => {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      if (getComputedStyle(node).position === "fixed") return true;
    }
    return false;
  };
  const scrollsOrClipsX = (el) => /(auto|scroll|hidden|clip)/.test(getComputedStyle(el).overflowX);
  const insideScroller = (el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      if (scrollsOrClipsX(node) && node.scrollWidth > node.clientWidth + 1) return true;
    }
    return false;
  };

  // 1. Horizontal overflow (report outermost offenders only).
  // Checked even when the root clips overflow (overflow-x: hidden/clip hides the symptom, not the cause).
  const overflow = [];
  const offenders = [...document.body.querySelectorAll("*")].filter((el) => {
    if (!isShown(el) || inFixedLayer(el)) return false;
    const rect = el.getBoundingClientRect();
    return (rect.right > viewportWidth + 1 || rect.left < -1) && !insideScroller(el);
  });
  offenders
    .filter((el) => !offenders.some((other) => other !== el && other.contains(el)))
    .slice(0, MAX)
    .forEach((el) => {
      const rect = el.getBoundingClientRect();
      overflow.push({ element: describe(el), left: Math.round(rect.left), right: Math.round(rect.right) });
    });

  const controls = [...document.querySelectorAll(
    "a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=menuitem], [tabindex]:not([tabindex='-1'])"
  )].filter(isShown);

  // 2. Clipped or covered controls (only those inside the current viewport). A control hidden only by a
  //    fixed header/tab bar at the viewport edge goes to underFixedBars: fine if scrolling reveals it and
  //    the page has enough bottom/top padding to reach it.
  const clipped = [];
  const underFixedBars = [];
  controls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > viewportWidth) return;
    const x = Math.min(Math.max(rect.left + rect.width / 2, 0), viewportWidth - 1);
    const y = Math.min(Math.max(rect.top + rect.height / 2, 0), viewportHeight - 1);
    const hit = document.elementFromPoint(x, y);
    const label = el.labels && el.labels[0];
    // An ancestor under the centre means the control is cut off by that container (e.g. a menu inside a
    // scrolling table), so only the control itself, its children or its label count as visible.
    const ok = hit && (hit === el || el.contains(hit) || (label && (label === hit || label.contains(hit))));
    if (ok) return;
    const entry = { element: describe(el), coveredBy: hit ? describe(hit) : "outside viewport" };
    if (hit && inFixedLayer(hit) && !inFixedLayer(el)) {
      if (underFixedBars.length < MAX) underFixedBars.push(entry);
    } else if (clipped.length < MAX) {
      clipped.push(entry);
    }
  });

  // 3. Small touch targets on phone widths.
  const smallTargets = [];
  if (mobile) {
    controls.forEach((el) => {
      // Checkboxes/radios are usually enlarged by their label; links inside running text are exempt.
      const inlineTextLink = el.tagName === "A" && el.closest("p, li") && !el.closest("nav");
      if (el.matches("input[type=checkbox], input[type=radio]") || inlineTextLink) return;
      const rect = el.getBoundingClientRect();
      if ((rect.width < 36 || rect.height < 36) && smallTargets.length < MAX) {
        smallTargets.push({ element: describe(el), size: `${Math.round(rect.width)}x${Math.round(rect.height)}` });
      }
    });
  }

  // 4. Controls without an accessible name.
  const unnamedControls = [];
  const nameOf = (el) => {
    const aria = el.getAttribute("aria-label") || "";
    const labelledby = (el.getAttribute("aria-labelledby") || "").split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent || "").join(" ");
    const labels = el.labels ? [...el.labels].map((l) => l.textContent).join(" ") : "";
    const imgAlt = [...el.querySelectorAll("img[alt]")].map((img) => img.alt).join(" ");
    const own = ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) ? "" : el.textContent;
    return [aria, labelledby, labels, imgAlt, own, el.getAttribute("title") || ""].join(" ").trim();
  };
  controls.forEach((el) => {
    if (el.matches("input[type=submit], input[type=button]") && el.value) return;
    if (!nameOf(el) && unnamedControls.length < MAX) unnamedControls.push(describe(el));
  });

  // 5. Broken images.
  // A failed image with empty alt collapses to 0x0, so check display/visibility rather than size.
  const brokenImages = [...document.images]
    .filter((img) => {
      const style = getComputedStyle(img);
      return style.display !== "none" && style.visibility !== "hidden" && img.complete && img.naturalWidth === 0 && img.getAttribute("src");
    })
    .slice(0, MAX)
    .map((img) => img.currentSrc || img.src);

  // 6. Leftover defaults and debug text in visible content.
  const DEFAULTS = /Select an option|This field is required\.?|-{6,}|\[object Object\]|\bundefined\b|\bNaN\b|Lorem ipsum|\bTODO\b|\bFIXME\b/;
  const nativeDefaults = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode() && nativeDefaults.length < MAX) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, noscript, template, code, pre, textarea") || !isShown(parent)) continue;
    const match = node.textContent.match(DEFAULTS);
    if (match) nativeDefaults.push({ text: match[0], in: describe(parent) });
  }
  document.querySelectorAll("select option").forEach((option) => {
    if (DEFAULTS.test(option.textContent) && nativeDefaults.length < MAX) {
      nativeDefaults.push({ text: option.textContent.trim(), in: describe(option.parentElement) });
    }
  });

  return {
    viewport: `${viewportWidth}x${viewportHeight}`,
    pageScrollsSideways: document.documentElement.scrollWidth > viewportWidth + 1,
    overflow,
    clipped,
    underFixedBars,
    smallTargets,
    unnamedControls,
    brokenImages,
    nativeDefaults,
  };
})();
