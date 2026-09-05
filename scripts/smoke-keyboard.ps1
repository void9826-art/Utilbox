# Keyboard, focus and dialog behaviour. Run at a desktop width and a phone
# width, because the mobile menu only exists at the narrow one.
param([string]$Base = "http://127.0.0.1:3000")

$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "smoke-keyboard.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

$total = 0
$failed = 0

foreach ($case in @(
    @{ page = "/"; w = 1440; h = 900; mobile = $false },
    @{ page = "/calculators/emi-calculator"; w = 1440; h = 900; mobile = $false },
    @{ page = "/"; w = 390; h = 844; mobile = $true }
  )) {

  $label = "$($case.page) @$($case.w)"
  if ($case.mobile) {
    $out = & $cdp -Url "$Base$($case.page)" -W $case.w -H $case.h -Mobile -Wait 3000 -Settle 400 -Js $js 2>&1 | Out-String
  } else {
    $out = & $cdp -Url "$Base$($case.page)" -W $case.w -H $case.h -Wait 3000 -Settle 400 -Js $js 2>&1 | Out-String
  }

  $line = ($out -split "`n" | Where-Object { $_ -match '^[\[{]' } | Select-Object -First 1)
  if (-not $line) {
    Write-Host ("NO RESULT  $label") -ForegroundColor Red
    $failed += 1
    continue
  }

  $parsed = $line | ConvertFrom-Json
  $checks = if ($parsed -is [System.Array]) { $parsed } else { @($parsed) }

  foreach ($c in $checks) {
    $total += 1
    if ($c.pass) {
      Write-Host ("  ok    [$label] " + $c.name)
    } else {
      $failed += 1
      Write-Host ("  FAIL  [$label] " + $c.name + "  -> " + $c.detail) -ForegroundColor Red
    }
  }
}

Write-Host ""
if ($failed -eq 0) {
  Write-Host "ALL $total KEYBOARD CHECKS PASSED" -ForegroundColor Green
} else {
  Write-Host "$failed of $total CHECKS FAILED" -ForegroundColor Red
  exit 1
}
