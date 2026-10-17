# Match each program's shortcut icon to its folder's icon (Astra, 2026-10-17; Flash Audit A53).
# Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
#
# For every pet folder under "Astra's Pet Apps" that has a folder icon (IconResource in its desktop.ini), every
# shortcut (.lnk) in that folder gets the same icon, and so do the copies of that shortcut in the Start menu and on
# the Desktop (same target and arguments). Startup Star's folder is the shell32 star, so its shortcut becomes the star.
# It only changes shortcut icons. It never moves, renames or deletes anything. Run it again any time.
#
#   powershell -ExecutionPolicy Bypass -File .\match-shortcut-icons-20261017.ps1            # fix
#   powershell -ExecutionPolicy Bypass -File .\match-shortcut-icons-20261017.ps1 -WhatIf    # only report
param(
  [string]$Root = (Join-Path $env:USERPROFILE "Documents\Astra's Pet Apps"),
  [switch]$WhatIf
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path -LiteralPath $Root)) { throw "Folder not found: $Root" }
$shell = New-Object -ComObject WScript.Shell
$elsewhere = @(
  (Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"),
  [Environment]::GetFolderPath("Desktop")
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }
$copies = foreach ($d in $elsewhere) { Get-ChildItem -LiteralPath $d -Filter *.lnk -File -Recurse -ErrorAction SilentlyContinue }

function Get-FolderIcon([string]$dir) {
  $ini = Join-Path $dir "desktop.ini"
  if (-not (Test-Path -LiteralPath $ini)) { return $null }
  $line = Get-Content -LiteralPath $ini | Where-Object { $_ -match '^\s*IconResource\s*=' } | Select-Object -First 1
  if (-not $line) { return $null }
  return ($line -split '=', 2)[1].Trim()
}
function Same-Icon([string]$a, [string]$b) {
  return [Environment]::ExpandEnvironmentVariables($a).ToLowerInvariant() -eq [Environment]::ExpandEnvironmentVariables($b).ToLowerInvariant()
}
function Set-Icon($path, [string]$icon) {
  $s = $shell.CreateShortcut($path)
  if (Same-Icon $s.IconLocation $icon) { return $false }
  if (-not $WhatIf) { $s.IconLocation = $icon; $s.Save() }
  return $true
}

$fixed = 0; $already = 0; $noIcon = @(); $noShortcut = @()
foreach ($dir in Get-ChildItem -LiteralPath $Root -Directory) {
  $icon = Get-FolderIcon $dir.FullName
  $links = @(Get-ChildItem -LiteralPath $dir.FullName -Filter *.lnk -File)
  $exes = @(Get-ChildItem -LiteralPath $dir.FullName -Filter *.exe -File)
  if (-not $links.Count) { if ($exes.Count) { $noShortcut += $dir.Name }; continue }
  if (-not $icon) { $noIcon += $dir.Name; continue }
  foreach ($l in $links) {
    $s = $shell.CreateShortcut($l.FullName)
    if (Set-Icon $l.FullName $icon) { $fixed++; Write-Output "$(if ($WhatIf) { 'Would set' } else { 'Set' }) $($dir.Name)\$($l.Name) -> $icon" } else { $already++ }
    foreach ($c in $copies) {
      $o = $shell.CreateShortcut($c.FullName)
      if ($o.TargetPath -and $o.TargetPath -eq $s.TargetPath -and $o.Arguments -eq $s.Arguments) {
        if (Set-Icon $c.FullName $icon) { $fixed++; Write-Output "$(if ($WhatIf) { 'Would set' } else { 'Set' }) $($c.FullName) -> $icon" }
      }
    }
  }
}
Write-Output ""
Write-Output "Shortcuts changed: $fixed. Already matching: $already."
if ($noIcon.Count) { Write-Output "Shortcuts in folders with no folder icon (pick one first): $($noIcon -join ', ')" }
if ($noShortcut.Count) { Write-Output "Programs with no shortcut (the .exe keeps its own icon): $($noShortcut -join ', ')" }
if ($fixed -and -not $WhatIf) { try { & "$env:SystemRoot\System32\ie4uinit.exe" -show } catch { }; Write-Output "Explorer's icon cache refreshed. If an old icon still shows, sign out and back in." }
