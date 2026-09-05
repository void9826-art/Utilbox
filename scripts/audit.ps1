# Runs scripts/audit.js over a spread of pages, in both themes and at both a
# desktop and a phone width, and prints every problem it finds.
param([string]$Base = "http://127.0.0.1:3000", [string]$Only = "")

$ErrorActionPreference = "Stop"
$audit = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "audit.js")
$cdp = "C:\Users\alienware\WEBSITES\.claude\cdp.ps1"

# The theme is applied first, then the page is given time to finish its colour
# transitions, or the audit measures colours that are still moving.
$setLight = "(async()=>{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';await new Promise(r=>setTimeout(r,700));})()"
$setDark = "(async()=>{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';await new Promise(r=>setTimeout(r,700));})()"

# One page of every shape the site has: home, the full browser, a category, a
# form-heavy calculator, a two-pane editor, a file tool with a dropzone, an
# image tool, a long generator form, and a prose page.
$pages = @(
  "/",
  "/tools",
  "/pdf",
  "/calculators/emi-calculator",
  "/calculators/scientific-calculator",
  "/developer/json-formatter",
  "/pdf/merge-pdf",
  "/image/resize-image",
  "/generators/invoice-generator",
  "/converters/currency-converter",
  "/privacy"
)
if ($Only) { $pages = $pages | Where-Object { $_ -like "*$Only*" } }

$total = 0

foreach ($page in $pages) {
  foreach ($variant in @(
      @{ name = "light 1440"; w = 1440; h = 900; js = $setLight; mobile = $false },
      @{ name = "dark 1440"; w = 1440; h = 900; js = $setDark; mobile = $false },
      @{ name = "light 390"; w = 390; h = 844; js = $setLight; mobile = $true },
      @{ name = "dark 390"; w = 390; h = 844; js = $setDark; mobile = $true },
      # 320 is the narrowest viewport still in use (iPhone SE 1st gen, and any
      # phone at 200% text zoom); 430 is the widest current phone; 768 is where
      # tablet layouts and the mobile navigation swap over.
      @{ name = "light 320"; w = 320; h = 568; js = $setLight; mobile = $true },
      @{ name = "light 375"; w = 375; h = 667; js = $setLight; mobile = $true },
      @{ name = "light 430"; w = 430; h = 932; js = $setLight; mobile = $true },
      @{ name = "light 768"; w = 768; h = 1024; js = $setLight; mobile = $false }
    )) {

    $combined = $variant.js + ";" + $audit
    if ($variant.mobile) {
      $out = & $cdp -Url "$Base$page" -W $variant.w -H $variant.h -Mobile -Wait 3000 -Js $combined 2>&1 | Out-String
    } else {
      $out = & $cdp -Url "$Base$page" -W $variant.w -H $variant.h -Wait 3000 -Js $combined 2>&1 | Out-String
    }

    $line = ($out -split "`n" | Where-Object { $_ -match '^\{' } | Select-Object -First 1)
    if (-not $line) {
      Write-Host "NO RESULT  $page ($($variant.name))" -ForegroundColor Red
      $total += 1
      continue
    }

    $result = $line | ConvertFrom-Json
    $problems = @($result.problems)

    if ($problems.Count -eq 0) {
      Write-Host ("  clean  $page ($($variant.name))") -ForegroundColor Green
    } else {
      Write-Host ("  $page ($($variant.name)) - $($problems.Count) problem(s)") -ForegroundColor Yellow
      # Collapse repeats: the same rule firing on 30 cards is one problem.
      $problems | Group-Object rule | ForEach-Object {
        Write-Host ("    " + $_.Name + " x" + $_.Count + "  e.g. " + $_.Group[0].detail)
      }
      $total += $problems.Count
    }
  }
}

Write-Host ""
if ($total -eq 0) {
  Write-Host "NO ACCESSIBILITY OR LAYOUT PROBLEMS FOUND" -ForegroundColor Green
} else {
  Write-Host "$total problem(s) found" -ForegroundColor Yellow
}
