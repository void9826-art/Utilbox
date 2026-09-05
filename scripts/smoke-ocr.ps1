# Image to Text (OCR). Two passes: the first warms Tesseract's language model
# into the browser cache and checks the progress states, the second reads the
# recognised text. One pass cannot do both — the model is several megabytes and
# a single CDP evaluation is capped well below the download time.
param([string]$Base = "http://127.0.0.1:3000")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke-ocr.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"
$url = "$Base/image/image-to-text"

$total = 0
$failed = 0

foreach ($pass in @("warm", "measure")) {
  $before = if ($pass -eq "warm") { "window.__ocrWarmOnly = true;" } else { "" }
  $out = & $cdp -Url $url -Wait 3500 -JsBefore $before -Settle 400 -Js $js 2>&1 | Out-String
  $line = ($out -split "`n" | Where-Object { $_ -match '^[\[{]' } | Select-Object -First 1)

  if (-not $line) {
    Write-Host ("NO RESULT  $pass pass") -ForegroundColor Red
    $failed += 1
    continue
  }

  $parsed = $line | ConvertFrom-Json
  $checks = if ($parsed -is [System.Array]) { $parsed } else { @($parsed) }

  foreach ($c in $checks) {
    $total += 1
    if ($c.pass) {
      Write-Host ("  ok    [$pass] " + $c.name)
    } else {
      $failed += 1
      Write-Host ("  FAIL  [$pass] " + $c.name + "  -> " + $c.detail) -ForegroundColor Red
    }
  }
}

Write-Host ""
if ($failed -eq 0) {
  Write-Host "ALL $total OCR CHECKS PASSED" -ForegroundColor Green
} else {
  Write-Host "$failed of $total CHECKS FAILED" -ForegroundColor Red
  exit 1
}
