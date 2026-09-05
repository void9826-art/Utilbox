# Second interaction suite — the tools scripts/smoke.ps1 does not cover.
# Same runner, different page list and script. See scripts/smoke2.js.
param([string]$Base = "http://127.0.0.1:3000", [string]$Only = "")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke2.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

$pages = @(
  "/calculators/age-calculator",
  "/calculators/gpa-calculator",
  "/calculators/cgpa-calculator",
  "/calculators/grade-calculator",
  "/calculators/emi-calculator",
  "/calculators/loan-calculator",
  "/calculators/mortgage-calculator",
  "/calculators/salary-calculator",
  "/calculators/compound-interest-calculator",
  "/calculators/discount-calculator",
  "/converters/weight-converter",
  "/converters/area-converter",
  "/converters/volume-converter",
  "/converters/speed-converter",
  "/converters/time-converter",
  "/converters/data-storage-converter",
  "/converters/currency-converter",
  "/text/character-counter",
  "/text/remove-duplicate-lines",
  "/text/text-reverser",
  "/text/text-cleaner",
  "/developer/json-formatter",
  "/developer/json-validator",
  "/developer/json-to-csv",
  "/developer/base64-decoder",
  "/developer/url-decoder",
  "/developer/html-formatter",
  "/developer/css-formatter",
  "/generators/random-number-generator",
  "/generators/lorem-ipsum-generator",
  "/generators/barcode-generator",
  "/generators/invoice-generator",
  "/generators/resume-generator"
)

if ($Only) { $pages = $pages | Where-Object { $_ -like "*$Only*" } }

$total = 0
$failed = 0

foreach ($page in $pages) {
  $out = & $cdp -Url "$Base$page" -Wait 3500 -Settle 400 -Js $js 2>&1 | Out-String
  $line = ($out -split "`n" | Where-Object { $_ -match '^[\[{]' } | Select-Object -First 1)

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
      Write-Host ("  ok    " + $c.name)
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
