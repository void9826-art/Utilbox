/**
 * Dumps the interactive shape of whatever tool page is loaded: every control
 * with an id, every button label, every segmented option, and the result text.
 * Used to write assertions against the real markup rather than guessing at it.
 */
(async () => {
  await new Promise((r) => setTimeout(r, 2500));
  const main = document.getElementById("main");
  const scope = main ?? document.body;

  const fields = [...scope.querySelectorAll("input, select, textarea")]
    .filter((el) => el.type !== "hidden")
    .map((el) => {
      const base = `${el.tagName.toLowerCase()}[${el.type ?? ""}]#${el.id || "-"}`;
      if (el.tagName === "SELECT") {
        return `${base}=${el.value} {${[...el.options].map((o) => o.value).join(",")}}`;
      }
      return `${base}=${JSON.stringify(String(el.value).slice(0, 24))}`;
    });

  const buttons = [...scope.querySelectorAll("button")]
    .filter((b) => b.offsetParent !== null)
    .map((b) => (b.textContent.trim() || b.getAttribute("aria-label") || "?").slice(0, 30));

  const labels = [...scope.querySelectorAll("label")]
    .map((l) => l.textContent.trim().slice(0, 34))
    .filter(Boolean);

  return {
    path: location.pathname,
    fields,
    buttons: [...new Set(buttons)],
    labels: [...new Set(labels)],
    result: scope.innerText.replace(/\s+/g, " ").slice(0, 700),
  };
})();
