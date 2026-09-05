# Third interaction suite — the PDF and image file tools. See scripts/smoke3.js.
# Real fixtures are injected as window.__fixtures before the page script runs,
# because shipping test files in public/ would put them on the live site.
param([string]$Base = "http://127.0.0.1:3000", [string]$Only = "")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke3.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

$fixturePath = Join-Path $PSScriptRoot ".out\pdf-fixtures.json"
if (-not (Test-Path $fixturePath)) {
  & node (Join-Path $PSScriptRoot "make-fixtures.mjs") | Out-Null
}
$jsBefore = "window.__fixtures = " + (Get-Content -Raw $fixturePath) + ";"

$pages = @(
  "/pdf/split-pdf",
  "/pdf/extract-pdf-pages",
  "/pdf/delete-pdf-pages",
  "/pdf/rotate-pdf",
  "/pdf/compress-pdf",
  "/pdf/compress-pdf#scan",
  "/pdf/pdf-to-jpg",
  "/pdf/pdf-to-png",
  "/pdf/pdf-to-word",
  "/pdf/jpg-to-pdf",
  "/pdf/word-to-pdf",
  "/image/jpg-to-png",
  "/image/png-to-jpg",
  "/image/webp-to-jpg",
  "/image/resize-image",
  "/image/crop-image",
  "/image/rotate-image",
  "/image/image-converter",
  "/image/image-to-pdf",
  "/image/heic-to-jpg"
)

if ($Only) { $pages = $pages | Where-Object { $_ -like "*$Only*" } }

$total = 0
$failed = 0

foreach ($page in $pages) {
  $out = & $cdp -Url "$Base$page" -Wait 4000 -JsBefore $jsBefore -Settle 500 -Js $js 2>&1 | Out-String
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
