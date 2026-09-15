# Interaction suite for the 13 image tools added in batch 2. See scripts/smoke6.js.
param([string]$Base = "http://127.0.0.1:3000", [string]$Only = "")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke6.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

$pages = @(
  "/image/circle-crop-image",
  "/image/grayscale-image",
  "/image/color-blindness-simulator",
  "/image/svg-to-png",
  "/image/jpg-to-avif",
  "/image/blur-faces-in-photo",
  "/image/youtube-thumbnail-downloader",
  "/image/passport-photo-maker",
  "/image/image-watermark",
  "/image/image-dpi-changer",
  "/image/instagram-image-resizer",
  "/image/png-to-webp",
  "/image/jpg-to-webp"
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
      $out = & $cdp -Url "$Base$page" -Wait 4000 -Settle 400 -Js $js 2>&1 | Out-String
    } catch {
      $out = "Error: " + $_.Exception.Message
    }
    if ($out -notmatch "did not open a debugging port") { break }
    Write-Host "  retry $page  (Chrome did not open a debugging port)"
  }

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
