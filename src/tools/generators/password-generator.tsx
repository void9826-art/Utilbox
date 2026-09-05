"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { randomChoice, randomInt, shuffle } from "@/lib/random";
import { cn, formatNumber } from "@/lib/utils";

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};

/** Characters that are easy to misread when a password is typed by hand. */
const AMBIGUOUS = new Set([..."0O1lI|`'\"{}[]()/\\"]);

/**
 * A short, deliberately ordinary word list. Real passphrase tools use the
 * ~7,776-word Diceware list; this trimmed set keeps the page light while still
 * giving roughly 10 bits of entropy per word.
 */
const WORDS =
  "able acid acorn actor adapt agent album alert alien alloy amber amuse angle ankle apple apron arbor arena argue arrow aspen atlas audio avoid awake bacon badge bagel baker balmy banjo barge basil basin batch beach beard beast bench berry birch bison blaze bloom blues bluff board bonus booth brave bread brick bring brisk broad brook broom brush bugle bunch burst cabin cable cacao camel candy canoe canvas cargo carol carve cedar chalk charm chase cheer chess chest chime choir chord cider cigar civic claim clamp clash clean clerk cliff climb cloak clock cloud clove coach coast cobra cocoa comet coral couch cough coupe court cover crane crate crawl cream creek crest crisp cross crowd crown crumb curve cycle daisy dance dandy dealt debut decal decoy delta dense depot depth diary digit ditch diver dodge donor doubt draft drain drape dream dress drift drill drink drive drove drums dryer eagle early earth easel eaten ebony eight elbow elder elite ember empty enact ennui entry equal equip erase essay ether evade event exact exile exist extra fable facet fairy faith false fancy fauna favor feast fence ferry fetch fever fiber field fiery fifty final finch first flair flame flash fleet flint float flock flood floor flour fluid flush focal focus foggy folio force forge forum found frame fresh frost fruit fudge fully fungi gauge gecko genre ghost giant glade glass gleam globe glove glyph grace grain grand grape graph grasp grass grave green grill grind groom grove guard guess guest guide guild gulch habit haiku happy harbor harsh haste hatch haven hazel heart heavy hedge helix hello hence herbs hinge hobby hoist honey honor horse hotel hound house hover human humid humor hurry hydro ideal image inbox index inlet input irony ivory jelly jewel joint joker jolly judge juice jumbo kayak kebab kernel kiosk kitty knack kneel knife knock koala label labor lager lance lapse large larva latch later laugh layer leaf lemon level lever light lilac linen liner lodge logic loose lotus lower loyal lucid lunar lunch lyric magic major mango maple march marsh match maybe mayor meadow medal melon mercy merge merit metal meter micro midst mimic miner minor mirth mixer model moist molar money month moral motor mound mount mouse mouth movie mural music nacho naval nerve never newer niche night noble noise north notch novel nudge nurse oasis occur ocean offer olive omega onion onset opera orbit orchid order organ otter ounce outer owner oxide ozone paint panel paper parka party pasta patch pause peace peach pearl pedal penny perch petal phase phone photo piano piece pilot pinch pitch pivot pixel pizza place plaid plain plane plank plant plate plaza plume point polar polka porch poser pouch pound power prairie press price pride prime print prism prize probe prone proof proud prove prune pulse punch pupil purse quail quake quart queen query quest quiet quill quilt quirk quota radar radio raise rally ranch range rapid raven reach ready realm rebel recap regal reign relax relay renew reply rhyme ridge rifle right rigid rinse ripen risky rival river roast robin robot rocky rogue roman rouge rough round route royal rugby ruler rumor rural saber salad salon salsa sandy satin sauce scale scarf scene scent scoop scope score scout scrap screw scrub sedan seize sense serve seven shade shaft shale shape share shark sharp sheep sheet shelf shell shift shine shirt shock shore short shrub siege sight sigma silky silver siren sixty skate skier skill skirt slate sleep slice slide slope small smart smile smoke snack snail snake sneak solar solid solve sonic sorry sound south space spade spare spark speak spear speed spell spend spice spike spine spiral spite splash spoke spoon sport spray sprig spurt squad stack staff stage stair stamp stand stark start state steam steel steep stern stick still sting stock stone stool store storm stout stove strap straw strip study stump style sugar suite sunny super surge swamp swarm sweet swept swift swing sword syrup table tacit talon tango tapir tarot taste teach tempo tenor tepid thank theme thick thing third thorn those three throw thumb tidal tiger tight timer tonic tooth topaz torch total touch tough tower toxic trace track trade trail train trait tramp trash treat trend triad tribe trick tried tromp trout truce truck trunk trust truth tulip tumble tunic turbo tutor twice twist ultra umber uncle under union unit unity until upper urban usage usher usual vague valid valor value valve vapor vault venue verge verse vibes video vigor villa vinyl viola viper virus visit vital vivid vocal vodka vogue voice vouch vowel wafer wagon waltz wander watch water waver weary weave wedge whale wharf wheat wheel where which while whirl whisk white whole widen widow width wield wince windy wiser witty woken woman world worth would wound woven wrist write wrong yacht yeast yield yodel young yours youth zebra zesty zonal"
    .split(" ");

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

