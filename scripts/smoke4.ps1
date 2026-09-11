# Interaction suite for the tools added in September 2026. See scripts/smoke4.js.
# Voice to text gets two evaluations with a long settle between them, because
# the first model download can outlast a single evaluate budget.
param([string]$Base = "http://127.0.0.1:3000", [string]$Only = "")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke4.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

$pages = @(
  "/image/heic-to-jpg",
  "/image/webp-to-png",
  "/image/image-color-palette",
  "/image/exif-remover",
  "/image/favicon-generator",
  "/pdf/pdf-add-page-numbers",
  "/pdf/pdf-table-to-excel",
  "/pdf/pdf-metadata-editor",
  "/pdf/pdf-resize-page",
  "/developer/checksum-verifier",
  "/developer/ssl-expiry-checker",
  "/developer/email-syntax-checker",
  "/developer/password-strength-checker",
  "/developer/og-preview",
  "/generators/utm-builder",
  "/generators/robots-txt-generator",
  "/generators/schema-generator",
  "/generators/qr-code-wifi-vcard",
  "/text/linkedin-formatter",
  "/text/resume-ats-checker",
  "/text/voice-to-text",
  "/converters/shoe-size-converter",
  "/converters/engine-cc-to-hp",
  "/converters/timezone-meeting-planner",
  "/calculators/paint-coverage-calculator",
  "/calculators/pet-age-calculator",
  "/calculators/take-home-pay-calculator",
  "/calculators/ev-charging-cost-calculator",
  "/calculators/subscription-cost-tracker"
)

if ($Only) { $pages = $pages | Where-Object { $_ -like "*$Only*" } }

$total = 0
$failed = 0

foreach ($page in $pages) {
  # Chrome occasionally exits before opening its debugging port; that is a
  # launcher hiccup, not a page failure, so retry the launch once.
  $out = ""
  for ($attempt = 1; $attempt -le 2; $attempt++) {
    try {
      if ($page -like "*voice-to-text*") {
        $out = & $cdp -Url "$Base$page" -Wait 4000 -JsBefore $js -Settle 150000 -Js $js 2>&1 | Out-String
      } else {
        $out = & $cdp -Url "$Base$page" -Wait 4000 -Settle 300 -Js $js 2>&1 | Out-String
      }
    } catch {
      $out = "Error: " + $_.Exception.Message
    }
    if ($out -notmatch "did not open a debugging port") { break }
    Write-Host "  retry $page  (Chrome did not open a debugging port)"
  }
  # The last JSON line is the final evaluation (the second, for two-phase pages).
  $line = ($out -split "`n" | Where-Object { $_ -match '^[\[{]' } | Select-Object -Last 1)

  if (-not $line) {
    $why = ($out -split "`n" | Where-Object { $_ -match 'THREW|Error' } | Select-Object -First 1)
    Write-Host ("NO RESULT  $page  " + $why) -ForegroundColor Red
    $failed += 1
    continue
  }

  $parsed = $line | ConvertFrom-Json
  $checks = if ($parsed -is [System.Array]) { $parsed } else { @($parsed) }

  foreach ($c in $checks) {
    $total += 1
    if ($c.pass) {
      Write-Host ("  ok    " + $page + "  " + $c.name)
    } else {
      $failed += 1
      Write-Host ("  FAIL  " + $page + "  " + $c.name + "  -> " + $c.detail) -ForegroundColor Red
    }
  }
}

Write-Host ""
if ($failed -eq 0) {
  Write-Host "ALL $total CHECKS PASSED" -ForegroundColor Green
} else {
  Write-Host "$failed of $total CHECKS FAILED" -ForegroundColor Red
  exit 1
}
