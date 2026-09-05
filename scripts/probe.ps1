param([string]$Base = "http://127.0.0.1:3000", [string[]]$Pages)
$ErrorActionPreference = "Stop"
$js = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "probe.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"
foreach ($page in $Pages) {
  $out = & $cdp -Url "$Base$page" -Wait 3000 -Settle 300 -Js $js 2>&1 | Out-String
  Write-Host "##### $page"
  Write-Host $out
}