function buildAlphabet(options: Options): string {
  let alphabet = "";
  if (options.lowercase) alphabet += SETS.lowercase;
  if (options.uppercase) alphabet += SETS.uppercase;
  if (options.numbers) alphabet += SETS.numbers;
  if (options.symbols) alphabet += SETS.symbols;

  if (options.excludeAmbiguous) {
    alphabet = [...alphabet].filter((character) => !AMBIGUOUS.has(character)).join("");
  }
  return alphabet;
}

/**
 * Generates a password that is guaranteed to include at least one character
 * from every selected set, then shuffles so the guaranteed characters are not
 * always at the front.
 */
function generatePassword(options: Options): string {
  const alphabet = buildAlphabet(options);
  if (!alphabet) return "";

  const required: string[] = [];
  const filter = (set: string) =>
    options.excludeAmbiguous ? [...set].filter((c) => !AMBIGUOUS.has(c)).join("") : set;

  if (options.lowercase) required.push(randomChoice([...filter(SETS.lowercase)]));
  if (options.uppercase) required.push(randomChoice([...filter(SETS.uppercase)]));
  if (options.numbers) required.push(randomChoice([...filter(SETS.numbers)]));
  if (options.symbols) required.push(randomChoice([...filter(SETS.symbols)]));

  const remaining = Math.max(0, options.length - required.length);
  const rest = Array.from({ length: remaining }, () => alphabet[randomInt(alphabet.length)]);

  return shuffle([...required, ...rest]).slice(0, options.length).join("");
}

function generatePassphrase(wordCount: number, separator: string, capitalise: boolean, addNumber: boolean): string {
  const words = Array.from({ length: wordCount }, () => {
    const word = randomChoice(WORDS);
    return capitalise ? word[0].toUpperCase() + word.slice(1) : word;
  });
  if (addNumber) words.push(String(randomInt(100)).padStart(2, "0"));
  return words.join(separator);
}

/** Entropy in bits: log2 of the number of equally likely possibilities. */
function passwordEntropy(length: number, alphabetSize: number): number {
  if (alphabetSize <= 1 || length <= 0) return 0;
  return length * Math.log2(alphabetSize);
}

function passphraseEntropy(wordCount: number, addNumber: boolean): number {
  return wordCount * Math.log2(WORDS.length) + (addNumber ? Math.log2(100) : 0);
}

function strengthFor(bits: number) {
  if (bits < 40) return { label: "Weak", tone: "bg-border-strong", advice: "Crackable by a determined attacker." };
  if (bits < 60) return { label: "Fair", tone: "bg-fg-subtle", advice: "Acceptable for low-value accounts only." };
  if (bits < 80) return { label: "Strong", tone: "bg-fg-muted", advice: "Beyond practical brute-force attack." };
  return { label: "Very strong", tone: "bg-fg", advice: "Far beyond any realistic brute-force attack." };
}

