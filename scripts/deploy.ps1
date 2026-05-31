# Deploy "Portfolio" (พอร์ทหุ้น) to Vercel production, injecting the Firebase
# env vars from .env.local as both build-time (-b) and runtime (-e) variables.
#
# Usage:
#   $env:VERCEL_TOKEN = "xxxxxxxx"   # https://vercel.com/account/tokens
#   ./scripts/deploy.ps1
param(
  [string]$Token = $env:VERCEL_TOKEN,
  [string]$Scope = $env:VERCEL_SCOPE
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
  Write-Error 'Set a Vercel token first: $env:VERCEL_TOKEN = "..." (https://vercel.com/account/tokens)'
  exit 1
}

if (-not (Test-Path ".env.local")) {
  Write-Error ".env.local not found - add your Firebase config first."
  exit 1
}

# NEXT_PUBLIC_* values must exist at BUILD time (-b) and are also passed at runtime (-e).
$flags = @()
foreach ($line in Get-Content ".env.local") {
  if (-not $line -or $line.TrimStart().StartsWith("#") -or -not $line.Contains("=")) { continue }
  $idx = $line.IndexOf("=")
  $key = $line.Substring(0, $idx).Trim()
  $val = $line.Substring($idx + 1).Trim()
  if ($key -like "NEXT_PUBLIC_*") {
    $flags += @("-b", "$key=$val", "-e", "$key=$val")
  }
}

$scopeArgs = @()
if ($Scope) { $scopeArgs = @("--scope", $Scope) }

Write-Host "Deploying to Vercel (production)..."
npx --yes vercel@latest deploy --prod --yes --token $Token @scopeArgs @flags
