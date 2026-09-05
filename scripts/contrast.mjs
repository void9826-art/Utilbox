/**
 * Contrast check for the monochrome palette.
 *
 * The brand palette is four colours — #FFFFFF, #E0E0E0, #616161, #212121.
 * A usable interface needs a few more steps than that, so the scale below is
 * anchored on those four and fills in only the tints required to keep every
 * text pairing at WCAG AA. This script proves each pairing before it ships.
 */

const hex = (value) => {
  const n = value.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};

const luminance = ([r, g, b]) => {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const ratio = (a, b) => {
  const l1 = luminance(hex(a));
  const l2 = luminance(hex(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const themes = {
  light: {
    backgrounds: {
      bg: "#ffffff",
      "bg-muted": "#f5f5f5",
      surface: "#ffffff",
      "surface-sunken": "#f2f2f2",
      "accent-soft": "#ededed",
    },
    foregrounds: {
      fg: "#212121",
      "fg-muted": "#4a4a4a",
      "fg-subtle": "#616161",
      "accent-text": "#212121",
    },
    onAccent: { accent: "#212121", "accent-fg": "#ffffff" },
  },
  dark: {
    backgrounds: {
      bg: "#171717",
      "bg-muted": "#1c1c1c",
      surface: "#212121",
      "surface-sunken": "#191919",
      "accent-soft": "#2b2b2b",
    },
    foregrounds: {
      fg: "#f0f0f0",
      "fg-muted": "#c2c2c2",
      "fg-subtle": "#9e9e9e",
      "accent-text": "#f0f0f0",
    },
    onAccent: { accent: "#f0f0f0", "accent-fg": "#212121" },
  },
};

let failures = 0;
const AA_SMALL = 4.5;

for (const [themeName, theme] of Object.entries(themes)) {
  console.log(`\n${themeName}`);

  for (const [fgName, fg] of Object.entries(theme.foregrounds)) {
    const results = Object.entries(theme.backgrounds).map(([bgName, bg]) => ({
      bgName,
      value: ratio(fg, bg),
    }));
    const worst = results.reduce((a, b) => (a.value < b.value ? a : b));
    const ok = worst.value >= AA_SMALL;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${fgName.padEnd(11)} worst ${worst.value.toFixed(2)}:1 on ${worst.bgName}`,
    );
  }

  const onAccent = ratio(theme.onAccent["accent-fg"], theme.onAccent.accent);
  const okAccent = onAccent >= AA_SMALL;
  if (!okAccent) failures += 1;
  console.log(
    `  ${okAccent ? "ok  " : "FAIL"} ${"accent-fg".padEnd(11)} ${onAccent.toFixed(2)}:1 on accent`,
  );

  // Borders are not text, but they must be perceivable against their surface.
  const borders =
    themeName === "light"
      ? { border: "#e0e0e0", "border-strong": "#8f8f8f" }
      : { border: "#363636", "border-strong": "#6d6d6d" };
  for (const [name, colour] of Object.entries(borders)) {
    const value = ratio(colour, theme.backgrounds.surface);
    // A divider only has to be visible; the boundary of a form control has to
    // meet 3:1 under WCAG 1.4.11, because it is what identifies the control.
    const target = name === "border-strong" ? 3 : 1.3;
    const ok = value >= target;
    if (!ok) failures += 1;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${name.padEnd(11)} ${value.toFixed(2)}:1 on surface (needs ${target})`);
  }
}

console.log(
  failures === 0
    ? "\nEVERY TOKEN PAIRING MEETS ITS TARGET"
    : `\n${failures} PAIRING(S) BELOW TARGET`,
);
process.exitCode = failures > 0 ? 1 : 0;