export default function PasswordGenerator() {
  const [mode, setMode] = React.useState<"password" | "passphrase">("password");
  const [options, setOptions] = React.useState<Options>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [wordCount, setWordCount] = React.useState(4);
  const [separator, setSeparator] = React.useState("-");
  const [capitalise, setCapitalise] = React.useState(true);
  const [addNumber, setAddNumber] = React.useState(true);
  const [batchSize, setBatchSize] = React.useState(1);
  const [results, setResults] = React.useState<string[]>([]);

  const noSetSelected =
    !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;

  const generate = React.useCallback(() => {
    if (mode === "password" && noSetSelected) {
      setResults([]);
      return;
    }
    setResults(
      Array.from({ length: batchSize }, () =>
        mode === "password"
          ? generatePassword(options)
          : generatePassphrase(wordCount, separator, capitalise, addNumber),
      ),
    );
  }, [addNumber, batchSize, capitalise, mode, noSetSelected, options, separator, wordCount]);

  // Generated after mount, never during render: a random value produced while
  // rendering would differ between the server HTML and the client hydration.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a password generated during render would differ between the server HTML and the client
    generate();
  }, [generate]);

  const bits =
    mode === "password"
      ? passwordEntropy(options.length, buildAlphabet(options).length)
      : passphraseEntropy(wordCount, addNumber);
  const strength = strengthFor(bits);
  const alphabetSize = buildAlphabet(options).length;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="password-mode"
          ariaLabel="Password type"
          value={mode}
          onChange={setMode}
          options={[
            { value: "password", label: "Random password" },
            { value: "passphrase", label: "Word passphrase" },
          ]}
          className="sm:max-w-md"
        />

        {/* Results first: this is the thing people came for. */}
        <div className="space-y-2">
          {results.length === 0 ? (
            <div className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-border px-4 text-center text-sm text-fg-muted">
              {noSetSelected
                ? "Choose at least one character type below."
                : "Generating…"}
            </div>
          ) : (
            <ul className="space-y-2">
              {results.map((password, index) => (
                <li
                  key={`${index}-${password}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-sunken p-2.5"
                >
                  <code className="min-w-0 flex-1 font-mono text-[0.9375rem] break-all text-fg select-all">
                    {password}
                  </code>
                  <CopyButton value={password} iconOnly variant="ghost" />
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={generate} disabled={mode === "password" && noSetSelected}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Generate {batchSize > 1 ? `${batchSize} new` : "a new one"}
            </Button>
            {results.length > 1 ? <CopyButton value={results.join("\n")} label="Copy all" /> : null}
          </div>
        </div>

        {/* Strength */}
        <div className="space-y-2 rounded-lg border border-border p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.8125rem] font-medium text-fg">Strength</span>
            <span className="tabular text-[0.8125rem] text-fg-muted">
              {bits.toFixed(0)} bits of entropy
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className={cn("h-full rounded-full transition-[width] duration-200", strength.tone)}
              style={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-fg-muted" aria-live="polite">
            <strong className="font-semibold text-fg">{strength.label}.</strong> {strength.advice}
            {mode === "password" && alphabetSize > 0
              ? ` Drawn from ${alphabetSize} possible characters.`
              : ` Drawn from a ${formatNumber(WORDS.length)}-word list.`}
          </p>
        </div>

        {/* Settings */}
        {mode === "password" ? (
          <div className="space-y-4">
            <Slider
              label="Length"
              valueLabel={`${options.length} characters`}
              min={4}
              max={128}
              value={options.length}
              onChange={(event) =>
                setOptions((previous) => ({ ...previous, length: Number(event.target.value) }))
              }
            />

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Checkbox
                label="Lowercase letters"
                description="a–z"
                checked={options.lowercase}
                onChange={(event) =>
                  setOptions((previous) => ({ ...previous, lowercase: event.target.checked }))
                }
              />
              <Checkbox
                label="Uppercase letters"
                description="A–Z"
                checked={options.uppercase}
                onChange={(event) =>
                  setOptions((previous) => ({ ...previous, uppercase: event.target.checked }))
                }
              />
              <Checkbox
                label="Numbers"
                description="0–9"
                checked={options.numbers}
                onChange={(event) =>
                  setOptions((previous) => ({ ...previous, numbers: event.target.checked }))
                }
              />
              <Checkbox
                label="Symbols"
                description="!@#$%^&* and similar"
                checked={options.symbols}
                onChange={(event) =>
                  setOptions((previous) => ({ ...previous, symbols: event.target.checked }))
                }
              />
              <Checkbox
                label="Exclude look-alike characters"
                description="Skips 0 O 1 l I and similar pairs"
                checked={options.excludeAmbiguous}
                onChange={(event) =>
                  setOptions((previous) => ({ ...previous, excludeAmbiguous: event.target.checked }))
                }
              />
            </div>

            {noSetSelected ? (
              <Alert tone="warning" title="No character types selected">
                Choose at least one of the options above.
              </Alert>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <Slider
              label="Number of words"
              valueLabel={`${wordCount} words`}
              min={3}
              max={10}
              value={wordCount}
              onChange={(event) => setWordCount(Number(event.target.value))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Separator</span>
                <Segmented
                  name="passphrase-separator"
                  ariaLabel="Word separator"
                  value={separator}
                  onChange={setSeparator}
                  options={[
                    { value: "-", label: "Hyphen" },
                    { value: ".", label: "Dot" },
                    { value: "_", label: "Underscore" },
                    { value: " ", label: "Space" },
                  ]}
                />
              </div>
              <div className="space-y-2.5 pt-1">
                <Checkbox
                  label="Capitalise each word"
                  checked={capitalise}
                  onChange={(event) => setCapitalise(event.target.checked)}
                />
                <Checkbox
                  label="Append a two-digit number"
                  description="Satisfies rules that demand a digit"
                  checked={addNumber}
                  onChange={(event) => setAddNumber(event.target.checked)}
                />
              </div>
            </div>
          </div>
        )}

        <Slider
          label="How many to generate"
          valueLabel={String(batchSize)}
          min={1}
          max={20}
          value={batchSize}
          onChange={(event) => setBatchSize(Number(event.target.value))}
        />

        <Alert tone="info" title="Nothing here leaves your browser">
          Passwords are generated on your device with your browser&apos;s cryptographic random number
          generator, and are never transmitted or stored. For accounts that matter, a dedicated password
          manager is still the better tool — it also handles storing them safely.
        </Alert>
      </div>
    </ToolFrame>
  );
}
