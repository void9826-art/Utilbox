# Runs scripts/smoke.js against every tool page it knows how to drive, in real
# Chrome, and prints a pass/fail line for each assertion.
#
# The embedded preview pane does not composite reliably, so this drives the
# machine's own Chrome through .claude/cdp.ps1 instead.
param([string]$Base = "http://127.0.0.1:3000")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

# The PDF tools need real files. They are injected as a global before the page
# script runs: `next start` only scans public/ at boot, and shipping test data
# in public/ would put it on the live site.
$fixturePath = Join-Path $PSScriptRoot ".out\pdf-fixtures.json"
if (-not (Test-Path $fixturePath)) {
  Write-Host "Generating fixtures..." -ForegroundColor Yellow
  & node (Join-Path $PSScriptRoot "make-fixtures.mjs") | Out-Null
}
$fixtureJson = Get-Content -Raw $fixturePath
$jsBefore = "window.__fixtures = $fixtureJson;"

$pages = @(
  "/calculators/percentage-calculator",
  "/calculators/bmi-calculator",
  "/calculators/attendance-calculator",
  "/calculators/tax-calculator",
  "/calculators/scientific-calculator",
  "/converters/temperature-converter",
  "/converters/length-converter",
  "/text/word-counter",
  "/text/case-converter",
  "/text/sort-lines",
  "/developer/base64-encoder",
  "/developer/url-encoder",
  "/developer/timestamp-converter",
  "/generators/password-generator",
  "/generators/uuid-generator",
  "/generators/qr-code-generator",
  "/pdf/merge-pdf",
  "/pdf/pdf-to-text",
  "/pdf/pdf-to-excel",
  "/image/compress-image"
)

$total = 0
$failed = 0

foreach ($page in $pages) {
  $out = & $cdp -Url "$Base$page" -Wait 3500 -JsBefore $jsBefore -Settle 400 -Js $js 2>&1 | Out-String

  # A page with a single assertion prints one object, because PowerShell
  # unwraps a one-element array on its way out.
  $line = ($out -split "`n" | Where-Object { $_ -match '^[\[{]' } | Select-Object -First 1)

  if (-not $line) {
    $why = ($out -split "`n" | Where-Object { $_ -match 'THREW|Error' } | Select-Object -First 1)
    Write-Host ("NO RESULT  $page  " + $why) -ForegroundColor Red
    $failed += 1
    continue
  }

  # ConvertFrom-Json hands a JSON array down the pipeline as one object, so
  # wrapping it in @() would produce an array containing an array - and the
  # per-check loop would then run once over the whole set, hiding failures.
  $parsed = $line | ConvertFrom-Json
  $checks = if ($parsed -is [System.Array]) { $parsed } else { @($parsed) }

  foreach ($c in $checks) {
    $total += 1
    if ($c.pass) {
      Write-Host ("  ok    " + $c.name)
    } else {
      $failed += 1
      Write-Host ("  FAIL  " + $c.name + "  -> " + $c.detail) -ForegroundColor Red
    }
  }
}

Write-Host ""
if ($failed -eq 0) {
  Write-Host "ALL $total INTERACTION CHECKS PASSED" -ForegroundColor Green
} else {
  Write-Host "$failed of $total CHECKS FAILED" -ForegroundColor Red
  exit 1
}
